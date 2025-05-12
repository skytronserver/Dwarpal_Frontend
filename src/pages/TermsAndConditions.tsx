import React from 'react';
import { Box, Container, Typography, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MinimalHeader from '../components/MinimalHeader';

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <MinimalHeader />
      <Box sx={{ py: 4, backgroundColor: '#0d5c63' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  color: '#0d5c63',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  mb: 3
                }}
              >
                Terms and Conditions
              </Typography>
              
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                gutterBottom 
                sx={{ 
                  textAlign: 'center',
                  mb: 4
                }}
              >
                Effective Date: 11.05.2025
                <br />
                Last Updated: 11.05.2025
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  Welcome to Dwarpal AI ("App"), a product of Skytrack Technologies Private Limited ("we", "our", or "us"). 
                  These Terms and Conditions ("Terms") govern your use of the App. By downloading, accessing, or using the App, 
                  you agree to be bound by these Terms.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  1. User Consent for Permissions
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  The Dwarpal AI App requires the following permissions to function properly:
                </Typography>
                <ul style={{ color: '#2c3e50', paddingLeft: '1.5rem' }}>
                  <li><Typography>Camera Permission – to enable facial recognition-based access control features.</Typography></li>
                  <li><Typography>Location Permission – to detect nearby devices for WIFI connectivity.</Typography></li>
                  <li><Typography>Wi-Fi Permission – to identify network connectivity status for real-time access processing and data synchronization.</Typography></li>
                </ul>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  By accepting these permissions, you agree to allow the App to access and process the relevant data solely for its intended functionality. 
                  These permissions are not used to collect personal data for any unrelated purpose.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  2. User Data and Privacy
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  Your privacy is important to us. Data collected through the App is used only for enabling secure access control and ensuring proper operation of the App's features.
                </Typography>
                <ul style={{ color: '#2c3e50', paddingLeft: '1.5rem' }}>
                  <li><Typography>We do not share your personal information with third parties without your explicit consent, except where required by law.</Typography></li>
                  <li><Typography>We take appropriate technical and organizational measures to protect your data from unauthorized access or misuse.</Typography></li>
                  <li><Typography>The App may store anonymized logs for performance and audit purposes.</Typography></li>
                </ul>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  3. Usage Restrictions
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  You agree not to:
                </Typography>
                <ul style={{ color: '#2c3e50', paddingLeft: '1.5rem' }}>
                  <li><Typography>Use the App for any unlawful, unauthorized, or abusive purpose.</Typography></li>
                  <li><Typography>Attempt to reverse engineer, decompile, or modify the App or any of its components.</Typography></li>
                  <li><Typography>Interfere with the App's functionality or access systems or networks without authorization.</Typography></li>
                </ul>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  4. Intellectual Property
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  All rights, title, and interest in and to the App, including but not limited to its code, design, trademarks, and functionality, 
                  are the exclusive property of Skytrack Technologies Pvt. Ltd. Unauthorized use or reproduction is strictly prohibited.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  5. Limitation of Liability
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  The App is provided "as is" and "as available". We do not guarantee uninterrupted or error-free operation. 
                  We are not liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use the App.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  6. Modifications
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  We may update or modify these Terms from time to time. Continued use of the App after such updates constitutes your acceptance of the revised Terms.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  7. Termination
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  We reserve the right to suspend or terminate your access to the App at our sole discretion, without notice, 
                  if we believe you have violated these Terms.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  8. Governing Law
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  These Terms shall be governed by and construed in accordance with the laws of India. 
                  Any disputes shall be subject to the jurisdiction of courts in Guwahati, Assam.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  9. Contact
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  For any questions or concerns regarding these Terms or the App, please contact:
                  <br />
                  📧 support@skytrack.in
                  <br />
                  📍 Skytrack Technologies Pvt. Ltd., Guwahati, Assam
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ 
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Back to Login
              </Link>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default TermsAndConditions; 