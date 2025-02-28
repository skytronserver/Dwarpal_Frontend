import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress } from '@mui/material';
import { GatePassFormFields } from '../../components/gatePass/gatePassFormFeilds';
import { useCreateGuestPassMutation } from '../../services/gatePassApi';
import { Organisation, useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetDepartmentsQuery } from '../../services/DepartmentApi';

interface GatePassFormProps {
  onSuccess?: () => void;
}

interface GatePassFormValues {
  id?: string;
  [key: string]: any;
}

const GatePassForm: React.FC<GatePassFormProps> = ({ onSuccess }) => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const initialData = location.state?.gatepassData;
    const [createGatePass, { isLoading }] = useCreateGuestPassMutation();
    const [values, setValues] = React.useState<GatePassFormValues | undefined>(initialData);

    const { data: organizations, isLoading: isOrgsLoading } = useGetOrganisationsQuery({});
    const { data: departments, isLoading: isDepsLoading } = useGetDepartmentsQuery({});
    const updatedDepartments = departments?.results?.filter((dep: any) => dep.organization?.[0]?.id === values?.organization);

    const organizationOptions = organizations?.results?.map((org: Organisation) => ({
        label: org.name,
        value: org.id
    })) || [];

    const departmentOptions = updatedDepartments?.map((dep: any) => ({
        label: dep.name,
        value: dep.id
    })) || [];

    const formFields = React.useMemo(() => {
        return GatePassFormFields.map(field => {
            if (field.name === 'organization') {
                return {
                    ...field,
                    options: organizationOptions
                };
            }
            if (field.name === 'department') {
                return {
                    ...field,
                    options: departmentOptions,
                    disabled: !values?.organization,
                    helperText: !values?.organization ? 'Please select an organization first' : undefined
                };
            }
            return field;
        });
    }, [organizationOptions, departmentOptions, values]);

    const handleFormChange = (newValues: GatePassFormValues) => {
        setValues(newValues);
    };

    const handleSubmit = async (values: GatePassFormValues) => {
        try {
            const formData = new FormData();
            
            // Iterate through all values and append to FormData
            Object.entries(values).forEach(([key, value]) => {
                // Handle file objects specially
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (value !== null && value !== undefined) {
                    // Convert non-null values to string
                    formData.append(key, String(value));
                }
            });

            await createGatePass(formData).unwrap();
            navigate('/gate-passes');
            onSuccess?.();
        } catch (error) {
            console.error('Failed to create gate pass:', error);
            // You might want to add error handling here
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {initialData ? 'Edit Gate Pass' : 'Create Gate Pass'}
            </Typography>
            {(isLoading || isOrgsLoading || isDepsLoading) ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <DynamicForm 
                    fields={formFields}
                    onSubmit={handleSubmit}
                    initialValues={initialData || {}}
                    onChange={handleFormChange}
                />
            )}
        </Box>
    );
};

export default GatePassForm;