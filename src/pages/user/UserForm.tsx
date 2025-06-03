import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { 
  Box, CircularProgress, Grid, List, ListItem, ListItemText, Paper, Typography,
  TextField, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useCreateUserMutation, useCreateAdminMutation, useUpdateUserMutation, useGetUserByIdQuery } from '../../services/UserApi';
import { UserFormFields } from '../../components/user/userFormFields';
import { Organisation, useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetDepartmentsQuery } from '../../services/DepartmentApi';
import { Field } from '../../types/form.types';
import * as Yup from 'yup';
import { useGetShiftsQuery } from '../../services/shiftApi';
import { useGetUsersQuery } from '../../services/UserApi';
import { useAuth } from '../../hooks/useAuth';
import { useSuccessToast, useErrorToast } from '../../components/Toast';
interface UserFormProps {
  onSuccess?: () => void;
}

interface UserFormValues {
  id?: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';
  canCreateAdmin?: boolean;
  canManageEmployees?: boolean;
  canViewReports?: boolean;
  [key: string]: any;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { hasRole } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  
  // Check if we're actually in create mode despite having an ID in the URL
  const isCreateMode = location.pathname.includes('/new');
  const validEditId = !isCreateMode && id ? parseInt(id) : undefined;
  
  const skip = undefined as any;

  const { data: userData, isLoading: isUserLoading } = useGetUserByIdQuery(
    validEditId || skip,
    { skip: !validEditId }
  );
  
  const [editUser, { isLoading: isEditLoading }] = useUpdateUserMutation();
  const [createUser, { isLoading: isCreateLoading }] = useCreateUserMutation();
  const [createAdmin, { isLoading: isCreateAdminLoading }] = useCreateAdminMutation();
  const navigate = useNavigate();

  const { data: organizations, isLoading: isOrgsLoading } = useGetOrganisationsQuery({});
  const { data: departments, isLoading: isDepsLoading } = useGetDepartmentsQuery({});
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({ search: searchQuery, page: 1, page_size: 10 });
  const updatedDepartments = departments?.results?.filter((dep: any) => dep.organization?.[0]?.id === userData?.organization);
  const { data: shifts, isLoading: isShiftsLoading } = useGetShiftsQuery({});

  console.log(updatedDepartments,'updatedDepartments');
  const organizationOptions = organizations?.results?.map((org: Organisation) => ({
    label: org.name,
    value: org.id
  })) || [];

  const departmentOptions = updatedDepartments?.map((dep: any) => ({
    label: dep.name,
    value: dep.id
  })) || [];

  const modifiedInitialData = React.useMemo(() => {
    const initialData = userData || location.state?.userData;
    if (!initialData) {
      return { role: 'admin' };
    }
    return {
      ...initialData,
      organization: initialData.organization?.id,
      department: initialData.department?.id,
      shift: initialData.shift?.id,
      role: 'admin'
    };
  }, [userData, location.state]);

  const [values, setValues] = React.useState<UserFormValues | undefined>(modifiedInitialData);

  const formFields = React.useMemo(() => {
    const baseFields = UserFormFields.map(field => {
      if (field.name === 'role') {
        return {
          ...field,
          disabled: true,
          defaultValue: 'admin',
          value: 'admin',
          options: [{ label: 'Admin', value: 'admin' }]
        };
      }
      if (field.name === 'organization') {
        return {
          ...field,
          options: organizations?.results?.map((org: Organisation) => ({
            label: org.name,
            value: org.id
          })) || []
        };
      }
      if (field.name === 'department') {
        return {
          ...field,
          options: updatedDepartments?.map((dep: any) => ({
            label: dep.name,
            value: dep.id
          })) || []
        };
      }
      if (field.name === 'shift') {
        return {
          ...field,
          options: shifts?.results?.map((shift: any) => ({
            label: shift.name,
            value: shift.id
          })) || []
        };
      }
      return field;
    });

    const shouldShowPermissions = hasRole(['ADMIN']) || 
      (values?.role === 'ADMIN') || 
      (userData?.role === 'ADMIN');

    if (shouldShowPermissions) {
      const permissionFields: Field[] = [
        {
          name: 'department',
          label: 'Department',
          type: 'select',
          required: true,
          validation: Yup.string().required('Department is required'),
          options: departmentOptions,
          disabled: !values?.organization,
          helperText: !values?.organization ? 'Please select an organization first' : undefined
        },
        {
          name: 'shift  ',
          label: 'Shift',
          type: 'select',
          required: false,
          validation: Yup.string().required('Shift is required'),
          options: shifts?.results?.map((shift: any) => ({
            label: shift.shift_name,
            value: shift.id
          })) || [],
        },
        {
          name: 'assigned_permissions',
          label: 'Select Priviledges',
          type: 'multi-select',
          required: false,
          validation: Yup.array().of(Yup.string()),
          options: [
            { label: 'Create Guest Pass', value: 'can_create_guest_pass' },
            { label: 'View Guest Pass', value: 'view_guest_pass' },
            { label: 'Attendance Report', value: 'attendance_report' },
            { label: 'Approve Guest Pass', value: 'approve_guest_pass' }
          ]
        }
      ];
      return [...baseFields, ...permissionFields];
    }

    return baseFields;
  }, [organizationOptions, departmentOptions, values, hasRole, userData]);

  const handleFormChange = (newValues: UserFormValues) => {
    setValues(newValues);
  };

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'role') {
          if (key === 'photo' || key === 'kyc_document' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (validEditId) {
        const response = await editUser({
          id: validEditId,
          formData
        }).unwrap();
        console.log('User updated successfully:', response);
        showSuccessToast(response?.message || '');
        onSuccess?.();
      } else {
        const response = hasRole(['SUPERADMIN']) && values.role === 'ADMIN'
          ? await createAdmin(formData).unwrap()
          : await createUser(formData).unwrap();
        console.log('User created successfully:', response);
        showSuccessToast(response?.message || '');
        navigate('/users');
      }
    } catch (error: any) {
      console.error('Error handling user:', error);
      showErrorToast(error?.data?.message || '');
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Typography variant="h5" gutterBottom>
            {isCreateMode ? 'Create Admin' : 'Edit Admin'}
          </Typography>
          {(isEditLoading || isCreateLoading || isCreateAdminLoading || isUserLoading || isOrgsLoading || isDepsLoading || isShiftsLoading) ? (
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
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Users
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search users..."
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
            {isUsersLoading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {users?.results?.map((user: any) => (
                  <ListItem
                    component="div"
                    key={user.id}
                    onClick={() => navigate(`/users/${user.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ListItemText 
                      primary={`${user.name}`}
                      secondary={`${user.email || 'No email'}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForm;
