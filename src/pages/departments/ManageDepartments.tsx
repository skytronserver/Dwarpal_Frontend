import { useState } from "react";
import { useDeleteDepartmentMutation, useGetDepartmentsQuery } from "../../services/DepartmentApi";
import { formatFieldName } from "../../utils/formatFeildName";
import CommonTable from "../../components/common/CommonTable";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import { openModal } from '../../features/slices/modalSlice';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { RootState } from '../../features/store';


const ManageDepartments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, error } = useGetDepartmentsQuery({
    search: searchTerm,
    page: page,
    page_size: pageSize,
  });

  const columns = data?.results?.[0]
    ? Object.keys(data.results[0]).map((key) => {
        
        const column: any = {
          field: key,
          headerName: formatFieldName(key),
          width: 150,
        };

        if (key === 'organization') {
          column.renderCell = (params: any) => params.row.organization?.name;
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
  const [deleteDepartment] = useDeleteDepartmentMutation  ();


  const modalData = useSelector((state: RootState) => state.modal.data);

  const handleSearchChange = (searchQuery: string) => {
    setSearchTerm(searchQuery);
    setPage(0);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleView = (row: any) => {
    navigate(`/departments/${row.id}`, { state: { department: row } });
  };


  const handleEdit = (row: any) => {
    navigate(`/departments/new/${row.id}`, { state: { departmentData: row } });
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
    <div>
      { error ? (
        <div>Error loading organisations</div>
      ) : (
        <Box  sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Manage Departments
          </Typography>
          <CommonTable

            data={{
              columns: columns,
              rows: data?.results || [],
              rowCount: data?.count || 0,
              loading: isLoading,
            pageSize: pageSize,
            page: page,
          }}
          onView={(row) => handleView(row)}
          onEdit={(row) => handleEdit(row)}
          onDelete={(row) => handleDelete(row)}
          visibleFields={visibleFields}
          useServerSearch={true}
          onSearchChange={handleSearchChange}
          onPaginationChange={handlePaginationChange}
        />
        <ConfirmationModal
          title="Delete Department"
          message="Are you sure you want to delete this department? This action cannot be undone."
          onConfirm={handleConfirmDelete}
        />

        </Box>
      )}
    </div>
  );
};

export default ManageDepartments;