import React from 'react';
import { Box, Container, Typography, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MinimalHeader from '../components/MinimalHeader';

const PrivacyPolicy: React.FC = () => {
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
                Privacy Policy
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
                  Skytrack Technologies Private Limited ("we", "our", or "us") is committed to protecting your privacy. 
                  This Privacy Policy describes how we collect, use, and protect your information when you use the Dwarpal AI App ("App").
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  1. Information We Collect
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  We collect and process the following types of information strictly for the functionality of the App:
                </Typography>
                <ul style={{ color: '#2c3e50', paddingLeft: '1.5rem' }}>
                  <li><Typography>Camera Access – for facial recognition. No images or video are stored or transmitted unless explicitly required.</Typography></li>
                  <li><Typography>Location Data – to detect nearby devices for WIFI connectivity.</Typography></li>
                  <li><Typography>Wi-Fi and Network Information – to ensure real-time functionality of the App.</Typography></li>
                </ul>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  2. How We Use Your Data
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  We use the collected data to:
                </Typography>
                <ul style={{ color: '#2c3e50', paddingLeft: '1.5rem' }}>
                  <li><Typography>Enable secure access using facial recognition</Typography></li>
                  <li><Typography>Maintain access logs (in enterprise setups)</Typography></li>
                  <li><Typography>Trigger access control actions based on location and time</Typography></li>
                  <li><Typography>Ensure uninterrupted functionality of the App</Typography></li>
                </ul>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  We do not use your data for advertising or profiling.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  3. Data Sharing and Disclosure
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  We do not share your personal data with third parties except:
                </Typography>
                <ul style={{ color: '#2c3e50', paddingLeft: '1.5rem' }}>
                  <li><Typography>With your explicit consent</Typography></li>
                  <li><Typography>As required by law or legal process</Typography></li>
                  <li><Typography>To trusted service providers under strict confidentiality agreements</Typography></li>
                </ul>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  4. Data Retention
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  We retain access-related data only as long as necessary for the purposes outlined or as required by law. 
                  Data in demo or personal versions is not stored externally.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  5. Data Security
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  We use encryption, firewalls, and secure servers to protect your data.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  6. Your Rights
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  You may have rights to access, correct, or delete your data. You can withdraw consent by uninstalling the App or contacting us.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  7. Children's Privacy
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  The App is not intended for children under 13. We do not knowingly collect their data.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  8. Changes to This Policy
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  We may update this Privacy Policy. Continued use of the App indicates acceptance of any changes.
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#0d5c63', fontWeight: 'bold' }}>
                  9. Contact Us
                </Typography>
                <Typography paragraph sx={{ color: '#2c3e50' }}>
                  For any questions, contact us at:
                  <br />
                  📧 contact@skytrack.in
                  <br />
                  📍 Skytrack Technologies Pvt. Ltd., Guwahati, Assam – 781028, India
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

export default PrivacyPolicy; 