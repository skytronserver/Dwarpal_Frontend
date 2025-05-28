import { useState } from "react";
import { useDeleteOrganisationMutation, useGetOrganisationsQuery } from "../../services/OrganisationApi";
import { formatFieldName } from "../../utils/formatFeildName";
import CommonTable from "../../components/common/CommonTable";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../features/slices/modalSlice';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { RootState } from '../../features/store';


const Organisations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, error } = useGetOrganisationsQuery({
    search: searchTerm,
    page: page,
    page_size: pageSize,
  });

  const columns = data?.results?.[0] 
    ? Object.keys(data.results[0]).map((key) => ({
        field: key,
        headerName: formatFieldName(key),
        width: 150,
      }))
    : [];

  const visibleFields = ['id', 'name', 'type', 'access_control', 'address', 'gst_no', 'no_of_employees']; 

  const dispatch = useDispatch();
  const [deleteOrganisation] = useDeleteOrganisationMutation();

  const modalData = useSelector((state: RootState) => state.modal.data);

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

  const handleConfirmDelete = async () => {
    const orgId = modalData?.id;
    try {
      await deleteOrganisation(orgId).unwrap();
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
            Manage Organizations
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
          title="Delete Organisation"
          message="Are you sure you want to delete this organisation? This action cannot be undone."
          onConfirm={handleConfirmDelete}
        />
        </Box>
      )}
    </div>
  );
};

export default Organisations;