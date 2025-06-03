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
      { value: '1', label: '1 Years' },
      { value: '2', label: '2 Years' },
      { value: '3', label: '3 Years' },
      { value: '4', label: '4 Years' },
      { value: '5', label: '5 Years' },
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
    name: 'max_employees',
    label: 'Number of Employees',
    type: 'select',
    required: true,
    options: [
      { value: '1', label: '1/10' },
      { value: '2', label: '10/100' },
      { value: '3', label: '101/1000' },
      { value: '4', label: '1001/10000' },
      { value: '5', label: '10001/100000' },
    ],
    validation: Yup.string()
      .required('Number of employees is required')
    },
    {
      name:'no_of_devices',
      label:'Number of DoorLocks',
      type:'number',
      required:true,
      validation: Yup.number()
        .min(1, 'Number of devices must be at least 1')
        .required('Number of devices is required')
    },
    {
      name:'no_of_cameras',
      label:'Number of Cameras',
      type:'number',
      required:true,
      validation: Yup.number()
        .min(2, 'Number of cameras must be at least 2')
        .required('Number of cameras is required') 
    }
    ];
