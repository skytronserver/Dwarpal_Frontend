import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress } from '@mui/material';
import { GatePassFormFields } from '../../components/gatePass/gatePassFormFeilds';
import { useCreateGuestPassMutation } from '../../services/gatePassApi';
import { Organisation, useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetDepartmentsQuery } from '../../services/DepartmentApi';
import { useGetUsersQuery } from '../../services/UserApi';
import { useAuth } from '../../hooks/useAuth';

interface GatePassFormProps {
    onSuccess?: () => void;
}

interface GatePassFormValues {
    id?: string;
    [key: string]: any;
}

const GatePassForm: React.FC<GatePassFormProps> = ({ onSuccess }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const initialData = location.state?.gatepassData;
    const [createGatePass, { isLoading }] = useCreateGuestPassMutation();
    const [values, setValues] = React.useState<GatePassFormValues | undefined>({
        ...initialData,
        organization_to_visit: initialData?.organization_to_visit || user?.organization
    });

    const { data: organizations, isLoading: isOrgsLoading } = useGetOrganisationsQuery({});
    const { data: departments, isLoading: isDepsLoading } = useGetDepartmentsQuery({});
    const updatedDepartments = departments?.results?.filter((dep: any) =>
        dep.organization?.[0]?.id === values?.organization_to_visit
    );
    const {data: users,isLoading:isUsersLoading} = useGetUsersQuery({});
    const approverOptions = users?.results?.map((user: any) => ({
        label: user.name,
        value: user.id,    
    })) || [{ label: 'Default Approver', value: 25 }];

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
            if (field.name === 'organization_to_visit') {
                const orgValue = values?.organization_to_visit || user?.organization;
                return {
                    ...field,
                    options: organizationOptions,
                    value: orgValue,
                    defaultValue: orgValue
                };
            }
            if (field.name === 'department_to_visit') {
                return {
                    ...field,
                    options: departmentOptions,
                    disabled: !values?.organization_to_visit,
                    helperText: !values?.organization_to_visit ? 'Please select an organization first' : undefined
                };
            }
            if (field.name === 'assigned_approver') {
                return {
                    ...field,
                    options: approverOptions
                };
            }
            return field;
        });
    }, [organizationOptions, departmentOptions, approverOptions, values, user?.organization]);

    const handleFormChange = (newValues: GatePassFormValues) => {
        setValues(newValues);
    };

    const handleSubmit = async (values: GatePassFormValues) => {
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            await createGatePass(formData).unwrap();
            navigate('/gate-passes');
            onSuccess?.();
        } catch (error) {
            console.error('Failed to create gate pass:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {initialData ? 'Edit Gate Pass' : 'Create Gate Pass'}
            </Typography>
            {(isLoading || isOrgsLoading || isDepsLoading || isUsersLoading) ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <DynamicForm
                    fields={formFields}
                    onSubmit={handleSubmit}
                    initialValues={values || {}}
                    onChange={handleFormChange}
                />
            )}
        </Box>
    );
};

export default GatePassForm;