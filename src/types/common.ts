import { ReactNode } from 'react';

/**
 * Common interface for pagination
 */
export interface Pagination {
  page: number;
  perPage: number;
  total: number;
}

/**
 * Generic API response
 */
export interface ApiResponse<T> {
  data: T;
  status: {
    success: boolean;
    message?: string;
  };
  pagination?: Pagination;
}

/**
 * API error response
 */
export interface ApiError {
  status?: {
    message: string;
    errors?: string[];
  };
}

/**
 * Common layout container props
 */
export interface LayoutContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Common filter options
 */
export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Common function types
 */
export type VoidFunction = () => void;
export type IdFunction = (id: string) => void;

/**
 * Common event types
 */
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
