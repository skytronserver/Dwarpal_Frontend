import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import {
  Box, CircularProgress, Grid, List, ListItem, ListItemText, Paper, Typography,
  TextField, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useGetUserByIdQuery } from '../../services/UserApi';
import { useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetUsersQuery } from '../../services/UserApi';
import { useAuth } from '../../hooks/useAuth';
import { useSuccessToast, useErrorToast } from '../../components/Toast';
import { AccountsUserFormFields } from '../../components/accounts/accountsUserFormFields';
import { AccountsFormValues, useCreateAccountsMutation } from '../../services/accountsServices';

interface AccountUserFormProps {
  onSuccess?: () => void;
}



const AccountUserForm: React.FC<AccountUserFormProps> = ({ onSuccess }) => {
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

  // const [editUser, { isLoading: isEditLoading }] = useUpdateUserMutation();
  // const [createUser, { isLoading: isCreateLoading }] = useCreateHrMutation();
  const [createAccountUser, { isLoading: isAccountUserLoading }] = useCreateAccountsMutation();
  const navigate = useNavigate();

  const { data: organizations, isLoading: isOrgsLoading } = useGetOrganisationsQuery({});
  console.log('Raw organizations data:', organizations);
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({ search: searchQuery, page: 1, page_size: 10 });

  const organizationOptions = organizations?.results?.map((org: any) => ({
    label: org.client_name,
    value: org.id
  })) || [];

  const modifiedInitialData = React.useMemo(() => {
    const initialData = userData || location.state?.userData;
    if (!initialData) {
      return {
        role: 'ACCOUNT_USER',
        department: 'ACCOUNTS',
        organization: typeof user?.organization === 'object' && 'client_name' in user.organization ? user.organization.client_name : user?.organization || ''
      };
    }
    return {
      ...initialData,
      organization: typeof initialData.organization === 'object' && 'client_name' in initialData.organization ? initialData.organization.client_name : 
                   initialData.organization || initialData.organization_id || 
                   (typeof user?.organization === 'object' && 'client_name' in user.organization ? user.organization.client_name : user?.organization) || '',
      department: 'ACCOUNTS',
      shift: initialData.shift?.id || initialData.shift,
      role: 'ACCOUNT_USER'
    };
  }, [userData, location.state, user]);

  const [values, setValues] = React.useState<AccountsFormValues | undefined>(modifiedInitialData);

  const formFields = React.useMemo(() => {
    const baseFields = AccountsUserFormFields.map(field => {
      if (field.name === 'role') {
        return {
          ...field,
          value: 'ACCOUNT_USER',
          defaultValue: 'ACCOUNT_USER'
        };
      }
      if (field.name === 'organization') {
        const orgValue = typeof values?.organization === 'object' && 'client_name' in values.organization ? values.organization.client_name :
                        values?.organization || 
                        (typeof user?.organization === 'object' && 'client_name' in user.organization ? user.organization.client_name : user?.organization) || '';
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
          value: 'ACCOUNTS',
          defaultValue: 'ACCOUNTS'
        };
      }
      return field;
    });

    return baseFields;
  }, [organizationOptions, values, user]);


  // const handleFormChange = (newValues: HRFormValues) => {
  //   setValues(newValues);
  // };

    const handleSubmit = async (values: AccountsFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'role') {
          if ((key === 'photo' || key === 'kyc_document' || key === 'pan_upload' || key === 'id_proof_document') && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (validEditId) {
        // const response = await editUser({
        //   id: validEditId,
        //   formData
        // }).unwrap();
        // showSuccessToast(response?.message || '');
        // onSuccess?.();
      } else {
        const response : any = await createAccountUser(formData).unwrap();
        showSuccessToast(response?.message || '');
        setValues(modifiedInitialData);
        onSuccess?.();
      }
    } catch (error: any) {
        console.error('Error handling AccountUser:', error);
      showErrorToast(error?.data?.message || error?.message || 'Failed to create account user');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Typography variant="h5" gutterBottom>
            {isCreateMode ? 'Create AccountUser' : 'Edit AccountUser'}
          </Typography>
          {(isUserLoading || isOrgsLoading || isAccountUserLoading) ? (
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
              Account Users
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search Account Users..."
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

export default AccountUserForm;  