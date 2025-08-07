import React from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { 
    Typography, Box, CircularProgress, List, ListItem, ListItemText, 
    Paper, Grid, TextField, InputAdornment, IconButton, ListItemButton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useCreateDepartmentMutation, useUpdateDepartmentMutation, useGetDepartmentsQuery, type Department, type DepartmentResponse } from '../../services/DepartmentApi';
import { DepartmentFormFields } from '../../components/department/departmentFormFeilds';
import { organisationApi } from '../../services/OrganisationApi';

interface DepartmentFormProps {
  onSuccess?: () => void;
}

interface DepartmentFormValues {
  [key: string]: any;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ onSuccess }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const { id, orgId } = useParams();
    const { data: departmentData, isLoading: isDepartmentLoading } = useGetDepartmentsQuery({
        page: 1, 
        search: searchQuery, 
        page_size: 10,
        organization: orgId
    });
    const { data: organizationData, isLoading: isOrgLoading } = organisationApi.useGetOrganizationByIdQuery(Number(orgId), { 
        skip: !orgId,
        refetchOnMountOrArgChange: true
    });
    const isEditMode = Boolean(id && id !== ':id' && !isNaN(parseInt(id)));
    const [editDepartment, { isLoading: isEditLoading }] = useUpdateDepartmentMutation();
    const [createDepartment, { isLoading: isCreateLoading }] = useCreateDepartmentMutation();
    const navigate = useNavigate();
    const modifiedInitialData = React.useMemo(() => {
        if (isEditMode && departmentData?.data) {
            return {
                ...departmentData.data,
                organization_id: departmentData.data.organization?.id,
                name: departmentData.data.name
            };
        }
        
        // For new department creation with orgId in URL
        if (!isEditMode && orgId && organizationData?.data) {
            return {
                organization_id: organizationData.data.id,
                name: '' // Initialize with empty name
            };
        }
        
        return {
            name: '' // Default empty name
        };
    }, [departmentData, organizationData, isEditMode, orgId]);

    const formFields = React.useMemo(() => {
        const fields = [...DepartmentFormFields];
        const orgField = fields.find(f => f.name === 'organization_id');
        if (orgField && organizationData?.data) {
            orgField.options = [{ label: organizationData.data.client_name, value: organizationData.data.id }];
            orgField.defaultValue = organizationData.data.id;
        }
        return fields;
    }, [organizationData]);

    const handleSubmit = async (values: DepartmentFormValues) => {
        try {
            console.log('Form Values:', values);
            
            if (isEditMode) {
                // Handle single department edit
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        formData.append(key, value.toString());
                    }
                });
                
                console.log('Edit Mode FormData entries:');
                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }
                
                const response = await editDepartment({ 
                    id: parseInt(id!), 
                    data: formData 
                }).unwrap();
                console.log('Department updated successfully:', response);
                onSuccess?.();
            } else {
                // Handle department creation
                const formData = new FormData();
                formData.append('organization_id', values.organization_id.toString());
                
                const departmentName = values.name;
                console.log('Department Name:', departmentName);
                
                if (!departmentName || typeof departmentName !== 'string') {
                    console.error('Department name is missing or invalid:', departmentName);
                    throw new Error('Department name is required');
                }
                
                formData.append('name', departmentName);
                
                console.log('Create Mode FormData entries:');
                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }
                
                const response = await createDepartment(formData).unwrap();
                console.log('Department created successfully:', response);
                navigate(`/client/${orgId}/departments`);
            }
        } catch (error) {
            console.error('Error handling department:', error);
            throw error;
        }
    };

    console.log('Initial Form Data:', modifiedInitialData);
console.log(departmentData,'departmentData');
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <Typography variant="h5" gutterBottom>
                        {isEditMode ? 'Edit Department' : 'Create Department'}
                    </Typography>
                    {(isEditLoading || isCreateLoading || isDepartmentLoading || isOrgLoading) ? (
                        <Box display="flex" justifyContent="center" my={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <DynamicForm 
                            fields={formFields} 
                            onSubmit={handleSubmit}
                            initialValues={modifiedInitialData}
                        />
                    )}
                </Grid>
                <Grid item xs={3}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            All Departments
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search departments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery ? (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setSearchQuery('')}>
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null
                                }}
                            />
                        </Box>
                        {isDepartmentLoading ? (
                            <Box display="flex" justifyContent="center" my={4}>
                                <CircularProgress />
                            </Box>
                        ) : departmentData?.results ? (
                            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {departmentData.results.map((department: Department) => (
                                    <ListItem key={department.id} disablePadding>
                                        <ListItemButton>
                                            <ListItemText 
                                                primary={department.name}
                                                secondary={`Organization: ${department.organization?.client_name || 'N/A'}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography>No departments found</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DepartmentForm;