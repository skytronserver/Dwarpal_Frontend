import React, { useState, useRef } from 'react';
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
    const [webcamEnabled, setWebcamEnabled] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        if (newValue === 0) {
            setWebcamEnabled(true);
        } else {
            setWebcamEnabled(false);
        }
    };

    const handleCapture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                // Convert base64 to file
                fetch(imageSrc)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "webcam-photo.jpg", { type: "image/jpeg" });
                        onPhotoSelect(file);
                        onClose();
                    });
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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                        {webcamEnabled && (
                            <Webcam
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                style={{ width: '100%', maxWidth: '400px' }}
                            />
                        )}
                        <Button variant="contained" onClick={handleCapture}>
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
                        <Button variant="contained" onClick={handleAadharFetch}>
                            Fetch from Aadhar
                        </Button>
                        <Typography variant="body2" color="textSecondary">
                            This will fetch the photo from your linked Aadhar card
                        </Typography>
                    </Box>
                </TabPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PhotoUploadModal; 