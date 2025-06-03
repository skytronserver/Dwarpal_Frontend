import * as Yup from 'yup';
import { Field } from '../../types/form.types';

export const AccountsUserFormFields: Field[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    validation: Yup.string().required('Name is required')
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validation: Yup.string().email('Invalid email address').required('Email is required')
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
    name: 'date_of_birth',
    label: 'Date of Birth',
    type: 'date',
    required: true,
    validation: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required('Date of birth is required')
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
    name: 'pan',
    label: 'PAN',
    type: 'text',
    required: true,
    validation: Yup.string().required('PAN is required')
  },
  {
    name: 'pan_upload',
    label: 'PAN Upload',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('PAN upload is required'),
    accept: 'image/*'
  },
  {
    name: 'id_proof_number',
    label: 'ID Proof Number',
    type: 'text',
    required: true,
    validation: Yup.string().required('ID proof number is required')
  },
  {
    name: 'id_proof_image',
    label: 'ID Proof Image',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('ID proof image is required'),
    accept: 'image/*'
  },
  {
    name: 'photo',
    label: 'Photo',
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
