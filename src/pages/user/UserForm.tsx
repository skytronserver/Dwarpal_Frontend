import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress} from '@mui/material';
import { useCreateUserMutation, useCreateAdminMutation, useUpdateUserMutation, useGetUserByIdQuery } from '../../services/UserApi';
import { UserFormFields } from '../../components/user/userFormFields';
import { Organisation, useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetDepartmentsQuery } from '../../services/DepartmentApi';
import { Field } from '../../types/form.types';
import * as Yup from 'yup';
import { useGetShiftsQuery } from '../../services/shiftApi';
import { useAuth } from '../../hooks/useAuth';

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
  const { hasRole } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  
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
      return null;
    }

    return {
      ...initialData,
      organization: typeof initialData.organization === 'string'
        ? organizationOptions.find(option => option.label === initialData.organization)?.value
        : initialData.organization,
      department: typeof initialData.department === 'string'
        ? departmentOptions.find(option => option.label === initialData.department)?.value
        : initialData.department,
      shift: typeof initialData.shift === 'string'
        ? shifts?.results?.find(shift => shift.id === initialData.shift)?.shift_name
        : initialData.shift
    };
  }, [userData, location.state?.userData, organizationOptions, departmentOptions, shifts]);


  const [values, setValues] = React.useState<UserFormValues | undefined>(modifiedInitialData);

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
      // Remove department from base fields
      if (field.name === 'department') {
        return null;
      }
      return field;
    }).filter(Boolean) as Field[];

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
            { label: 'Approve Guest Pass', value: 'Create Gate Pass' }
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
        if (value !== null && value !== undefined) {
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
        onSuccess?.();
      } else {
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


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {validEditId ? 'Edit User' : 'Create User'}
      </Typography>
      {(isEditLoading || isCreateLoading || isCreateAdminLoading || isOrgsLoading || isDepsLoading || isUserLoading || isShiftsLoading) ? (
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
