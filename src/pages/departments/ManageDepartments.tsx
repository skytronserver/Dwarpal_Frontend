import { useState } from "react";
import { useDeleteDepartmentMutation, useGetDepartmentsQuery } from "../../services/DepartmentApi";
import { formatFieldName } from "../../utils/formatFeildName";
import CommonTable from "../../components/common/CommonTable";
import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import { openModal } from '../../features/slices/modalSlice';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { RootState } from '../../features/store';
import { ModalState } from '../../features/slices/modalSlice';


const ManageDepartments = () => {
  const navigate = useNavigate();
  const { orgId } = useParams(); // Get orgId from URL params
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, error } = useGetDepartmentsQuery({
    search: searchTerm,
    page: page,
    page_size: pageSize,
    organization: orgId // Add organization filter when orgId is present
  });

  const columns = data?.results?.[0]
    ? Object.keys(data.results[0]).map((key) => {
        
        const column: any = {
          field: key,
          headerName: formatFieldName(key),
          width: 150,
        };

        if (key === 'organization') {
          column.renderCell = (params: any) => params.row.organization?.client_name;
        }

        if (key === 'integrate_with_ai_camera') {
          column.renderCell = (params: any) => {
            return params.row.integrate_with_ai_camera === true ? 'Yes' : 'No';
          };
        }

        return column;
      })
    : [];

  const visibleFields = ['name', 'organization', 'integrate_with_ai_camera']; 

  const dispatch = useDispatch();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const modalData = useSelector((state: RootState) => (state.modal as ModalState).data);

  const handleSearchChange = (searchQuery: string) => {
    setSearchTerm(searchQuery);
    setPage(1);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleView = (row: any) => {
    if (orgId) {
      navigate(`/client/${orgId}/departments/${row.id}`, { state: { department: row } });
    } else {
      navigate(`/departments/${row.id}`, { state: { department: row } });
    }
  };


  const handleEdit = (row: any) => {
    // Update navigation to include orgId if present
    if (orgId) {
      navigate(`/client/${orgId}/departments/new/${row.id}`);
    } else {
      navigate(`/departments/new/${row.id}`);
    }
  }


  const handleDelete = (row: any) => {
    dispatch(
      openModal({
        type: 'DELETE_DEPARTMENT',
        data: row,
      })

    );
  };

  const handleConfirmDelete = async () => {
    const orgId = modalData?.id;
    try {
      await deleteDepartment(orgId).unwrap();
    } catch (error) {
      console.error('Error deleting organisation:', error);
    }

  };

  return (
    <Box sx={{ height: '100%', bgcolor: 'background.default' }}>
      {error ? (
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2 
        }}>
          <Typography variant="h6" color="error">
            Error loading departments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please try again later or contact support if the problem persists.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'medium',
                color: 'text.primary'
              }}
            >
              Manage Departments
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <CommonTable
              data={{
                columns: columns,
                rows: data?.results || [],
                rowCount: data?.count || 0,
                loading: isLoading,
                pageSize: pageSize,
                page: page,
              }}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              visibleFields={visibleFields}
              useServerSearch={true}
              onSearchChange={handleSearchChange}
              onPaginationChange={handlePaginationChange}
            />
          </Box>

          <ConfirmationModal
            title="Delete Department"
            message="Are you sure you want to delete this department? This action cannot be undone."
            onConfirm={handleConfirmDelete}
          />
        </Box>
      )}
    </Box>
  );
};

export default ManageDepartments;