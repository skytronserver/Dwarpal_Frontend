import * as Yup from 'yup';
import { Field } from '../../types/form.types';

export const OrganisationFormFields: Field[] = [
  {
    name: 'name',
    label: 'Name of the Company',
    type: 'text',
    required: true,
    validation: Yup.string()
    .required('Name of the Company is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    validation: Yup.string().email('Invalid email').required('Email is required')
  },
  {
    name: "contact_number",
    label: "Mobile Number",
    type: "text",
    required: true,
    validation: Yup.string()
      .required('Contact number is required')
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
  },
  {
    name: "date_of_establishment",
    label: "Date of Establishment",
    type: "date",
    required: true,
    validation: Yup.date().required('Date of establishment is required')
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
    name:'district',
    label:'District',
    type:'text',
    required:true,
    validation:Yup.string().required('District is required')
  },
  {
    name:'state',
    label:'State',
    type:'text',
    required:true,
    validation:Yup.string().required('State is required')
  },
  {
    name:'pincode',
    label:'Pincode',
    type:'text',
    required:true,
    validation:Yup.string().required('Pincode is required')
  },
  {
    name: "subscription",
    label: "Subscription",
    type: "select",
    required: true,
    options: [
      { label: "Plan 1", value: "Standard Plan" },
      { label: "Plan 2", value: "plan_2" },
      { label: "Plan 3", value: "plan_3" },
    ],
    validation: Yup.string().required('Subscription is required')
  },
  {
    name: 'valid_upto',
    label: 'Valid Upto',
    type: 'date',
    required: true,
    validation: Yup.date().required('Valid upto date is required')
  },
  {
    name:'pan_no',
    label:'Pan Number',
    type:'text',
    required:true,
    validation:Yup.string().required('Pan number is required')
  },
  {
    name:'pan_upload',
    label:'PAN Upload',
    type:'file',
    required:true,
    validation:Yup.mixed().required('Pan upload is required')
  },
  {
    name: "gst_no",
    label: "GST Number",
    type: "text",
    required: true,
    validation: Yup.string()
      .required('GST number is required')
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format')
  },
  {
    name: "upload_gst_certificate",
    label: "Upload GST Certificate",
    type: "file",
    required: true,
    validation: Yup.mixed().required('GST certificate is required')
  },
];
