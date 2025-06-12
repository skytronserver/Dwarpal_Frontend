import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Users, Clock, Calendar, Building2, DoorClosed, Timer, TrendingUp, CheckCircle, UserCheck, Briefcase, AlertTriangle, Shield, CreditCard, UserPlus, Settings } from 'lucide-react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
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

const employeeAttendanceData = [
  { date: '2024-03-01', status: 'Present', checkIn: '09:00', checkOut: '17:30' },
  { date: '2024-03-02', status: 'Present', checkIn: '09:15', checkOut: '17:45' },
  { date: '2024-03-03', status: 'Late', checkIn: '09:30', checkOut: '17:30' },
  { date: '2024-03-04', status: 'Present', checkIn: '09:00', checkOut: '17:30' },
  { date: '2024-03-05', status: 'Absent', checkIn: '-', checkOut: '-' },
];

const departmentPerformance = [
  { department: 'IT', attendance: 95, productivity: 92 },
  { department: 'HR', attendance: 98, productivity: 95 },
  { department: 'Finance', attendance: 94, productivity: 90 },
  { department: 'Operations', attendance: 92, productivity: 88 },
];

const employeeStatusData = [
  { status: 'Present', count: 85 },
  { status: 'Late', count: 10 },
  { status: 'Absent', count: 5 },
];

const Dashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const { data: gatePassData } = useGetGuestPassesQuery({});

  console.log('Dashboard User:', user);
  console.log('User Role:', user?.role);
  console.log('Has Permission:', hasPermission('view:dashboard'));

  const userRole = user?.role?.toUpperCase();

  const getSuperAdminMetrics = (): DashboardMetric[] => [
    {
      title: 'Total Organizations',
      value: '25',
      icon: <Building2 className="h-6 w-6" />,
      progress: 85,
      color: 'primary.main',
      trend: '+12% this month',
      subtitle: '5 pending approvals'
    },
    {
      title: 'Service Providers',
      value: '18',
      icon: <Briefcase className="h-6 w-6" />,
      progress: 72,
      color: 'success.main',
      trend: '+5% this month'
    },
    {
      title: 'Company Clients',
      value: '32',
      icon: <Building2 className="h-6 w-6" />,
      progress: 65,
      color: 'info.main',
      trend: '+8% this month'
    },
    {
      title: 'Individual Clients',
      value: '45',
      icon: <UserCheck className="h-6 w-6" />,
      progress: 78,
      color: 'secondary.main',
      trend: '+15% this month'
    },
    {
      title: 'Total Departments',
      value: '120',
      icon: <Building2 className="h-6 w-6" />,
      progress: 92,
      color: 'warning.main',
      trend: '+10% this month'
    },
    {
      title: 'Admin Users',
      value: '75',
      icon: <Shield className="h-6 w-6" />,
      progress: 88,
      color: 'error.main',
      trend: '+7% this month'
    }
  ];

  const getAdminMetrics = (): DashboardMetric[] => [
    {
      title: 'Total Employees',
      value: '150',
      icon: <Users className="h-6 w-6" />,
      progress: 90,
      color: 'primary.main',
      trend: '+5% this month',
      subtitle: '142 active today'
    },
    {
      title: 'HR Users',
      value: '8',
      icon: <UserCheck className="h-6 w-6" />,
      progress: 100,
      color: 'success.main',
      subtitle: 'All active'
    },
    {
      title: 'Accounts Users',
      value: '6',
      icon: <CreditCard className="h-6 w-6" />,
      progress: 100,
      color: 'info.main',
      subtitle: 'All active'
    },
    {
      title: 'Active Shifts',
      value: '12',
      icon: <Clock className="h-6 w-6" />,
      progress: 75,
      color: 'secondary.main',
      subtitle: '3 pending approval'
    },
    {
      title: 'Pending Holidays',
      value: '5',
      icon: <Calendar className="h-6 w-6" />,
      progress: 40,
      color: 'warning.main',
      subtitle: 'Needs approval'
    },
    {
      title: 'Attendance Rate',
      value: '95%',
      icon: <Timer className="h-6 w-6" />,
      progress: 95,
      color: 'success.main',
      trend: '+2% vs last month'
    }
  ];

  const getHRMetrics = (): DashboardMetric[] => [
    {
      title: 'Total Employees',
      value: '150',
      icon: <Users className="h-6 w-6" />,
      progress: 100,
      color: 'primary.main',
      trend: '+3 this week'
    },
    {
      title: 'Active Shifts',
      value: '12',
      icon: <Clock className="h-6 w-6" />,
      progress: 80,
      color: 'success.main',
      subtitle: 'All shifts running'
    },
    {
      title: 'Upcoming Holidays',
      value: '3',
      icon: <Calendar className="h-6 w-6" />,
      progress: 100,
      color: 'info.main',
      subtitle: 'Next: New Year'
    },
    {
      title: 'Gate Passes Today',
      value: gatePassData?.results?.filter(pass => !pass.is_approved).length || '0',
      icon: <DoorClosed className="h-6 w-6" />,
      progress: 60,
      color: 'warning.main',
      subtitle: 'Pending approval'
    },
    {
      title: 'Present Today',
      value: '142',
      icon: <UserCheck className="h-6 w-6" />,
      progress: 95,
      color: 'success.main',
      subtitle: '95% attendance'
    },
    {
      title: 'Settings Status',
      value: 'Updated',
      icon: <Settings className="h-6 w-6" />,
      progress: 100,
      color: 'secondary.main',
      subtitle: 'All configurations set'
    }
  ];

  const renderSuperAdminAnalytics = () => (
    <>
      <Grid container spacing={3}>
        {/* Client Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Client Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Company Clients', value: 32 },
                    { name: 'Individual Clients', value: 45 },
                    { name: 'Service Providers', value: 18 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Organization Growth Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Organization Growth Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={[
                { month: 'Jan', organizations: 15 },
                { month: 'Feb', organizations: 18 },
                { month: 'Mar', organizations: 20 },
                { month: 'Apr', organizations: 22 },
                { month: 'May', organizations: 25 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Area
                  type="monotone"
                  dataKey="organizations"
                  stroke="#3498DB"
                  fill="#3498DB"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  const renderAdminAnalytics = () => (
    <>
      <Grid container spacing={3}>
        {/* Department Performance Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Department Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="attendance" fill="#3498DB" name="Attendance %" />
                <Bar dataKey="productivity" fill="#2ECC71" name="Productivity %" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Attendance Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Attendance Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={employeeStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {employeeStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Approvals Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Approvals Pending
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Requested By</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { type: 'Shift Change', requestedBy: 'John Doe', department: 'IT', status: 'Pending', date: '2024-03-15' },
                    { type: 'Holiday', requestedBy: 'Jane Smith', department: 'HR', status: 'Pending', date: '2024-03-14' },
                    { type: 'Gate Pass', requestedBy: 'Mike Johnson', department: 'Finance', status: 'Pending', date: '2024-03-14' },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.requestedBy}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          color="warning"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{record.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  const renderHRAnalytics = () => (
    <>
      <Grid container spacing={3}>
        {/* Employee Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Employee Distribution by Department
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
                  {departmentDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gate Pass Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Gate Pass Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gatePassTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="approved" fill="#2ECC71" name="Approved" />
                <Bar dataKey="rejected" fill="#E74C3C" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Employee Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Employee Activity
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Activity</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { employee: 'John Doe', department: 'IT', activity: 'Check In', time: '09:00 AM', status: 'On Time' },
                    { employee: 'Jane Smith', department: 'HR', activity: 'Gate Pass Request', time: '10:30 AM', status: 'Pending' },
                    { employee: 'Mike Johnson', department: 'Finance', activity: 'Shift Change Request', time: '11:00 AM', status: 'Pending' },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.employee}</TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>{record.activity}</TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          color={record.status === 'On Time' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  const getDashboardMetrics = () => {
    switch (userRole) {
      case 'SUPERADMIN':
        return getSuperAdminMetrics();
      case 'ADMIN':
        return getAdminMetrics();
      case 'HR':
        return getHRMetrics();
      default:
        console.log('No matching role found for:', userRole);
        return [];
    }
  };

  const metrics = getDashboardMetrics();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Welcome, {user?.user_name || ' '} -DWARPAL
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Here's your dashboard overview
      </Typography>
      
      {/* Metrics Grid */}
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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

      {/* Analytics Section */}
      <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
        Analytics Overview
      </Typography>
      
      {userRole === 'SUPERADMIN' && renderSuperAdminAnalytics()}
      {userRole === 'ADMIN' && renderAdminAnalytics()}
      {userRole === 'HR' && renderHRAnalytics()}
    </Box>
  );
};

export default Dashboard;