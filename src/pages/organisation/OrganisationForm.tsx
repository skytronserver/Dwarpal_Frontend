import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { OrganisationFormFields } from '../../components/organisation/organisationFormFeilds';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useCreateOrganisationMutation, useEditOrganisationMutation } from '../../services/OrganisationApi';

interface OrganisationFormProps {
  onSuccess?: () => void;
}

interface OrganisationFormValues {
  id?: string;
  [key: string]: any;
}

const OrganisationForm: React.FC<OrganisationFormProps> = ({ onSuccess }) => {
    const { orgId } = useParams();
    console.log(orgId,'orgId');
    const location = useLocation();
    const initialData = location.state?.organisationData;
    console.log(initialData,'initialData');
    const [editOrganisation, { isLoading: isEditLoading }] = useEditOrganisationMutation();
    const [createOrganisation, { isLoading: isCreateLoading }] = useCreateOrganisationMutation();
    const navigate = useNavigate();
        

    const handleSubmit = async (values: OrganisationFormValues) => {
        const orgs = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key] !== null && values[key] !== undefined) {
                if (typeof values[key] === 'boolean') {
                    orgs.append(key, values[key] ? 'True' : 'False');
                } else {
                    orgs.append(key, values[key]);
                }
            }
        });
        
        try {
            if (initialData && orgId) {
                await editOrganisation({ 
                    id: orgId, 
                    data: orgs 
                }).unwrap();
                onSuccess?.();
            } else {
                await createOrganisation(orgs).unwrap();
                navigate('/organisations');
            }
        } catch (error) {
            console.error('Error handling organisation:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {initialData ? 'Edit Organization' : 'Create Organization'}
            </Typography>
            {isEditLoading || isCreateLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <DynamicForm 
                    fields={OrganisationFormFields} 
                    onSubmit={handleSubmit}
                    initialValues={initialData} 
                />
            )}
        </Box>
    );
};

export default OrganisationForm;