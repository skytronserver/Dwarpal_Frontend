import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { styled, useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';

interface CommonTableProps {
  data: {
    columns: any[];
    rows: any[];
    rowCount: number;
    loading: boolean;
    pageSize: number;
    page: number;
  };
  visibleFields?: string[];
  useServerSearch?: boolean;
  onSearchChange?: (searchQuery: string) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 'none',
    '& .MuiDataGrid-cell': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: theme.palette.background.default,
      borderBottom: `2px solid ${theme.palette.divider}`,
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '& .MuiDataGrid-root': {
      borderRadius: theme.shape.borderRadius,
    },
    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
      outline: 'none',
    }
  }));  
const CustomToolbar = () => {
  const theme = useTheme();

  return (
    <GridToolbarContainer
      sx={{
        p: 1,
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter
        debounceMs={500}
        sx={{
          width: { xs: '100%', sm: '300px' },
          '& .MuiInputBase-root': {
            height: '36px',
            borderRadius: '8px',
            bgcolor: theme.palette.background.default,
          },
        }}
      />
    </GridToolbarContainer>
  );
};

export default function CommonTable({
  data,
  visibleFields,
  useServerSearch = false,
  onSearchChange,
  onPaginationChange,
  onView,
  onEdit,
  onDelete,
}: CommonTableProps) {
  const columns = React.useMemo(() => {
    const filteredColumns = data.columns.filter((column) => 
      visibleFields?.includes(column.field)
    );

    if (onView || onEdit || onDelete) {
      filteredColumns.push({
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        width: 150,
        renderCell: (params: any) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onView && (
              <IconButton size="small" onClick={() => onView(params.row)}>
                <Visibility fontSize="small" />
              </IconButton>
            )}
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(params.row)}>
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" onClick={() => onDelete(params.row)}>
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        ),
      });
    }
    
    return filteredColumns;
  }, [data.columns, visibleFields, onView, onEdit, onDelete]);

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        p: 2,
        minHeight: '90vh',
        bgcolor: 'background.default',
      }}
    >
      <StyledDataGrid
        {...data}
        columns={columns}
        slots={{ toolbar: CustomToolbar }}
        paginationMode="server"
        onPaginationModelChange={(model) => {
          if (onPaginationChange) {
            onPaginationChange(model.page, model.pageSize);
          }
        }}
        onFilterModelChange={(model) => {
          if (useServerSearch && onSearchChange) {
            onSearchChange(model.quickFilterValues?.[0] ?? '');
          }
        }}
      />
    </Box>
  );
}
