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

interface TableData {
    columns: any[];
    rows: any[];
    rowCount: number;
    loading: boolean;
    pageSize: number;
    page: number;
    getRowId?: (row: any) => string;
}

interface CommonTableProps {
    data: TableData;
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
      padding: '12px 16px',
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: theme.palette.background.paper,
      borderBottom: `2px solid ${theme.palette.divider}`,
      '& .MuiDataGrid-columnHeader': {
        padding: '12px 16px',
        fontWeight: 600,
      },
    },
    '& .MuiDataGrid-row': {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:hover': {
        backgroundColor: theme.palette.action.selected,
      },
    },
    '& .MuiDataGrid-root': {
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
    },
    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: `2px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
    },
  }));  
const StyledColumnsButton = styled(GridToolbarColumnsButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': { backgroundColor: theme.palette.primary.dark },
}));

const StyledFilterButton = styled(GridToolbarFilterButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': { backgroundColor: theme.palette.primary.dark },
}));

const StyledExportButton = styled(GridToolbarExport)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': { backgroundColor: theme.palette.primary.dark },
}));

const CustomToolbar = () => {
  const theme = useTheme();

  return (
    <GridToolbarContainer
      sx={{
        p: 2,
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        gap: 1.5,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        <StyledColumnsButton />
        <StyledFilterButton />
        <StyledExportButton />
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter
        debounceMs={500}
        sx={{
          width: { xs: '100%', sm: 'auto', minWidth: '300px' },
          '& .MuiInputBase-root': {
            height: '40px',
            borderRadius: '8px',
            bgcolor: theme.palette.background.default,
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
            '& .MuiInputBase-input': {
              padding: '8px 12px',
            },
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
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            opacity: 0.7,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 1
            }
          }}>
            {onView && (
              <IconButton 
                size="small" 
                onClick={() => onView(params.row)}
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.lighter',
                  }
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            )}
            {onEdit && (
              <IconButton 
                size="small" 
                onClick={() => onEdit(params.row)}
                sx={{
                  color: 'warning.main',
                  '&:hover': {
                    backgroundColor: 'warning.lighter',
                  }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton 
                size="small" 
                onClick={() => onDelete(params.row)}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.lighter',
                  }
                }}
              >
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
