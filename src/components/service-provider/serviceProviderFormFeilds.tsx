import { Field } from "../../types/form.types";
import * as Yup from 'yup';

export const ServiceProviderFormFields: Field[] = [
  {
    name: 'full_name',
    label: 'Name of the Company',
    type: 'text',
    required: true,
    validation: Yup.string().required('Company Name is required')
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    required: true,
    validation: Yup.string().email('Invalid email').required('Email is required')
  },
  {
    name: 'phone_number',
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
    name: 'date_of_establishment',
    label: 'Date of Establishment',
    type: 'date',
    required: true,
    validation: Yup.date().required('Date of establishment is required')
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    required: true,
    validation: Yup.string().required('Address is required')
  },
  {
    name: 'district',
    label: 'District',
    type: 'text',
    required: true,
    validation: Yup.string().required('District is required')
  },
  {
    name: 'state',
    label: 'State',
    type: 'text',
    required: true,
    validation: Yup.string().required('State is required')
  },
  {
    name: 'pincode',
    label: 'Pincode',
    type: 'text',
    required: true,
    validation: Yup.string().required('Pincode is required')
  },
  {
    name: 'service_type',
    label: 'Service Type',
    type: 'multi-select',
    required: true,
    validation: Yup.string().required('Service type is required'),
    options: [
      { label: 'Maintenance', value: 'maintenance' },
      { label: 'Security', value: 'security' },
      { label: 'Installation', value: 'installation' },
      { label: 'Other', value: 'other' }
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
  // id proof of authorized person
  {
    name: 'id_proof',
    label: 'ID Proof of Authorized Person(Aadhaar, Pan, etc.)',
    type: 'text',
    required: true,
    validation: Yup.string().required('ID proof is required')
  },
  {
    name: 'id_proof_upload',
    label: 'Upload ID Proof of Authorized Person(Aadhaar, Pan, etc.)',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('ID proof upload is required'),
    accept: '.pdf,.doc,.docx'
  },
  {
    name: 'pan',
    label: 'PAN Number',
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
    accept: '.pdf,.doc,.docx'
  },
  {
    name: 'gst_no',
    label: 'GST Number',
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
    label: 'Company Validity',
    type: 'date',
    required: true,
    validation: Yup.date().required('Valid upto date is required')
  },
];

