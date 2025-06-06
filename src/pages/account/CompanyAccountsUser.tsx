import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Box, CircularProgress, Grid, List, ListItem, ListItemText, Paper, Typography,
  TextField, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DynamicForm from '../../components/common/DynamicForm';
import { CompanyAccountsUserFormFields } from '../../components/accounts/CompanyAccountsUserFormFields';
import { useCreateUserMutation, useUpdateUserMutation, useGetUserByIdQuery } from '../../services/UserApi';
import { useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetShiftsQuery } from '../../services/shiftApi';
import { useGetUsersQuery } from '../../services/UserApi';
import { useAuth } from '../../hooks/useAuth';
import { useSuccessToast, useErrorToast } from '../../components/Toast';

interface AccountFormProps {
  onSuccess?: () => void;
}

interface AccountFormValues {
  id?: string;
  role?: 'ACCOUNT_USER';
  [key: string]: any;
}

const CompanyAccountsUser: React.FC<AccountFormProps> = ({ onSuccess }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  
  const isCreateMode = location.pathname.includes('/new');
  const validEditId = !isCreateMode && id ? parseInt(id) : undefined;
  
  const skip = undefined as any;

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
        role: 'ACCOUNT_USER', 
        department: 'Accounts',
        organization: user?.organization 
      };
    }
    return {
      ...initialData,
      organization: initialData.organization?.id || initialData.organization || initialData.organization_id || user?.organization,
      department: 'Accounts',
      shift: initialData.shift?.id || initialData.shift,
      role: 'ACCOUNT_USER'
    };
  }, [userData, location.state, user]);

  const [values, setValues] = React.useState<AccountFormValues | undefined>(modifiedInitialData);

  const formFields = React.useMemo(() => {
    const baseFields = CompanyAccountsUserFormFields.map(field => {
      if (field.name === 'role') {
        return {
          ...field,
          value: 'ACCOUNT_USER',
          defaultValue: 'ACCOUNT_USER'
        };
      }
      if (field.name === 'organization') {
        const orgValue = values?.organization || user?.organization;
        return {
          ...field,
          options: organizationOptions,
          value: orgValue,
          defaultValue: orgValue
        };
      }
      if (field.name === 'department') {
        return {
          ...field,
          value: 'Accounts',
          defaultValue: 'Accounts'
        };
      }
      return field;
    });

    return baseFields;
  }, [organizationOptions, values?.organization, user]);

  const handleFormChange = (newValues: AccountFormValues) => {
    setValues(newValues);
  };

  const handleSubmit = async (values: AccountFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'role') {
          if (key === 'id_proof_image' && value instanceof File) {
            formData.append(key, value);
          } else if (key !== 'confirm_password') {
            formData.append(key, value.toString());
          }
        }
      });

      // Ensure role is set
      formData.append('role', 'ACCOUNT_USER');

      if (validEditId) {
        const response = await editUser({
          id: validEditId,
          formData
        }).unwrap();
        showSuccessToast(response?.message || '');
        onSuccess?.();
      } else {
        const response = await createUser(formData).unwrap();
        showSuccessToast(response?.message || '');
        navigate('/users');
      }
    } catch (error: any) {
      console.error('Error handling account user:', error);
      showErrorToast(error?.data?.message || '');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Typography variant="h5" gutterBottom>
            {isCreateMode ? 'Create Account User' : 'Edit Account User'}
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
              Account Users
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search account users..."
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

export default CompanyAccountsUser; 