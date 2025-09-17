/**
 * Base interface for all DTOs
 */
export interface BaseDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Base interface for DTOs that can be soft deleted
 */
export interface SoftDeletableDTO extends BaseDTO {
  deletedAt?: Date | null;
}

/**
 * Base interface for DTOs that belong to a user
 */
export interface UserOwnedDTO extends BaseDTO {
  userId: string;
}

/**
 * Metadata interface for tracking data provenance
 */
export interface MetadataDTO {
  version: number;
  source?: string;
  tags?: string[];
  description?: string;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: string[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: any;
}

/**
 * Pagination interface
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Filter options for querying
 */
export interface FilterOptions {
  [key: string]: any;
}

/**
 * Search options interface
 */
export interface SearchOptions extends PaginationOptions {
  query?: string;
  filters?: FilterOptions;
}
