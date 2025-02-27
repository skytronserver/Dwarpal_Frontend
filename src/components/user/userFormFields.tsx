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
    label: 'Designation',
    type: 'text',
    required: true,
    validation: Yup.string().required('Designation is required'),
    options: []
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
    required: false
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
]; 