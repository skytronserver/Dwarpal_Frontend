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

const GatePasses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // Temporary mock data until API is integrated
  const mockData = {
    results: [
      {
        id: 1,
        employee_name: "John Doe",
        organization: "Org 1",
        start_time: "09:00",
        end_time: "17:00",
        purpose: "Client Meeting",
        vehicle_number: "KL-01-1234",
        status: "Approved"
      },
      // Add more mock data as needed
    ],
    count: 1
  };

  const columns = mockData?.results?.[0] 
    ? Object.keys(mockData.results[0]).map((key) => ({
        field: key,
        headerName: formatFieldName(key),
        width: 150,
      }))
    : [];

  const visibleFields = [
    'employee_name',
    'organization',
    'start_time',
    'end_time',
    'purpose',
    'vehicle_number',
    'status'
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
            rows: mockData?.results || [],
            rowCount: mockData?.count || 0,
            loading: false,
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