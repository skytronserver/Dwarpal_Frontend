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
    name: 'photo',
    label: 'Photo',
    type: 'file',
    required: false,
    validation: Yup.mixed().optional()
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    disabled: true,
    options: [{ label: 'Account', value: 'ACCOUNT_USER' }],
    validation: Yup.string().required('Role is required')
  },
  {
    name: 'organization',
    label: 'Organization',
    type: 'select',
    required: true,
    disabled: true,
    validation: Yup.string().required('Organization is required')
  },
  {
    name: 'department',
    label: 'Department',
    type: 'select',
    required: true,
    disabled: true,
    options: [{ label: 'Accounts', value: 'ACCOUNTS' }],
    validation: Yup.string().required('Department is required')
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
    name: 'emergency_contact',
    label: 'Emergency Contact',
    type: 'text',
    required: true,
    validation: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Emergency contact is required')
  },
  {
    name: 'date_of_birth',
    label: 'Date of Birth',
    type: 'date',
    required: true,
    validation: Yup.date().required('Date of birth is required')
  },
  {
    name: 'blood_group',
    label: 'Blood Group',
    type: 'text',
    required: true,
    validation: Yup.string().required('Blood group is required')
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
    name: 'pan',
    label: 'PAN Number',
    type: 'text',
    required: true,
    validation: Yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number')
      .required('PAN number is required')
  },
  {
    name: 'pan_upload',
    label: 'PAN Document',
    type: 'file',
    required: false,
    validation: Yup.mixed().optional()
  },
  {
    name: 'id_proof_no',
    label: 'ID Proof Number (Voter Id,Passport,Driving lisense or any Govt Id)',
    type: 'text',
    required: true,
    validation: Yup.string().required('ID proof number is required')
  },
  {
    name: 'id_proof_document',
    label: 'ID Proof Document (Voter Id,Passport,Driving lisense or any Govt Id)',
    type: 'file',
    required: false,
    validation: Yup.mixed().optional()
  },
  {
    name: 'gst_no',
    label: 'GST Number (optional)',
    type: 'text',
    required: false,
    validation: Yup.string().optional()
  },
  {
    name: 'gst_upload',
    label: 'GST Document (optional)',
    type: 'file',
    required: false,
    validation: Yup.mixed().optional()
  },
  {
    name: 'valid_upto',
    label: 'Valid Until',
    type: 'date',
    required: true,
    validation: Yup.date().required('Valid until date is required')
  },
]; 


  