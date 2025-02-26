import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useCreateDepartmentMutation, useUpdateDepartmentMutation } from '../../services/DepartmentApi';
import { DepartmentFormFields } from '../../components/department/departmentFormFeilds';
import { Organisation, useGetOrganisationsQuery } from '../../services/OrganisationApi';

interface DepartmentFormProps {
  onSuccess?: () => void;
}

interface DepartmentFormValues {
  id?: string;
  [key: string]: any;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ onSuccess }) => {
    const { departmentId } = useParams();
    const location = useLocation();
    const initialData = location.state?.departmentData;
    const [editDepartment, { isLoading: isEditLoading }] = useUpdateDepartmentMutation();
    const [createDepartment, { isLoading: isCreateLoading }] = useCreateDepartmentMutation();
    const navigate = useNavigate();
    const { data: organizations, isLoading: isOrgsLoading } = useGetOrganisationsQuery({});
    
    const organizationOptions = organizations?.results?.map((org: Organisation) => ({
        label: org.name,
        value: org.id
    })) || [];

    const modifiedInitialData = React.useMemo(() => {
        if (!initialData) {
            return null;
        }
        
        return {
            ...initialData,
            organization: typeof initialData.organization === 'string' 
                ? organizationOptions.find(option => option.label === initialData.organization)?.value 
                : initialData.organization
        };
    }, [initialData, organizationOptions]);


    const formFields = React.useMemo(() => {
        return DepartmentFormFields.map(field => {
            if (field.name === 'organization') {
                return {
                    ...field,
                    options: organizationOptions
                };
            }
            return field;
        });
    }, [organizationOptions]);

    const handleSubmit = async (values: DepartmentFormValues) => {
        try {
            // Convert boolean to string 'True' or 'False' for FormData
            const formattedValues = {
                ...values,
                organization: values.organization,
                integrate_with_ai_camera: values.integrate_with_ai_camera ? 'True' : 'False'
            };

            // Create FormData
            const formData = new FormData();
            Object.entries(formattedValues).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });
            
            if (initialData && departmentId) {
                const response = await editDepartment({ 
                    id: parseInt(departmentId), 
                    data: formData 
                }).unwrap();
                console.log('Department updated successfully:', response);
                onSuccess?.();
            } else {
                const response = await createDepartment(formData).unwrap();
                console.log('Department created successfully:', response);
                navigate('/departments');
            }
        } catch (error) {
            console.error('Error handling department:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {initialData ? 'Edit Department' : 'Create Department'}
            </Typography>
            {(isEditLoading || isCreateLoading || isOrgsLoading) ? (
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
        </Box>
    );
};

export default DepartmentForm;