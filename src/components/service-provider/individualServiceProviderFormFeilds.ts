import { Field } from "../../types/form.types";
import * as Yup from 'yup';

export const individualServiceProviderFormFields: Field[] = [
  {
    name: 'full_name',
    label: 'Full Name',
    type: 'text',
    required: true,
    validation: Yup.string().required('Name is required')
  },
  {
    name: 'photo',
    label: 'Photo',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('Photo is required')
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
    name: 'emergency_contact_number',
    label: 'Emergency Contact',
    type: 'text',
    required: true,
    validation: Yup.string().required('Emergency contact is required')
  },
  {
    name: 'date_of_birth',
    label: 'Date of Birth',
    type: 'date',
    required: true,
    validation: Yup.date().required('Date of birth is required')
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
    validation: Yup.array().min(1, 'Service type is required').required('Service type is required'),
    options: [
      { label: 'Maintenance', value: 'maintenance' },
      { label: 'Security', value: 'security' },
      { label: 'Installation', value: 'installation' },
      { label: 'Other', value: 'other' }
    ]
  },
  {
    name: 'valid_upto',
    label: 'User Validity',
    type: 'date',
    required: true,
    validation: Yup.date().required('Valid upto date is required')
  },
  {
    name: 'id_proof_number',
    label: 'ID Proof Number(Voter Id,Passport,Driving lisense or any Govt Id)',
    type: 'text',
    required: true,
    validation: Yup.string().required('ID proof no is required')
  },  {
    name: 'id_proof_document',
    label: 'ID Proof Document(Voter Id,Passport,Driving lisense or any Govt Id)',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('ID proof document is required'),
    accept: '.pdf,.doc,.docx'
  },
  {
    name: 'pan_number',
    label: 'PAN Number',
    type: 'text',
    required: true,
    validation: Yup.string().required('PAN is required')
  },  
  {
    name: 'pan_file',
    label: 'PAN Upload',
    type: 'file',
    required: true,
    validation: Yup.mixed().required('PAN upload is required')
  },
];

