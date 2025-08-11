import { useState } from "react";
import { formatFieldName } from "../../utils/formatFeildName";
import CommonTable from "../../components/common/CommonTable";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { openModal } from '../../features/slices/modalSlice';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useGetOrganisationsQuery } from '../../services/OrganisationApi';

const Organisations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { data: orgList, isLoading: isOrgListLoading } = useGetOrganisationsQuery({ search: searchTerm,page: 1, page_size: 100 });
  
  const filteredData = orgList?.results?.filter(org => 
    org.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.address.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const columns = paginatedData.length > 0 ? Object.keys(paginatedData[0]).map((key) => ({
    field: key,
    headerName: formatFieldName(key),
    width: 150,
  })) : [];

  const visibleFields = ['id', 'client_name', 'address', 'gst_no', 'no_of_employees', 'access_control', 'attendance', 'departments', 'admin', 'subscription_plan']; 

  const dispatch = useDispatch();

  const handleSearchChange = (searchQuery: string) => {
    setSearchTerm(searchQuery);
    setPage(1);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleView = (row: any) => {
    navigate(`/organisations/${row.id}`, { state: { organisation: row } });
  };

  const handleEdit = (row: any) => {
    navigate(`/organisations/new/${row.id}`, { state: { organisationData: row } });
  };

  const handleDelete = (row: any) => {
    dispatch(
      openModal({
        type: 'DELETE_ORGANISATION',
        data: row,
      })
    );
  };

  const handleConfirmDelete = () => {
    console.log('Delete operation would happen here');
  };

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Manage Company
        </Typography>
        <CommonTable
          data={{
            columns: columns,
            rows: paginatedData,
            rowCount: filteredData.length,
            loading: false,
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
          title="Delete Organisation"
          message="Are you sure you want to delete this organisation? This action cannot be undone."
          onConfirm={handleConfirmDelete}
        />
        </Box>
    </div>
  );
};

export default Organisations;