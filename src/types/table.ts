import { ReactNode } from 'react';

export interface TableColumn<T> {
  field: keyof T;
  headerName: string;
  width?: number | string;
  sortable?: boolean;
  renderCell?: (row: T) => ReactNode;
}

export interface TableAction<T> {
  icon: ReactNode;
  label: string;
  onClick: (row: T) => void;
}

export interface CommonTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  isLoading?: boolean;
  error?: any;
  emptyMessage?: string;
} 