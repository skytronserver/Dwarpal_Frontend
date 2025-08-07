import * as Yup from 'yup';
import { Field } from '../../types/form.types';

const activateUserFormFeilds: Field[] = [
    {
        label: "Mobile Number",
        name: "mobile",
        type: "text",
        placeholder: "Enter your mobile number",
        validation: Yup.string().required("Mobile number is required"),
    },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    validation: Yup.string().required("Password is required"),
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",   
    placeholder: "Confirm your password",
    validation: Yup.string().required("Confirm password is required").oneOf([Yup.ref('password')], "Passwords must match"),
  },
  {
    label: "Last 4 digits of ID",
    name: "id_proof_last4",
    type: "text",
    placeholder: "Enter your last 4 digits of ID",
    validation: Yup.string().required("Last 4 digits of ID is required"),
  },
  
]

export default activateUserFormFeilds;