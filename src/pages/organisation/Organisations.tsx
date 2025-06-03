import { useState } from "react";
import { formatFieldName } from "../../utils/formatFeildName";
import CommonTable from "../../components/common/CommonTable";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { openModal } from '../../features/slices/modalSlice';
import ConfirmationModal from '../../components/common/ConfirmationModal';


const Organisations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Dummy data
  const dummyData = [
    { id: 1, name: 'Example Org', address: '123 Main Street', gst_no: 'GST123456789', no_of_employees: '11-100', access_control: true, attendance: 'yes', departments: ['HR','IT','SALES'], admin: 'John Doe', subscription_plan: 'Premium' },
    { id: 2, name: 'Example Org1', address: '123 Main Street', gst_no: 'GST123456789', no_of_employees: '11-100', access_control: true, attendance: 'yes', departments: ['HR','IT'], admin: 'Jane Smith', subscription_plan: 'Basic' },
    { id: 3, name: 'Police Org2', address: '123 Main Street', gst_no: 'GST123456789', no_of_employees: '11-100', access_control: true, attendance: 'yes', departments: ['HR','IT'], admin: 'Mike Johnson', subscription_plan: 'Premium' },
    { id: 4, name: 'Skytrack', address: 'Cenikuthi,Guwahati', gst_no: '21323', no_of_employees: '1-10', access_control: true, attendance: 'yes', departments: ['HR','IT'], admin: 'Sarah Wilson', subscription_plan: 'Basic' },
    { id: 5, name: 'Haleluya', address: 'heaven', gst_no: '21323', no_of_employees: '1-10', access_control: true, attendance: 'yes', departments: ['HR','IT'], admin: 'Tom Brown', subscription_plan: 'Premium' },
    { id: 6, name: 'Dwarpal', address: 'bulbul nagar', gst_no: '2134tyu3242', no_of_employees: '11-100', access_control: true, attendance: 'yes', departments: ['HR','IT'], admin: 'Lisa Davis', subscription_plan: 'Basic' }
  ];

  const filteredData = dummyData.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const columns = Object.keys(dummyData[0]).map((key) => ({
    field: key,
    headerName: formatFieldName(key),
    width: 150,
  }));

  const visibleFields = ['id', 'name', 'address', 'gst_no', 'no_of_employees', 'access_control', 'attendance', 'departments', 'admin', 'subscription_plan']; 

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