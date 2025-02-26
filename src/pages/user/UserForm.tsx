import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress} from '@mui/material';
import { useCreateUserMutation, useUpdateUserMutation, useGetUserByIdQuery } from '../../services/UserApi';
import { UserFormFields } from '../../components/user/userFormFields';
import { Organisation, useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetDepartmentsQuery } from '../../services/DepartmentApi';
import { useAuth } from '../../hooks/useAuth';  
import { Field } from '../../types/form.types';

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
  const { user, hasRole } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  
  const skip = undefined as any;

  // Add getUserById query
  const { data: userData, isLoading: isUserLoading } = useGetUserByIdQuery(
        id ? parseInt(id) : skip,
    { skip: !id }
  );
  
  const [editUser, { isLoading: isEditLoading }] = useUpdateUserMutation();
  const [createUser, { isLoading: isCreateLoading }] = useCreateUserMutation();
  const navigate = useNavigate();

  // Fetch organizations and departments for dropdowns
  const { data: organizations, isLoading: isOrgsLoading } = useGetOrganisationsQuery({});
  const { data: departments, isLoading: isDepsLoading } = useGetDepartmentsQuery({});

  const organizationOptions = organizations?.results?.map((org: Organisation) => ({
    label: org.name,
    value: org.id
  })) || [];

  const departmentOptions = departments?.results?.map((dep: any) => ({
    label: dep.name,
    value: dep.id
  })) || [];

  // Modify initial data to match the form structure
  const modifiedInitialData = React.useMemo(() => {
    const initialData = userData || location.state?.userData;
    if (!initialData) {
      return null;
    }

    return {
      ...initialData,
      organization: typeof initialData.organization === 'string'
        ? organizationOptions.find(option => option.label === initialData.organization)?.value
        : initialData.organization,
      department: typeof initialData.department === 'string'
        ? departmentOptions.find(option => option.label === initialData.department)?.value
        : initialData.department
      
    };
  }, [userData, location.state?.userData, organizationOptions, departmentOptions]);

  const [values, setValues] = React.useState<UserFormValues | undefined>(modifiedInitialData);

  // Update form fields with dynamic options and permissions
  const formFields = React.useMemo(() => {
    const baseFields = UserFormFields.map(field => {
      if (field.name === 'role') {
        return {
          ...field,
          options: hasRole(['SUPERADMIN']) 
            ? [{ label: 'Admin', value: 'ADMIN' }]
            : hasRole(['ADMIN'])
            ? [{ label: 'Employee', value: 'EMPLOYEE' }]
            : []
        };
      }
      if (field.name === 'organization') {
        return {
          ...field,
          options: organizationOptions,
          disabled: values?.role === 'EMPLOYEE'
        };
      }
      if (field.name === 'department') {
        return {
          ...field,
          options: departmentOptions,
          disabled: !values?.organization,
          helperText: !values?.organization ? 'Please select an organization first' : field.helperText
        };
      }
      // Show permission switches only for admin users
      if (['canCreateAdmin', 'canManageEmployees', 'canViewReports'].includes(field.name)) {
        return field;
      }
      return field;
    }) as Field[];

    return baseFields;
  }, [organizationOptions, departmentOptions, values, hasRole]);

  const handleFormChange = (newValues: UserFormValues) => {
    setValues(newValues);
  };

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'photo' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (id) {
        const response = await editUser({
          id: parseInt(id),
          formData
        }).unwrap();
        console.log('User updated successfully:', response);
        onSuccess?.();
      } else {
        const response = await createUser(formData).unwrap();
        console.log('User created successfully:', response);
        navigate('/users');
      }
    } catch (error) {
      console.error('Error handling user:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
          {id ? 'Edit User' : 'Create User'}
      </Typography>
      {(isEditLoading || isCreateLoading || isOrgsLoading || isDepsLoading || isUserLoading) ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DynamicForm
          fields={formFields}
          onSubmit={handleSubmit}
          initialValues={values}
          onChange={handleFormChange}
        />
      )}
    </Box>
  );
};

export default UserForm;
