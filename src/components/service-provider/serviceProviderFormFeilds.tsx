import { Field } from "../../types/form.types";
import * as Yup from 'yup';

export const ServiceProviderFormFields: Field[] = [
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
    label: 'Phone Number',
    type: 'text',
    required: true,
    validation: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits')
      .required('Phone number is required')
  },
  {
    name: 'service_provider_type',
    label: 'Service Provider Type',
    type: 'select',
    required: true,
    validation: Yup.string().required('Service provider type is required'),
    options: [
      { label: 'Individual', value: 'INDIVIDUAL' },
      { label: 'Company', value: 'COMPANY' }
    ]
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    required: true,
    validation: Yup.string().required('Address is required')
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
    name: 'authorized_person',
    label: 'Authorized Person Name',
    type: 'text',
    required: true,
    validation: Yup.string().required('Authorized person name is required')
  },
  {
    name: 'authorized_person_mobile',
    label: 'Authorized Person Mobile',
    type: 'text',
    required: true,
    validation: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits')
      .required('Phone number is required')
  },
  {
    name: 'designation',
    label: 'Designation of Authorized Person',
    type: 'text',
    required: true,
    validation: Yup.string().required('Designation of authorized person is required')
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
    name: 'gst_no',
    label: 'GST No',
    type: 'text',
    required: true,
    validation: Yup.string().required('GST number is required')
  },
  {
    name: 'upload_gst_certificate',
    label: 'Upload GST Certificate',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('GST certificate is required')
  },
  {
    name: 'valid_upto',
    label: 'Valid Upto',
    type: 'date',
    required: true,
    validation: Yup.date().required('Valid upto date is required')
  }
];

