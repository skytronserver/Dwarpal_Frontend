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
      .matches(/^\\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required')
  },
  {
    name:'email',
    label:'Email',
    type:'email',
    required:true,
    validation:Yup.string().email('Invalid email').required('Email is required')
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [],
    validation: Yup.string().required('Role is required')
  },
  {
    name: 'organization',
    label: 'Organization',
    type: 'select',
    required: true,
    validation: Yup.string().required('Organization is required')
  },
  {
    name: 'designation',
    label: 'Company Designation',
    type: 'text',
    required: true,
    validation: Yup.string().required('Designation is required'),
    options: []
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
    validation:Yup.mixed().optional()
  },
  {
    name:'pan',
    label:'Pan',
    type:'text',
    required:true,
    validation:Yup.string().required('Pan is required')
  },
  {
    name:'pan_upload',
    label:'Pan Upload',
    type:'file',
    required:false,
    validation:Yup.mixed().optional()
  },
  {
    name:'id_proof_no',
    label:'ID Proof No',
    type:'text',
    required:true,
    validation:Yup.string().required('ID proof no is required')
  },
  {
    name:'id_proof_document',
    label:'ID Proof Document',
    type:'file',
    required:false,
    validation:Yup.mixed().optional()
  },
  {
    name:'kyc_document',
    label:'Kyc Document',
    type:'file',
    required:false,
    validation:Yup.mixed().optional()
  }
,
{
  name:'valid_upto',
  label:'Valid Upto',
  type:'date',
  required:true,
  validation:Yup.date().required('Valid upto date is required')
}
]; 