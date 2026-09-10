export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type ApiError = {
  message: string;
  statusCode: number;
};
