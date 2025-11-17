import { ParamsHandlerDto } from '../dtos/params-handler.dto';

export enum AllowedFilters {
  GreaterOrEqual = 'greaterOrEqual',
  LessOrEqual = 'lessOrEqual',
  NotIn = 'notIn',
  NotEquals = 'notEquals',
  ArrIncludes = 'arrIncludes',
  IncludesString = 'includesString',
  EqualsNumber = 'equalsNumber',
  Equals = 'equals',
  EqualsObjId = 'equalsObjId',
  BoolEquals = 'boolEquals',
  IsDateBetween = 'isDateBetween',
  EqualDateYear = 'year',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CustomQueryBuilder<T = any> {
  _wheres: Record<string, any>;
  _paginate: { limit?: number; offset?: number };
  _orders: Array<[string, 'ASC' | 'DESC']>;
  _selectColumns: string[];
  _blackListedColumns: string[];
  _scopes: Record<string, any>;
  _filterColMappers: Record<string, string>;
  _currentPage: number;
  _perPage: number;
  _requestParams: ParamsHandlerDto & {
    [key: string]: any;
  };

  constructor(params: ParamsHandlerDto, blacklistedColumns?: string[]) {
    this._requestParams = params as any;
    this._wheres = {};
    this._paginate = {};
    this._orders = [];
    this._selectColumns = [];
    this._blackListedColumns = blacklistedColumns || [];
    this._scopes = {};
    this._filterColMappers = {};
  }

  paginate() {
    const defaultLimit = 10;
    const maxLimit = 100;
    const parsedLimit = Math.min(
      maxLimit,
      Math.abs(parseInt(this._requestParams.limit as any, 10)) || defaultLimit,
    );
    const limit = Number.isNaN(parsedLimit) ? defaultLimit : parsedLimit;
    const page = Math.abs(parseInt(this._requestParams.page as any, 10)) || 1;
    this._currentPage = page;
    this._perPage = limit;
    const offset = limit * (page - 1);
    this._paginate = { limit, offset };
    return this;
  }

  order(column: string, direction: 'ASC' | 'DESC' = 'ASC', forced = false) {
    const index = this._orders.findIndex(
      ([existingColumn]) => existingColumn === column,
    );
    if (index === -1) {
      this._orders.push([column, direction]);
    } else if (forced) {
      this._orders[index] = [column, direction];
    }
    return this;
  }

  parseRequestOrder() {
    const orders =
      typeof this._requestParams.orders == 'undefined' ||
      this._requestParams.orders == null ||
      this._requestParams.orders == 'null' ||
      this._requestParams.orders == ''
        ? []
        : JSON.parse(this._requestParams.orders);

    if (orders.length < 1) {
      return this;
    }
    this._orders = [];
    orders.forEach((order) => this.order(order.column, order.direction));
    return this;
  }

  filter(column: string, filter: any) {
    const columnName = this.getMappedFilterCol(column);
    this._wheres[columnName] = filter;
    return this;
  }

  select(...columns: Array<string | string[]>) {
    this._selectColumns = [...this._selectColumns, ...columns?.flat()];
    return this;
  }

  scope(method: (args: any) => any, ...args: any) {
    this._scopes[method.name] = {
      method,
      args,
    };
    return this;
  }

  protected getMappedFilterCol(column: string): string {
    return this._filterColMappers[column] || column;
  }

  getExtraQuery() {}
}
