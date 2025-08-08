import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box } from '@mui/material';
import { useErrorToast, useSuccessToast } from '../../components/Toast';
import { ServiceProviderFormFields } from '../../components/service-provider/serviceProviderFormFeilds';
import { ServiceProviderFirmFormValues, useCreateFirmMutation } from '../../services/serviceProviderService';

interface ServiceProviderFormProps {
  onSuccess?: () => void;
}


const ServiceProviderForm: React.FC<ServiceProviderFormProps> = ({ onSuccess }) => {
  const [createFirm] = useCreateFirmMutation();
  const { id } = useParams();
  const location = useLocation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const navigate = useNavigate();

  const isCreateMode = location.pathname.includes('/new');
  const validEditId = !isCreateMode && id ? parseInt(id) : undefined;

  const [values, setValues] = React.useState<ServiceProviderFirmFormValues>(() => ({
    full_name: '',
    email: '',
    phone_number: '',
    service_provider_type: '',
    service_type: [],
    organization: '',
    department: '',
    photo: undefined,
    kyc_document: undefined,
    gst_no: '',
    upload_gst_certificate: undefined,
    valid_upto: ''
  }));

  const handleFieldChange = (values: Record<string, any>) => {
    const newValues = {
      ...values
    } as ServiceProviderFirmFormValues;
    console.log('Field changed:', newValues);
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };


  const handleSubmit = async (values: ServiceProviderFirmFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if ((key === 'photo' || key === 'id_proof_document' || key === 'pan_file' || key==='authorized_person_id_proof_document' || key==='gst_file') && value instanceof File) {
            formData.append(key, value);
          }
          else if (key === 'service_type') {
            formData.append(key, JSON.stringify(value));
          }
          else {
            formData.append(key, value.toString());
          }
        }
      });

      if (validEditId) {
        // const response = await editServiceProvider({
        //   id: validEditId,
        //   formData
        // }).unwrap();
        // showSuccessToast(response?.message || '');
        onSuccess?.();
      } else {
        const response = await createFirm(formData).unwrap();
        showSuccessToast(response?.message || 'Service provider created successfully');
        // navigate('/service-providers');
      }
    } catch (error: any) {
      console.error('Error handling service provider:', error);
      showErrorToast(error?.data?.message || '');
    }
  };



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {validEditId ? 'Edit Company Service Provider' : 'Create Company Service Provider'}
      </Typography>
      <DynamicForm
        fields={ServiceProviderFormFields}
        onSubmit={handleSubmit}
        initialValues={values}
        onChange={handleFieldChange}
      />
    </Box>
  );
};

export default ServiceProviderForm;
