import { useState } from "react";
import { formatFieldName } from "../../utils/formatFeildName";
import CommonTable from "../../components/common/CommonTable";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { GridColDef } from '@mui/x-data-grid';

// import { openModal } from '../../features/slices/modalSlice';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { RootState } from '../../features/store';
import { useGetUsersQuery, useDeleteUserMutation } from "../../services/UserApi";
import { ModalState } from "../../features/slices/modalSlice";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  const { data, isLoading, error } = useGetUsersQuery({
    search: searchTerm,
    page: page,
    page_size: pageSize,
  });

  const columns = data?.results?.[0] 
    ? Object.keys(data.results[0]).map((key) => {
        const column: GridColDef = {
          field: key,
          headerName: formatFieldName(key),
          width: 150,
        };

        // Handle special formatting for organization and department
        if (key === 'organization' || key === 'department') {
          column.renderCell = (params: any) => 
            params.row[key] ? params.row[key].name : '-';
        }

        // Handle assigned_permissions formatting
        if (key === 'assigned_permissions') {
          column.renderCell = (params: any) => {
            try {
              const permissions = JSON.parse(params.row.assigned_permissions.replace(/'/g, '"'));
              return permissions.join(', ') || '-';
            } catch {
              return '-';
            }
          };
        }

        return column;
      })
    : [];

  const visibleFields = [
    'employee_code',
    'name',
    'shift',
    'department',
    'designation',
    'blood_group',
    'emergency_contact',
    'assigned_permissions',

  ];

  // const dispatch = useDispatch();
  const [deleteUser] = useDeleteUserMutation();
  const modalData = useSelector((state: RootState) => (state.modal as ModalState).data);

  const handleSearchChange = (searchQuery: string) => {
    setSearchTerm(searchQuery);
    setPage(0);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleView = (row: any) => {
    console.log(row,"pppp");
    navigate(`/users/${row.id}`);
  };

  // const handleEdit = (row: any) => {
  //   navigate(`/users/new/${row.id}`);
  // };

  // const handleDelete = (row: any) => {
  //   dispatch(
  //     openModal({
  //       type: 'DELETE_USER',
  //       data: row,
  //     })
  //   );
  // };

  const handleConfirmDelete = async () => {
    const userId = modalData?.id;
    try {
      await deleteUser(userId).unwrap();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      {error ? (
        <div>Error loading users</div>
      ) : (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Manage Users
          </Typography>
          <CommonTable
            data={{
              columns: columns,
              rows: data?.results || [],
              rowCount: data?.count || 0,
              loading: isLoading,
              pageSize: pageSize,
              page: page,
              getRowId: (row) => `${row.name}-${row.emergency_contact}-${row.blood_group}`,
            }}
            onView={handleView}
            // onEdit={handleEdit}
            // onDelete={handleDelete}
            visibleFields={visibleFields}
            useServerSearch={true}
            onSearchChange={handleSearchChange}
            onPaginationChange={handlePaginationChange}
          />
          <ConfirmationModal
            title="Delete User"
            message="Are you sure you want to delete this user? This action cannot be undone."
            onConfirm={handleConfirmDelete}
          />
        </Box>
      )}
    </div>
  );
};

export default ManageUsers;