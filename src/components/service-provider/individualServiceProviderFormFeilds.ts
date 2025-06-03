import { Field } from "../../types/form.types";
import * as Yup from 'yup';

export const individualServiceProviderFormFields: Field[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    validation: Yup.string().required('Name is required')
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    required: true,
    validation: Yup.string().email('Invalid email').required('Email is required')
  },
  {
    name: 'phone',
    label: 'Mobile Number',
    type: 'text',
    required: true,
    validation: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits')
      .required('Phone number is required')
  },
  
  {
    name: 'pan',
    label: 'PAN',
    type: 'text',
    required: true,
    validation: Yup.string().required('PAN is required')
  },
  {
    name: 'gst_no',
    label: 'GST No',
    type: 'text',
    required: true,
    validation: Yup.string().required('GST number is required')
  },
  {
    name: 'pan_upload',
    label: 'PAN Upload',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('PAN upload is required')
  },
  {
    name: 'gst_upload',
    label: 'GST Upload',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('GST upload is required')
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    required: true,
    validation: Yup.string().required('Address is required')
  },
  {
    name: 'service_area',
    label: 'Service Area',
    type: 'text',
    required: true,
    validation: Yup.string().required('Service area is required')
  },
  {
    name: 'service_type',
    label: 'Service Type',
    type: 'select',
    required: true,
    validation: Yup.string().required('Service type is required'),
    options: [
      { label: 'Maintenance', value: 'MAINTENANCE' },
      { label: 'Security', value: 'SECURITY' },
      { label: 'Installation', value: 'INSTALLATION' },
      { label: 'Other', value: 'OTHER' }
    ]
  },
  {
    name: 'kyc_document',
    label: 'KYC Document',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('KYC document is required'),
    accept: '.pdf,.doc,.docx'
  },
  {
    name: 'valid_upto',
    label: 'Valid Upto',
    type: 'date',
    required: true,
    validation: Yup.date().required('Valid upto date is required')
  },
  {
    name: 'id_proof_no',
    label: 'ID Proof Number',
    type: 'text',
    required: true,
    validation: Yup.string().required('ID proof no is required')
  },
  {
    name: 'id_proof_document',
    label: 'ID Proof Document',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('ID proof document is required'),
    accept: '.pdf,.doc,.docx'
  },
  {
    name: 'valid_upto',
    label: 'Valid Upto',
    type: 'date',
    required: true,
    validation: Yup.date().required('Valid upto date is required')
  }
];

