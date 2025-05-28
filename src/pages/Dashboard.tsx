import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Users, Clock, Calendar, Building2, DoorClosed, Timer, TrendingUp, CheckCircle } from 'lucide-react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
  Chip,
} from '@mui/material';
import { useGetGuestPassesQuery } from '../services/gatePassApi';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardMetric {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  progress?: number;
  color?: string;
  trend?: string;
  subtitle?: string;
}

const attendanceData = [
  { month: 'Jan', attendance: 88 },
  { month: 'Feb', attendance: 92 },
  { month: 'Mar', attendance: 85 },
  { month: 'Apr', attendance: 89 },
  { month: 'May', attendance: 94 },
  { month: 'Jun', attendance: 91 },
];

const departmentDistribution = [
  { name: 'IT', value: 30 },
  { name: 'HR', value: 20 },
  { name: 'Finance', value: 15 },
  { name: 'Operations', value: 25 },
  { name: 'Marketing', value: 10 },
];

const gatePassTrend = [
  { date: '2024-01', approved: 45, rejected: 5 },
  { date: '2024-02', approved: 52, rejected: 3 },
  { date: '2024-03', approved: 48, rejected: 7 },
  { date: '2024-04', approved: 60, rejected: 4 },
  { date: '2024-05', approved: 55, rejected: 6 },
];

const COLORS = ['#2C3E50', '#3498DB', '#8E44AD', '#F39C12', '#7F8C8D'];

const Dashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const { data: gatePassData } = useGetGuestPassesQuery({});

  const getSuperAdminMetrics = (): DashboardMetric[] => [
    {
      title: 'Total Organisations',
      value: '25',
      icon: <Building2 className="h-6 w-6" />,
      progress: 85,
      color: 'primary.main',
      trend: '+12% this month',
      subtitle: '5 pending approvals'
    },
    {
      title: 'Total Admin Users',
      value: '150',
      icon: <Users className="h-6 w-6" />,
      progress: 75,
      color: 'success.main',
      trend: '+8% this month',
      subtitle: '142 active'
    },
    {
      title: 'Total Departments',
      value: '45',
      icon: <Building2 className="h-6 w-6" />,
      progress: 65,
      color: 'info.main'
    },
    {
      title: 'Active Organisations',
      value: '20',
      icon: <Building2 className="h-6 w-6" />,
      progress: 80,
      color: 'warning.main'
    },
    {
      title: 'System Health',
      value: '98.5%',
      icon: <CheckCircle className="h-6 w-6" />,
      progress: 98.5,
      color: 'success.main',
      subtitle: 'All systems operational'
    },
  ];

  const getAdminMetrics = (): DashboardMetric[] => [
    {
      title: 'Total Employees',
      value: '32',
      icon: <Users className="h-6 w-6" />,
      progress: 90,
      color: 'primary.main',
      trend: '+3 this week',
      subtitle: '28 active today'
    },
    {
      title: 'Active Shifts',
      value: '12',
      icon: <Clock className="h-6 w-6" />,
      progress: 65,
      color: 'success.main'
    },
    {
      title: "Today's Attendance",
      value: '28',
      icon: <Timer className="h-6 w-6" />,
      progress: 87,
      color: 'info.main'
    },
    {
      title: 'Pending Gate Passes',
      value: gatePassData?.results?.filter(pass => !pass.is_approved).length || '0',
      icon: <DoorClosed className="h-6 w-6" />,
      progress: 45,
      color: 'warning.main'
    },
    {
      title: 'Department Performance',
      value: '94%',
      icon: <TrendingUp className="h-6 w-6" />,
      progress: 94,
      color: 'success.main',
      subtitle: 'Above target'
    },
  ];

  const getEmployeeMetrics = (): DashboardMetric[] => {
    const metrics: DashboardMetric[] = [];

    if (hasPermission('can_create_guest_pass')) {
      metrics.push({
        title: 'My Gate Passes',
        value: gatePassData?.results?.length || '0',
        icon: <DoorClosed className="h-6 w-6" />,
        progress: 70,
        color: 'primary.main'
      });
    }

    if (hasPermission('approve_guest_pass')) {
      metrics.push({
        title: 'Pending Approvals',
        value: gatePassData?.results?.filter(pass => !pass.is_approved).length || '0',
        icon: <DoorClosed className="h-6 w-6" />,
        progress: 30,
        color: 'warning.main'
      });
    }

    if (hasPermission('view:attendance')) {
      metrics.push({
        title: 'My Attendance',
        value: '92%',
        icon: <Timer className="h-6 w-6" />,
        progress: 92,
        color: 'success.main'
      });
    }

    metrics.push({
      title: 'Upcoming Holidays',
      value: '3',
      icon: <Calendar className="h-6 w-6" />,
      progress: 100,
      color: 'info.main'
    });

    return metrics;
  };

  const getDashboardMetrics = () => {
    switch (user?.role) {
      case 'SUPERADMIN':
        return getSuperAdminMetrics();
      case 'ADMIN':
        return getAdminMetrics();
      default:
        return getEmployeeMetrics();
    }
  };

  const metrics = getDashboardMetrics();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Welcome, {user?.user_name || ' '}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Here's your dashboard overview
      </Typography>
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Paper 
              sx={{ 
                p: 2.5,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  {metric.title}
                </Typography>
                <Tooltip title={metric.title}>
                  <Box sx={{ color: metric.color }}>{metric.icon}</Box>
                </Tooltip>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {metric.value}
              </Typography>
              {metric.trend && (
                <Chip
                  label={metric.trend}
                  size="small"
                  color="success"
                  sx={{ mb: 1 }}
                />
              )}
              {metric.subtitle && (
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                  {metric.subtitle}
                </Typography>
              )}
              {metric.progress && (
                <LinearProgress
                  variant="determinate"
                  value={metric.progress}
                  sx={{
                    height: 6,
                    borderRadius: 1,
                    bgcolor: 'grey.100',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: metric.color,
                      borderRadius: 1,
                    }
                  }}
                />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* New Analytics Section */}
      <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
        Analytics Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Attendance Trend Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Attendance Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3498DB" 
                  fill="#3498DB" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Department Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Department Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentDistribution.map(( _ , index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gate Pass Analysis Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Gate Pass Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gatePassTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="approved" fill="#3498DB" stackId="a" name="Approved" />
                <Bar dataKey="rejected" fill="#8E44AD" stackId="a" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;