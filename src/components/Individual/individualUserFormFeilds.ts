import * as Yup from 'yup';
import { Field } from '../../types/form.types';

export const UserFormFields: Field[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    validation: Yup.string().required('Name is required')
  },
  {
    name: 'phone_number',
    label: 'Mobile Number',
    type: 'text',
    required: true,
    validation: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required')
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validation: Yup.string().email('Invalid email').required('Email is required')
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    required: true,
    validation: Yup.string()
      .required('Address is required')
      .min(5, 'Address must be at least 5 characters')
  },
  {
    name: 'blood_group',
    label: 'Blood Group',
    type: 'text',
    required: true,
    validation: Yup.string().required('Blood group is required')
  },
  {
    name: 'emergency_contact',
    label: 'Emergency Contact',
    type: 'text',
    required: true,
    validation: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Emergency contact is required')
  },
  {
    name: 'photo',
    label: 'Photo',
    type: 'file',
    required: false,
    validation: Yup.mixed().optional()
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validation: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
      .required('Password is required')
  },
  {
    name: 'state',
    label: 'State',
    type: 'text',
    required: true,
    validation: Yup.string().required('State is required')
  },
  {
    name: 'district',
    label: 'District',
    type: 'text',
    required: true,
    validation: Yup.string().required('District is required')
  },
  {
    name: 'pincode',
    label: 'Pincode',
    type: 'text',
    required: true,
    validation: Yup.string().required('Pincode is required')
  },
  {
    name: 'id_proof_no',
    label: 'ID Proof No',
    type: 'text',
    required: true,
    validation: Yup.string().required('ID proof no is required')
  },
  {
    name: 'id_proof_document',
    label: 'ID Proof Document',
    type: 'file',
    required: false,
    validation: Yup.mixed().optional()
  },
  {
    name: 'kyc_document',
    label: 'Kyc Document',
    type: 'file',
    required: false,
    validation: Yup.mixed().optional()
  },
  {
    name: 'valid_upto',
    label: 'Valid Upto',
    type: 'date',
    required: true,
    validation: Yup.date().required('Valid upto date is required')
  }
]; 