import * as Yup from 'yup';
import { Field } from '../../types/form.types';

export const OrganisationFormFields: Field[] = [
  {
    name: 'name',
    label: 'Organisation Name',
    type: 'text',
    required: true,
    validation: Yup.string()
      .required('Organization name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    required: true,
    validation: Yup.string()
      .required('Address is required')
      .min(5, 'Address must be at least 5 characters')
  },
  {
    name: "gst_no",
    label: "GST No",
    type: "text",
    required: true,
    validation: Yup.string()
      .required('GST number is required')
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format')
  },
  {
    name: "no_of_employees",
    label: "No of Employees",
    type: "select",
    required: true,
    options: [
      { label: "1-10", value: "1-10" },
      { label: "11-100", value: "11-100" },
      { label: "101-1000", value: "101-1000" },
      { label: "1001-10000", value: "1001-10000" },
      { label: "10001-100000", value: "10001-100000" },
    ],
    validation: Yup.string()
      .required('Number of employees is required')
      .oneOf(['1-10', '11-100', '101-1000', '1001-10000', '10001-100000'], 'Please select a valid range')
  },
  {
    name: "access_control",
    label: "Access Control",
    type: "checkbox",
    required: true,
    validation: Yup.boolean()
      .required('Access control selection is required')
      .oneOf([true], 'You must accept access control')
  },
];
  