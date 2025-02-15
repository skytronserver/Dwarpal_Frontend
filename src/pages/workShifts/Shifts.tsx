import { useState } from "react";
import { formatFieldName } from "../../utils/formatFeildName";
import CommonTable from "../../components/common/CommonTable";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../features/slices/modalSlice';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { RootState } from '../../features/store';
import { ModalState } from "../../features/slices/modalSlice";
import { useDeleteShiftMutation, useGetShiftsQuery } from "../../services/shiftApi";

const Shifts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const {data, isLoading, error} = useGetShiftsQuery({search: searchTerm, page: page, page_size: pageSize});

  const columns = data?.results?.[0] 
    ? Object.keys(data.results[0]).map((key) => ({
        field: key,
        headerName: formatFieldName(key),
        width: 150,
      }))
    : [];

  const visibleFields = [
    'id',
    "shift_name",
    "shift_start_time",
    "shift_end_time",
    "total_work_time",
    "created_by",
  ];

  const dispatch = useDispatch();

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
    navigate(`/shifts/${row.id}`, { state: { shift: row } });
  };

  const handleEdit = (row: any) => {
    navigate(`/shifts/new/${row.id}`, { state: { shiftData: row } });
  }

  const handleDelete = (row: any) => {
    dispatch(
      openModal({
        type: 'DELETE_SHIFT',
        data: row,
      })
    );
  };

  const handleConfirmDelete = async () => {
    const shiftId = modalData?.id;
    try {
      const response = useDeleteShiftMutation(shiftId);
      console.log(response);  
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  return (
    <div>
      {error ? (
        <div>Error loading shifts</div>
      ) : (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Manage Shifts
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
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            visibleFields={visibleFields}
            useServerSearch={true}
            onSearchChange={handleSearchChange}
            onPaginationChange={handlePaginationChange}
          />
          <ConfirmationModal
            title="Delete Shift"
            message="Are you sure you want to delete this shift? This action cannot be undone."
            onConfirm={handleConfirmDelete}
          />
        </Box>
      )}
    </div>
  );
};

export default Shifts;