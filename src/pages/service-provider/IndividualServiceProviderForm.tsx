import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useErrorToast } from '../../components/Toast';

import { Field } from '../../types/form.types';
import * as Yup from 'yup';
import { individualServiceProviderFormFields } from '../../components/service-provider/individualServiceProviderFormFeilds';

interface ServiceProviderFormProps {
  onSuccess?: () => void;
}

interface individualServiceProviderFormValues {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service_provider_type: string;
  company_name?: string;
  service_type: string;
  organization?: string;
  department?: string;
  photo?: File;
  kyc_document?: File;
  gst_no?: string;
  upload_gst_certificate?: File;
  valid_upto?: string;
  [key: string]: any;
}
const ServiceProviderForm: React.FC<ServiceProviderFormProps> = ({ onSuccess }) => {
  const { hasRole } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  // const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const navigate = useNavigate();

  const isCreateMode = location.pathname.includes('/new');
  const validEditId = !isCreateMode && id ? parseInt(id) : undefined;

  const [values, setValues] = React.useState<individualServiceProviderFormValues>(() => ({
    name: '',
    email: '',
    phone: '',
    service_provider_type: '',
    service_type: ''
  }));

  const handleFieldChange = (values: Record<string, any>) => {
    const newValues = {
      ...values
    } as individualServiceProviderFormValues;
    console.log('Field changed:', newValues);
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };


  const handleSubmit = async (values: individualServiceProviderFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if ((key === 'photo' || key === 'kyc_document') && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // TODO: Replace with actual API mutations when available
      if (validEditId) {
        // const response = await editServiceProvider({
        //   id: validEditId,
        //   formData
        // }).unwrap();
        // showSuccessToast(response?.message || '');
        onSuccess?.();
      } else {
        // const response = await createServiceProvider(formData).unwrap();
        // showSuccessToast(response?.message || '');
        navigate('/service-providers');
      }
    } catch (error: any) {
      console.error('Error handling service provider:', error);
      showErrorToast(error?.data?.message || '');
    }
  };



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {validEditId ? 'Edit Individual Service Provider' : 'Create Individual Service Provider'}
      </Typography>
      <DynamicForm
        fields={individualServiceProviderFormFields}
        onSubmit={handleSubmit}
        initialValues={values}
        onChange={handleFieldChange}
      />
    </Box>
  );
};

export default ServiceProviderForm;
