import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { 
  Box, CircularProgress, Grid, List, ListItem, ListItemText, Paper, Typography,
  TextField, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useCreateUserMutation, useUpdateUserMutation, useGetUserByIdQuery } from '../../services/UserApi';
import { useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetShiftsQuery } from '../../services/shiftApi';
import { useGetUsersQuery } from '../../services/UserApi';
import { useAuth } from '../../hooks/useAuth';
import { useSuccessToast, useErrorToast } from '../../components/Toast';
import { HRUserFormFields } from '../../components/hr/HRUserFormFields';
import { Field } from '../../types/form.types';
import { useCreateHrMutation, useCreateHrAccountsMutation } from '../../services/hrServices';

interface HRFormProps {
  onSuccess?: () => void;
}

interface HRFormValues {
  id?: string;
  role?: 'HR & Accounts';
  [key: string]: any;
}

const HRUser: React.FC<HRFormProps> = ({ onSuccess }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  
  const isCreateMode = location.pathname.includes('/new');
  const validEditId = !isCreateMode && id ? parseInt(id) : undefined;
  
  const skip = undefined as any;
  const [createHrAccounts, { isLoading: isCreateHrAccountsLoading }] = useCreateHrAccountsMutation();

  const { data: userData, isLoading: isUserLoading } = useGetUserByIdQuery(
    validEditId || skip,
    { skip: !validEditId }
  );
  
  const [editUser, { isLoading: isEditLoading }] = useUpdateUserMutation();
  const [createUser, { isLoading: isCreateLoading }] = useCreateUserMutation();
  const navigate = useNavigate();

  const { data: organizations, isLoading: isOrgsLoading } = useGetOrganisationsQuery({});
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({ search: searchQuery, page: 1, page_size: 10 });
  const { data: shifts, isLoading: isShiftsLoading } = useGetShiftsQuery({});

  const organizationOptions = organizations?.results?.map((org: any) => ({
    label: org.name,
    value: org.id
  })) || [];

  const modifiedInitialData = React.useMemo(() => {
    const initialData = userData || location.state?.userData;
    if (!initialData) {
      return { 
        role: 'HR & Accounts', 
        department: 'HR',
        organization: user?.organization 
      };
    }
    return {
      ...initialData,
      organization: initialData.organization?.id || initialData.organization || initialData.organization_id || user?.organization,
      department: 'HR',
      shift: initialData.shift?.id || initialData.shift,
      role: 'HR & Accounts'
    };
  }, [userData, location.state, user]);

  const [values, setValues] = React.useState<HRFormValues | undefined>(modifiedInitialData);

  const formFields = React.useMemo(() => {
    const baseFields = HRUserFormFields.map((field: Field) => {
      if (field.name === 'role') {
        return {
          ...field,
          value: 'HR & Accounts',
          defaultValue: 'HR & Accounts'
        };
      }
      if (field.name === 'organization') {
        const orgValue = values?.organization || user?.organization;
        const selectedOrg = organizations?.results?.find(org => org.id === orgValue);
        return {
          ...field,
          options: organizationOptions,
          value: selectedOrg?.id || orgValue,
          defaultValue: selectedOrg?.id || orgValue
        };
      }
      if (field.name === 'department') {
        return {
          ...field,
          value: 'HR',
          defaultValue: 'HR'
        };
      }
      return field;
    });

    return baseFields;
  }, [organizationOptions, values?.organization, user, organizations?.results]);

  const handleFormChange = (newValues: HRFormValues) => {
    setValues(newValues);
  };

  const handleSubmit = async (values: HRFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'role') {
          if (key === 'photo' || key === 'kyc_document' || key === 'pan_upload' || key === 'id_proof_document' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Ensure role is set
      formData.append('role', 'HR & Accounts');

      if (validEditId) {
        const response = await editUser({
          id: validEditId,
          formData
        }).unwrap();
        showSuccessToast(response?.message || '');
        onSuccess?.();
      } else {
        const response = await createHrAccounts(formData).unwrap();
        showSuccessToast(response?.message || '');
        navigate('/users');
      }
    } catch (error: any) {
      console.error('Error handling HR & Accounts:', error);
      showErrorToast(error?.data?.message || '');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Typography variant="h5" gutterBottom>
            {isCreateMode ? 'Create HR & Accounts' : 'Edit HR & Accounts'}
          </Typography>
          {(isEditLoading || isCreateLoading || isUserLoading || isOrgsLoading || isShiftsLoading) ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <DynamicForm
              fields={formFields}
              onSubmit={handleSubmit}
              initialValues={modifiedInitialData}
              onChange={handleFormChange}
            />
          )}
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              HR & Accounts Users
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search HR & Accounts users..."
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

export default HRUser;