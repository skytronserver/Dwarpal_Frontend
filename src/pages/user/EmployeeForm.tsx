import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress} from '@mui/material';
import { useCreateUserMutation, useGetUserByIdQuery } from '../../services/UserApi';
import { EmployeeFormFields } from '../../components/user/employeeFormFeilds';
import { useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetDepartmentsQuery } from '../../services/DepartmentApi';
import { Field } from '../../types/form.types';
import * as Yup from 'yup';
import { useGetShiftsQuery } from '../../services/shiftApi';
import { useAuth } from '../../hooks/useAuth';
import { useSuccessToast, useErrorToast } from '../../components/Toast';

interface Organization {
  id: number;
  client_name: string;
  address: string;
  gst_no: string;
  no_of_employees: string;
  access_control: boolean;
}

interface Department {
  id: number;
  name: string;
  organization: Organization;
  integrate_with_ai_camera: boolean;
}

interface ApiResponse<T> {
  count: number;
  next: null | string;
  previous: null | string;
  current_page: number;
  total_pages: number;
  page_size: number;
  results: T[];
}

interface EmployeeFormProps {
  onSuccess?: () => void;
}

interface EmployeeFormValues {
  id?: string;
  assigned_permissions?: string[];
  organization?: string | number;
  department?: string | number;
  [key: string]: any;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSuccess }) => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
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
  
  // const [editUser, { isLoading: isEditLoading }] = useUpdateUserMutation();
  const [createUser, { isLoading: isCreateLoading }] = useCreateUserMutation();
  const navigate = useNavigate();

  const { data: organizationsData, isLoading: isOrgsLoading } = useGetOrganisationsQuery({});
  const { data: departmentsData, isLoading: isDepsLoading } = useGetDepartmentsQuery({});

  // Get the user's organization
  const userOrganization = user?.organization;

  // Filter departments based on selected organization
  const [selectedOrg, setSelectedOrg] = React.useState<number | undefined>(
    userOrganization ? Number(userOrganization) : undefined
  );

  const organizations = (organizationsData as unknown as ApiResponse<Organization>)?.results || [];
  const departments = (departmentsData as unknown as ApiResponse<Department>)?.results || [];

  const filteredDepartments = React.useMemo(() => {
    return departments.filter(dep => dep.organization.id === selectedOrg);
  }, [departments, selectedOrg]);

  const organizationOptions = organizations.map((org) => ({
    label: org.client_name,
    value: org.id
  }));

  const departmentOptions = filteredDepartments.map((dep) => ({
    label: dep.name,
    value: dep.id
  }));

  const { data: shifts, isLoading: isShiftsLoading } = useGetShiftsQuery({});

  const modifiedInitialData = React.useMemo(() => {
    const initialData = userData || location.state?.userData;
    if (!initialData) {
      return {
        organization: userOrganization
      };
    }

    return {
      ...initialData,
      organization: userOrganization,
      department: typeof initialData.department === 'string'
        ? departmentOptions.find(option => option.label === initialData.department)?.value
        : initialData.department,
      shift: typeof initialData.shift === 'string'
        ? shifts?.results?.find(shift => shift.id === initialData.shift)?.shift_name
        : initialData.shift
    };
  }, [userData, location.state?.userData, userOrganization, departmentOptions, shifts]);

  const [values, setValues] = React.useState<EmployeeFormValues | undefined>(modifiedInitialData);

  // Update selected organization when values change
  React.useEffect(() => {
    if (values?.organization) {
      setSelectedOrg(Number(values.organization));
    }
  }, [values?.organization]);

  const formFields = React.useMemo(() => {
    const baseFields = EmployeeFormFields.map(field => {
      if (field.name === 'role') {
        return null; // Remove role field since it's always EMPLOYEE
      }
      if (field.name === 'organization') {
        const userOrg = organizations.find(org => org.id === Number(userOrganization));
        return {
          ...field,
          options: organizationOptions,
          value: userOrg?.id,
          defaultValue: userOrg?.id,
          disabled: true // Organization is auto-filled and disabled
        };
      }
      if (field.name === 'department') {
        return {
          ...field,
          options: departmentOptions,
          disabled: !selectedOrg,
          helperText: !selectedOrg ? 'Please select an organization first' : undefined,
          required: true
        };
      }
      return field;
    }).filter(Boolean) as Field[];

    // Insert shift and privileges after designation
    const finalFields: Field[] = [];
    for (let i = 0; i < baseFields.length; i++) {
      finalFields.push(baseFields[i]);
      // After designation, add shift and privileges
      if (baseFields[i].name === 'designation') {
        finalFields.push({
          name: 'shift',
          label: 'Shift',
          type: 'select',
          required: false,
          validation: Yup.string().required('Shift is required'),
          options: shifts?.results?.map((shift: any) => ({
            label: shift.shift_name,
            value: shift.id
          })) || [],
        });
        finalFields.push({
          name: 'assigned_permissions',
          label: 'Select Privileges',
          type: 'multi-select',
          required: false,
          validation: Yup.array().of(Yup.string()),
          options: [
            { label: 'Create Guest Pass', value: 'can_create_guest_pass' },
            { label: 'View Guest Pass', value: 'view_guest_pass' },
            { label: 'Attendance Report', value: 'attendance_report' },
            { label: 'Approve Guest Pass', value: 'approve_guest_pass' }
          ]
        });
      }
    }

    return finalFields;
  }, [organizationOptions, departmentOptions, selectedOrg, userOrganization, shifts, organizations]);

  const handleFormChange = (newValues: EmployeeFormValues) => {
    setValues(newValues);
  };

  const handleSubmit = async (values: EmployeeFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'photo' || key === 'kyc_document' || key === 'id_proof_image' || key === 'pan_upload' && value instanceof File) {
            formData.append(key, value);
          } else if (key === 'assigned_permissions' && Array.isArray(value)) {
            value.forEach((permission, index) => {
              formData.append(`assigned_permissions[${index}]`, permission);
            });
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Always set role as EMPLOYEE
      formData.append('role', 'EMPLOYEE');

      // Ensure organization is set
      if (!formData.get('organization')) {
        formData.append('organization', userOrganization?.toString() || '');
      }

      if (validEditId) {
        // const response = await editUser({
        //   id: validEditId,
        //   formData
        // }).unwrap();
        // console.log('User updated successfully:', response);
        // showSuccessToast(response?.message || '');
        // onSuccess?.();
      } else {
        const response = await createUser(formData).unwrap();
        console.log('User created successfully:', response);
        showSuccessToast(response?.message || '');
        navigate('/users');
      }
    } catch (error: any) {
      console.error('Error handling user:', error);
      showErrorToast(error?.data?.detail || '');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {validEditId ? 'Edit Employee' : 'Create Employee'}
      </Typography>
        {(isCreateLoading || isOrgsLoading || isDepsLoading || isUserLoading || isShiftsLoading) ? (
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

export default EmployeeForm;