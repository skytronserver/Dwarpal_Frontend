import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress} from '@mui/material';
import { useCreateUserMutation, useCreateAdminMutation, useUpdateUserMutation, useGetUserByIdQuery } from '../../services/UserApi';
import { UserFormFields } from '../../components/user/userFormFields';
import { Organisation, useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetDepartmentsQuery } from '../../services/DepartmentApi';
import { useAuth } from '../../hooks/useAuth';  
import { Field } from '../../types/form.types';
import * as Yup from 'yup';

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
  
  // Check if we're actually in create mode despite having an ID in the URL
  const isCreateMode = location.pathname.includes('/new');
  const validEditId = !isCreateMode && id ? parseInt(id) : undefined;
  
  const skip = undefined as any;

  // Update getUserById query to use validEditId
  const { data: userData, isLoading: isUserLoading } = useGetUserByIdQuery(
    validEditId || skip,
    { skip: !validEditId }
  );
  
  const [editUser, { isLoading: isEditLoading }] = useUpdateUserMutation();
  const [createUser, { isLoading: isCreateLoading }] = useCreateUserMutation();
  const [createAdmin, { isLoading: isCreateAdminLoading }] = useCreateAdminMutation();
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
      return field;
    }) as Field[];

    // Modify this condition to include when creating/editing an admin
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
          options: [],
        },
        {
          name: 'canCreateAdmin',
          label: 'Can Create Admin',
          type: 'switch',
          required: false,
          validation: Yup.boolean(),
        },
        {
          name: 'canManageEmployees',
          label: 'Can Manage Employees',
          type: 'switch',
          required: false,
          validation: Yup.boolean(),
        },
        {
          name: 'canViewReports',
          label: 'Can View Reports',
          type: 'switch',
          required: false,
          validation: Yup.boolean(),
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
        if (value !== null && value !== undefined) {
          if (key === 'photo' && value instanceof File) {
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
        onSuccess?.();
      } else {
        // Use different mutation based on user role
        const response = hasRole(['SUPERADMIN']) && values.role === 'ADMIN'
          ? await createAdmin(formData).unwrap()
          : await createUser(formData).unwrap();
        console.log('User created successfully:', response);
        navigate('/users');
      }
    } catch (error) {
      console.error('Error handling user:', error);
    }
  };

  console.log(formFields,'ssadsda');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {validEditId ? 'Edit User' : 'Create User'}
      </Typography>
      {(isEditLoading || isCreateLoading || isCreateAdminLoading || isOrgsLoading || isDepsLoading || isUserLoading) ? (
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
