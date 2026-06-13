// Pagination helper for API routes

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function paginate<T>(
  items: T[],
  page: number = 1,
  limit: number = 20
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;

  return {
    data: items.slice(start, end),
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

// Parse pagination params from URL
export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1', 10) || 1;
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10) || 20, 100);
  return { page, limit };
}
