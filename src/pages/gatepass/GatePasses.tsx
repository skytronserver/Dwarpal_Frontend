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
import { useGetGuestPassesQuery } from "../../services/gatePassApi";

const GatePasses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  const { data, isLoading } = useGetGuestPassesQuery();
  console.log(data);
  const updatedData = data?.results
  const columns = updatedData?.[0] 
    ? Object.keys(updatedData[0]).map((key) => ({
        field: key,
        headerName: formatFieldName(key),
        width: 150,
      }))
    : [];

  const visibleFields = [
   'name',
   'visit_date',
   'visit_start_time',
   'visit_end_time',
   'department_to_visit',
   'organization_to_visit',
   'person_to_meet',
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
    navigate(`/gate-passes/${row.id}`, { state: { gatepass: row } });
  };

  const handleEdit = (row: any) => {
    navigate(`/gate-passes/new/${row.id}`, { state: { gatepassData: row } });
  };

  const handleDelete = (row: any) => {
    dispatch(
      openModal({
        type: 'DELETE_GATEPASS',
        data: row,
      })
    );
  };

  const handleConfirmDelete = async () => {
    const gatepassId = modalData?.id;
    try {
      // Add delete mutation here when API is ready
      console.log('Deleting gatepass:', gatepassId);
    } catch (error) {
      console.error('Error deleting gatepass:', error);
    }
  };

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Manage Gate Passes
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
          title="Delete Gate Pass"
          message="Are you sure you want to delete this gate pass? This action cannot be undone."
          onConfirm={handleConfirmDelete}
        />
      </Box>
    </div>
  );
};

export default GatePasses; 