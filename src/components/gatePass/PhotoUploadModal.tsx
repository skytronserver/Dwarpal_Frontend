import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Tab,
    Tabs,
    Typography,
    Alert,
} from '@mui/material';
import Webcam from 'react-webcam';

interface PhotoUploadModalProps {
    open: boolean;
    onClose: () => void;
    onPhotoSelect: (photo: File | null) => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ open, onClose, onPhotoSelect }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [webcamError, setWebcamError] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset error when modal opens/closes
    useEffect(() => {
        if (!open) {
            setWebcamError(null);
        }
    }, [open]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setWebcamError(null); // Reset error on tab change
    };

    const handleCapture = async () => {
        if (webcamRef.current) {
            try {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    // Convert base64 to file
                    const res = await fetch(imageSrc);
                    const blob = await res.blob();
                    const file = new File([blob], "webcam-photo.jpg", { type: "image/jpeg" });
                    onPhotoSelect(file);
                    onClose();
                } else {
                    setWebcamError("Failed to capture image. Please try again.");
                }
            } catch (error) {
                console.error('Webcam capture error:', error);
                setWebcamError("Failed to capture image. Please ensure camera permissions are granted.");
            }
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onPhotoSelect(file);
            onClose();
        }
    };

    const handleAadharFetch = () => {
        // TODO: Implement Aadhar photo fetch logic
        alert('Aadhar photo fetch functionality will be implemented here');
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                }
            }}
        >
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="Capture from Webcam" />
                        <Tab label="Upload from Device" />
                        <Tab label="Fetch from Aadhar" />
                    </Tabs>
                </Box>

                <TabPanel value={activeTab} index={0}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        {webcamError && (
                            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                                {webcamError}
                            </Alert>
                        )}
                        {activeTab === 0 && (
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                onUserMediaError={(error) => {
                                    console.error('Webcam error:', error);
                                    setWebcamError("Failed to access camera. Please ensure camera permissions are granted.");
                                }}
                                style={{ 
                                    width: '100%', 
                                    maxWidth: '400px',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                        )}
                        <Button 
                            variant="contained" 
                            onClick={handleCapture}
                            disabled={!!webcamError}
                            sx={{
                                mt: 2,
                                px: 4,
                                py: 1,
                                borderRadius: '8px',
                            }}
                        >
                            Capture Photo
                        </Button>
                    </Box>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <Button
                            variant="contained"
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                px: 4,
                                py: 1,
                                borderRadius: '8px',
                            }}
                        >
                            Choose File
                        </Button>
                        <Typography variant="body2" color="textSecondary">
                            Supported formats: JPG, PNG
                        </Typography>
                    </Box>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Button 
                            variant="contained" 
                            onClick={handleAadharFetch}
                            sx={{
                                px: 4,
                                py: 1,
                                borderRadius: '8px',
                            }}
                        >
                            Fetch from Aadhar
                        </Button>
                        <Typography variant="body2" color="textSecondary">
                            This will fetch the photo from your linked Aadhar card
                        </Typography>
                    </Box>
                </TabPanel>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: '8px',
                        px: 3
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PhotoUploadModal; 