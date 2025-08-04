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
    const { data: departments, isLoading: isDepsLoading } = useGetDepartmentsQuery({
        organization: values?.organization_to_visit
    });

    // Get all users for the organization
    const {data: users, isLoading: isUsersLoading} = useGetUsersQuery({
        organization: values?.organization_to_visit,
        search: '',
        page: 1,
        page_size: 100
    });

    const organizationOptions = organizations?.results?.map((org: Organisation) => ({
        label: org.client_name,
        value: org.id
    })) || [];

    const departmentOptions = departments?.results?.map((dep: any) => ({
        label: dep.name,
        value: dep.id
    })) || [];

    // Filter users based on selected departments
    const filteredUsers = React.useMemo(() => {
        if (!users?.results || !values?.department_to_visit?.length) return [];
        
        return users.results.filter((user: any) => {
            // Check if the user's department matches any of the selected departments
            return values.department_to_visit.some((deptId: number) => 
                user.department === deptId || // For direct department ID match
                user.department?.id === deptId || // For nested department object
                (Array.isArray(user.department) && user.department.some((d: any) => d.id === deptId)) // For array of departments
            );
        });
    }, [users?.results, values?.department_to_visit]);

    const userOptions = React.useMemo(() => {
        if (filteredUsers.length === 0) {
            return [{ label: 'No employees found', value: '', disabled: true }];
        }
        return filteredUsers.map((user: any) => ({
            label: `${user.name}${user.designation ? ` (${user.designation})` : ''}`,
            value: user.id
        }));
    }, [filteredUsers]);

    const formFields = React.useMemo(() => {
        return GatePassFormFields.map(field => {
            if (field.name === 'organization_to_visit') {
                const orgValue = values?.organization_to_visit || user?.organization;
                return {
                    ...field,
                    options: organizationOptions,
                    value: orgValue,
                    defaultValue: orgValue,
                    disabled: true // Make organization field disabled
                };
            }
            if (field.name === 'department_to_visit') {
                return {
                    ...field,
                    options: departmentOptions,
                    disabled: !values?.organization_to_visit,
                    helperText: !values?.organization_to_visit ? 'Please select an organization first' : 
                              departmentOptions.length === 0 ? 'No departments available for selected organization' : undefined
                };
            }
            if (field.name === 'person_to_meet') {
                const noUsersFound = values?.department_to_visit?.length > 0 && filteredUsers.length === 0;
                return {
                    ...field,
                    options: userOptions,
                    disabled: !values?.department_to_visit?.length || noUsersFound,
                    helperText: !values?.department_to_visit?.length ? 'Please select department(s) first' :
                               noUsersFound ? 'No employees found in selected department(s)' : undefined
                };
            }
            return field;
        });
    }, [organizationOptions, departmentOptions, userOptions, values, user?.organization, filteredUsers.length]);

    const handleFormChange = (newValues: GatePassFormValues) => {
        // Reset dependent fields when organization changes
        if (newValues.organization_to_visit !== values?.organization_to_visit) {
            newValues.department_to_visit = [];
            newValues.person_to_meet = null;
        }
        // Reset person to meet when department changes
        if (JSON.stringify(newValues.department_to_visit) !== JSON.stringify(values?.department_to_visit)) {
            newValues.person_to_meet = null;
        }
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