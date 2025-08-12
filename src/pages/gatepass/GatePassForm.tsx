import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress } from '@mui/material';
import { GatePassFormFields } from '../../components/gatePass/gatePassFormFeilds';
import { useCreateGuestPassMutation } from '../../services/gatePassApi';
import { useViewGuestPassSettingsQuery } from '../../services/gatePassApi';
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

    // Load guest pass settings to build select options
    const { data: settings, isLoading: isSettingsLoading } = useViewGuestPassSettingsQuery();

    const guestSettingOptions = (settings || []).map((s: any) => ({
        label: s.title || `Setting #${s.id}`,
        value: s.id
    }));

    const organizationOptions = organizations?.results?.map((org: Organisation) => ({
        label: org.client_name,
        value: org.id
    })) || [];

    const departmentOptions = departments?.results?.map((dep: any) => ({
        label: dep.name,
        value: dep.id
    })) || [];

    // Map department id to name for easier comparison
    const deptIdToName = React.useMemo(() => {
        return new Map<number, string>(departmentOptions.map((opt: any) => [opt.value, opt.label]));
    }, [departmentOptions]);

    // Filter users based on selected departments
    const filteredUsers = React.useMemo(() => {
        if (!users?.results || !values?.department_to_visit?.length) return [];
        
        return users.results.filter((u: any) => {
            return values.department_to_visit.some((deptId: number) => {
                const deptName = deptIdToName.get(deptId);
                const userDept = u.department;

                // Handle various possible shapes
                const matchesById = userDept === deptId || userDept?.id === deptId || (Array.isArray(userDept) && userDept.some((d: any) => d?.id === deptId));
                const matchesByName = (deptName && (
                    userDept === deptName ||
                    userDept?.name === deptName ||
                    (Array.isArray(userDept) && userDept.some((d: any) => d?.name === deptName))
                ));

                return matchesById || matchesByName;
            });
        });
    }, [users?.results, values?.department_to_visit, deptIdToName]);

    const userOptions = React.useMemo(() => {
        if (filteredUsers.length === 0) {
            return [{ label: 'No employees found', value: '', disabled: true }];
        }
        return filteredUsers.map((u: any) => ({
            label: `${u.name || u.user_name || u.email || 'User'}${u.designation ? ` (${u.designation})` : ''}`,
            value: u.id
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
            if (field.name === 'guest_setting') {
                return {
                    ...field,
                    options: guestSettingOptions,
                    disabled: isSettingsLoading || guestSettingOptions.length === 0,
                    helperText: isSettingsLoading
                        ? 'Loading guest settings...'
                        : guestSettingOptions.length === 0
                            ? 'No guest settings available'
                            : undefined
                };
            }
            return field;
        });
    }, [organizationOptions, departmentOptions, userOptions, values, user?.organization, filteredUsers.length, guestSettingOptions, isSettingsLoading]);

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
                } else if (Array.isArray(value)) {
                    // Append array items individually so backend receives multiple values
                    value.forEach((v) => {
                        if (v !== null && v !== undefined && v !== '') {
                            formData.append(key, String(v));
                        }
                    });
                } else if (value !== null && value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            await createGatePass(formData).unwrap();
            navigate('/reports/gate-passes');
        } catch (error) {
            console.error('Failed to create gate pass:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {initialData ? 'Edit Gate Pass' : 'Create Gate Pass'}
            </Typography>
            {(isLoading || isOrgsLoading || isDepsLoading || isUsersLoading || isSettingsLoading) ? (
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