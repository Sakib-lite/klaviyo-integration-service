export const calculateTotalPages = (total: number, perPage: number): number => {
  return perPage > 0 ? Math.ceil(total / perPage) : 1;
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const paginateArray = <T>(
  data: T[],
  page: number = 1,
  limit: number = 10,
): { data: T[]; meta: PaginationMeta } => {
  const total = data.length;
  const maxLimit = Math.min(limit, 100);
  const startIndex = (page - 1) * maxLimit;
  const endIndex = startIndex + maxLimit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    meta: {
      total,
      page,
      limit: maxLimit,
      totalPages: calculateTotalPages(total, maxLimit),
    },
  };
};
