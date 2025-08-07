import * as Yup from 'yup';
import { Field } from '../../types/form.types';

export const SubscriptionFormFields: Field[] = [
  {
    name: 'title',
    label: 'Subscription Title',
    type: 'text',
    required: true,
    validation: Yup.string().required('Title is required')
  },
  {
    name: 'duration',
    label: 'Duration',
    type: 'select',
    required: true,
    options: [
      { value: '1_month', label: '1 Month' },
      { value: '3_months', label: '3 Months' },
      { value: '6_months', label: '6 Months' },
      { value: '1_year', label: '1 Year' },
      { value: '2_years', label: '2 Years' },
      { value: '3_years', label: '3 Years' },
      { value: '4_years', label: '4 Years' },
      { value: '5_years', label: '5 Years' },
    ],
    validation: Yup.string().required('Duration is required')
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    required: true,
    validation: Yup.number()
      .min(0, 'Price must be positive')
      .required('Price is required')
  },
  {
    name: 'privileges',
    label: 'Privileges',
    type: 'multi-select',
    required: true,   
    options: [
      { value: 'access_control', label: 'Access Control' },
      { value: 'attendance', label: 'Attendance' }
    ],
    validation: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one privilege must be selected')
      .required('Privileges are required')
  },
  {
    name: 'employee_range',
    label: 'Number of Employees',
    type: 'select',
    required: true,
    options: [
      { value: '1-10', label: '1-10' },
      { value: '11-100', label: '11-100' },
      { value: '101-1000', label: '101-1000' },
      { value: '1001-10000', label: '1001-10000' },
      { value: '10001-100000', label: '10001-100000' },
    ],
    validation: Yup.string()
      .required('Number of employees is required')
    },
    {
      name:'number_of_door_locks',
      label:'Number of DoorLocks',
      type:'number',
      required:true,
      validation: Yup.number()
        .min(1, 'Number of devices must be at least 1')
        .required('Number of devices is required')
    },
    {
      name:'number_of_cameras',
      label:'Number of Cameras',
      type:'number',
      required:true,
      validation: Yup.number()
        .min(2, 'Number of cameras must be at least 2')
        .required('Number of cameras is required') 
    },
    {
      name:'guest_pass_limit_per_month',
      label:'Guest Pass Limit (per month)',
      type:'number',
      required:true,
      validation: Yup.number().required('Guest pass limit is required')
    }
    ];
