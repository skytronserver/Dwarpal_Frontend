import * as Yup from 'yup';
import { Field } from '../../types/form.types';

export const CompanyAccountsUserFormFields: Field[] = [
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
    disabled: true,
    options: [{ label: 'Account User', value: 'account_user' }],
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
    options: [{ label: 'Accounts', value: 'Accounts' }],
    validation: Yup.string().required('Department is required')
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validation: Yup.string().email('Invalid email').required('Email is required')
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
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
    validation: Yup.date().required('Date of birth is required')
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
    validation: Yup.mixed().required('ID proof image is required')
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validation: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required')
  },
  {
    name: 'confirm_password',
    label: 'Confirm Password',
    type: 'password',
    required: true,
    validation: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required')
  },
  {
    name: 'can_manage_users',
    label: 'Can Manage Users',
    type: 'checkbox',
    required: false
  },
  {
    name: 'can_manage_departments',
    label: 'Can Manage Departments',
    type: 'checkbox',
    required: false
  },
  {
    name: 'can_manage_shifts',
    label: 'Can Manage Shifts',
    type: 'checkbox',
    required: false
  },
  {
    name: 'can_manage_holidays',
    label: 'Can Manage Holidays',
    type: 'checkbox',
    required: false
  },
  {
    name: 'can_manage_attendance',
    label: 'Can Manage Attendance',
    type: 'checkbox',
    required: false
  },
  {
    name: 'can_manage_gatepass',
    label: 'Can Manage Gatepass',
    type: 'checkbox',
    required: false
  },
  {
    name: 'can_view_reports',
    label: 'Can View Reports',
    type: 'checkbox',
    required: false
  }
]; 