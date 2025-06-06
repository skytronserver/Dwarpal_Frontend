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
    validation: Yup.string().email('Invalid email address').required('Email is required')
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
    name: 'valid_upto',
    label: 'Valid Upto',
    type: 'date',
    required: true,
    validation: Yup.date().required('Valid upto date is required')
  },
  {
    name: 'id_proof_number',
    label: 'ID Proof Number(Voter Id,Passport,Driving lisense or any Govt Id)',
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
    accept: 'image/*'
  },    
  {
    name: 'gst_number',
    label: 'GST Number(optional)',
    type: 'text',
    required: false,
    validation: Yup.string().optional()
  },
  {
    name: 'gst_upload',
    label: 'GST Upload(optional)',
    type: 'file',
    required: false,
    validation: Yup.mixed().optional()
  },
 
];
