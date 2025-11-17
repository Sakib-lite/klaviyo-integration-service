import { AllowedFilters, CustomQueryBuilder } from './custom-query-builder';
import { SelectQueryBuilder, Brackets, ObjectLiteral } from 'typeorm';
import { ROW_STATUS } from '../enums/common';

export function escapeRegExp(val: string): string {
  return val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class CustomTypeOrmQueryBuilder<T = any> extends CustomQueryBuilder<T> {
  parseRequestFilter() {
    const filters = {};
    const parsedFilters =
      typeof this._requestParams.filters == 'undefined' ||
      this._requestParams.filters == null ||
      this._requestParams.filters == 'null' ||
      this._requestParams.filters == ''
        ? []
        : JSON.parse(this._requestParams.filters);

    if (this._requestParams?.start_date) {
      this._wheres['createdAt_gte'] = new Date(this._requestParams?.start_date);
    }

    if (this._requestParams?.end_date) {
      this._wheres['createdAt_lte'] = new Date(this._requestParams?.end_date);
    }

    parsedFilters.forEach((item) => {
      switch (item.type) {
        case AllowedFilters.IncludesString:
          if (item?.value !== null && item?.value !== '') {
            filters[`${item.column}_like`] = `%${item.value}%`;
          }
          break;
        case AllowedFilters.GreaterOrEqual:
          if (item?.value != 0) filters[`${item.column}_gte`] = item.value;
          break;
        case AllowedFilters.LessOrEqual:
          if (item?.value != 0) filters[`${item.column}_lte`] = item.value;
          break;
        case AllowedFilters.NotEquals:
          if (item?.value != '') filters[`${item.column}_ne`] = item.value;
          break;
        case AllowedFilters.NotIn:
          if (Array.isArray(item?.value) && item?.value.length > 0) {
            filters[`${item.column}_nin`] = item.value;
          }
          break;
        case AllowedFilters.ArrIncludes:
          if (item?.value) {
            filters[`${item.column}_in`] = Array.isArray(item.value)
              ? item.value
              : [item.value];
          }
          break;
        case AllowedFilters.IsDateBetween:
          if (item?.value?.from) {
            filters[`${item.column}_gte`] = new Date(item.value.from);
          }
          if (item?.value?.to) {
            const date = new Date(item.value.to);
            date.setHours(23, 59, 59, 999);
            filters[`${item.column}_lte`] = date;
          }
          break;
        case AllowedFilters.EqualsNumber:
          filters[item?.column] = Number(item.value);
          break;
        case AllowedFilters.BoolEquals:
          filters[item?.column] = Boolean(
            item.value == 'true' || item.value === true,
          );
          break;
        case AllowedFilters.EqualDateYear:
          if (item?.value) {
            const year = parseInt(item.value);
            filters[`${item.column}_gte`] = new Date(`${year}-01-01`);
            filters[`${item.column}_lt`] = new Date(`${year + 1}-01-01`);
          }
          break;
        case AllowedFilters.Equals:
        default:
          filters[item?.column] = item.value;
      }
    });
    this._wheres = { ...this._wheres, ...filters };
    return this;
  }

  globalSearch(
    searchableColumns: Array<string | ((searchValue: string) => any)>,
  ) {
    if (
      this._requestParams.search !== undefined &&
      this._requestParams.search?.trim().length
    ) {
      const searchValue = String(this._requestParams.search.trim());
      this._wheres['_globalSearch'] = {
        columns: searchableColumns,
        value: searchValue,
      };
    }
    return this;
  }

  applyToQueryBuilder(
    queryBuilder: SelectQueryBuilder<T & ObjectLiteral>,
    alias: string,
  ): SelectQueryBuilder<T & ObjectLiteral> {
    // Apply where conditions
    Object.keys(this._wheres).forEach((key) => {
      if (key === '_globalSearch') {
        const globalSearch = this._wheres[key];
        queryBuilder.andWhere(
          new Brackets((qb) => {
            globalSearch.columns.forEach((column: string, index: number) => {
              const paramName = `search_${index}`;
              if (index === 0) {
                qb.where(`${alias}.${column} LIKE :${paramName}`, {
                  [paramName]: `%${globalSearch.value}%`,
                });
              } else {
                qb.orWhere(`${alias}.${column} LIKE :${paramName}`, {
                  [paramName]: `%${globalSearch.value}%`,
                });
              }
            });
          }),
        );
      } else if (key.endsWith('_like')) {
        const column = key.replace('_like', '');
        queryBuilder.andWhere(`${alias}.${column} LIKE :${key}`, {
          [key]: this._wheres[key],
        });
      } else if (key.endsWith('_gte')) {
        const column = key.replace('_gte', '');
        queryBuilder.andWhere(`${alias}.${column} >= :${key}`, {
          [key]: this._wheres[key],
        });
      } else if (key.endsWith('_lte')) {
        const column = key.replace('_lte', '');
        queryBuilder.andWhere(`${alias}.${column} <= :${key}`, {
          [key]: this._wheres[key],
        });
      } else if (key.endsWith('_lt')) {
        const column = key.replace('_lt', '');
        queryBuilder.andWhere(`${alias}.${column} < :${key}`, {
          [key]: this._wheres[key],
        });
      } else if (key.endsWith('_ne')) {
        const column = key.replace('_ne', '');
        queryBuilder.andWhere(`${alias}.${column} != :${key}`, {
          [key]: this._wheres[key],
        });
      } else if (key.endsWith('_in')) {
        const column = key.replace('_in', '');
        queryBuilder.andWhere(`${alias}.${column} IN (:...${key})`, {
          [key]: this._wheres[key],
        });
      } else if (key.endsWith('_nin')) {
        const column = key.replace('_nin', '');
        queryBuilder.andWhere(`${alias}.${column} NOT IN (:...${key})`, {
          [key]: this._wheres[key],
        });
      } else {
        queryBuilder.andWhere(`${alias}.${key} = :${key}`, {
          [key]: this._wheres[key],
        });
      }
    });

    // Apply soft delete filter (exclude deleted records by default)
    if (!this._wheres['status']) {
      queryBuilder.andWhere(`${alias}.status != :deletedStatus`, {
        deletedStatus: ROW_STATUS.DELETED,
      });
    }

    // Apply ordering
    if (this._orders.length > 0) {
      this._orders.forEach(([column, direction]) => {
        queryBuilder.addOrderBy(`${alias}.${column}`, direction);
      });
    }

    // Apply pagination
    if (this._paginate.limit) {
      queryBuilder.take(this._paginate.limit);
    }
    if (this._paginate.offset) {
      queryBuilder.skip(this._paginate.offset);
    }

    return queryBuilder;
  }

  ignoreSoftDeletes() {
    return this;
  }

  addSoftDeletes() {
    this._wheres['status'] = ROW_STATUS.DELETED;
    return this;
  }
}
