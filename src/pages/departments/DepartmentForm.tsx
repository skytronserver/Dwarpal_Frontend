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
    const { data: departmentData, isLoading: isDepartmentLoading } = useGetDepartmentsQuery({page: 1, search: searchQuery, page_size: 10});
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
                organization: departmentData.data.organization?.id,
                departments: [{ name: departmentData.data.name }]
            };
        }
        
        // For new department creation with orgId in URL
        if (!isEditMode && orgId && organizationData?.data) {
            return {
                organization: organizationData.data.id,
                departments: [{ name: '' }] // Initialize with one empty department
            };
        }
        
        return undefined;
    }, [departmentData, organizationData, isEditMode, orgId]);

    const formFields = React.useMemo(() => {
        const fields = [...DepartmentFormFields];
        const orgField = fields.find(f => f.name === 'organization');
        if (orgField && organizationData?.data) {
            orgField.options = [{ label: organizationData.data.name, value: organizationData.data.id }];
            orgField.defaultValue = organizationData.data.id;
        }
        return fields;
    }, [organizationData]);

    const handleSubmit = async (values: DepartmentFormValues) => {
        try {
            if (isEditMode) {
                // Handle single department edit
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        formData.append(key, value.toString());
                    }
                });
                
                const response = await editDepartment({ 
                    id: parseInt(id!), 
                    data: formData 
                }).unwrap();
                console.log('Department updated successfully:', response);
                onSuccess?.();
            } else {
                // Handle multiple departments creation
                const departments = values.departments || [];
                const organization = values.organization;
                
                // Create each department
                for (const dept of departments) {
                    const formData = new FormData();
                    formData.append('organization', organization.toString());
                    formData.append('name', dept.name);
                    
                    await createDepartment(formData).unwrap();
                }
                
                console.log('Departments created successfully');
                navigate('/departments');
            }
        } catch (error) {
            console.error('Error handling department:', error);
        }
    };

    console.log(modifiedInitialData,'modifiedInitialData');
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
                                                secondary={`Organization: ${department.organization?.name || 'N/A'}`}
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