import React from 'react';
import { useNavigate } from 'react-router-dom';
import GuestPassSettingsForm from '../../components/gatePass/GuestPassSettingsForm';
import { useSuccessToast, useErrorToast } from '../../components/Toast';

const GuestPassSettings: React.FC = () => {
    const navigate = useNavigate();
    const showSuccessToast = useSuccessToast();
    const showErrorToast = useErrorToast();

    const handleSubmit = async (values: any) => {
        try {
            // TODO: Implement API call to save settings
            console.log('Saving settings:', values);
            showSuccessToast('Guest pass settings saved successfully');
            navigate('/gate-passes');
        } catch (error) {
            console.error('Error saving settings:', error);
            showErrorToast('Failed to save guest pass settings');
        }
    };

    const handleCancel = () => {
        navigate('/gate-passes');
    };

    return (
        <GuestPassSettingsForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
};

export default GuestPassSettings; 