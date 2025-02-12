import React from 'react';
import { useAuth } from '../hooks/useAuth'; 
import { Users, Clock, Calendar, Building2 } from 'lucide-react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box 
} from '@mui/material';

interface DashboardMetric {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getSuperAdminMetrics = (): DashboardMetric[] => [
    {
      title: 'Total Organizations',
      value: '25', // Replace with actual data
      icon: <Building2 className="h-6 w-6" />,
    },
    {
      title: 'Total Users',
      value: '150', // Replace with actual data
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: 'Active Sessions',
      value: '45', // Replace with actual data
      icon: <Clock className="h-6 w-6" />,
    },
    {
      title: 'Events Today',
      value: '8', // Replace with actual data
      icon: <Calendar className="h-6 w-6" />,
    },
  ];

  const getAdminMetrics = (): DashboardMetric[] => [
    {
      title: 'Organization Users',
      value: '32', // Replace with actual data
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: 'Active Sessions',
      value: '12', // Replace with actual data
      icon: <Clock className="h-6 w-6" />,
    },
    {
      title: 'Events Today',
      value: '3', // Replace with actual data
      icon: <Calendar className="h-6 w-6" />,
    },
  ];

  const metrics = user?.role === 'SUPERADMIN'
    ? getSuperAdminMetrics() 
    : getAdminMetrics();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  {metric.title}
                </Typography>
                {metric.icon}
              </Box>
              <Typography variant="h4">
                {metric.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;