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
import { useGetUserAttendanceQuery } from '../services/UserApi';
import { useHrDashboardQuery, useSuperAdminDashboardQuery, useEmployeeDashboardQuery } from '../services/dashboardServices';
import { useState } from 'react';
import { Button } from '@mui/material';

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

  const getSuperAdminMetrics = (): DashboardMetric[] => {
    const { data: superAdminData } = useSuperAdminDashboardQuery();
    
    return [
      {
        title: 'Total Organizations',
        value: superAdminData?.total_organizations || 0,
        icon: <Building2 className="h-6 w-6" />,
        progress: 85,
        color: 'primary.main',
        subtitle: 'Active organizations'
      },
      {
        title: 'Service Providers',
        value: superAdminData?.total_service_providers || 0,
        icon: <Briefcase className="h-6 w-6" />,
        progress: 72,
        color: 'success.main',
        subtitle: 'Registered providers'
      },
      {
        title: 'Company Clients',
        value: superAdminData?.total_company_clients || 0,
        icon: <Building2 className="h-6 w-6" />,
        progress: 65,
        color: 'info.main',
        subtitle: 'Active companies'
      },
      {
        title: 'Individual Clients',
        value: superAdminData?.total_individual_clients || 0,
        icon: <UserCheck className="h-6 w-6" />,
        progress: 78,
        color: 'secondary.main',
        subtitle: 'Registered individuals'
      },
      {
        title: 'Total Departments',
        value: superAdminData?.total_departments || 0,
        icon: <Building2 className="h-6 w-6" />,
        progress: 92,
        color: 'warning.main',
        subtitle: 'Across organizations'
      },
      {
        title: 'Admin Users',
        value: superAdminData?.total_admin_users || 0,
        icon: <Shield className="h-6 w-6" />,
        progress: 88,
        color: 'error.main',
        subtitle: 'System administrators'
      }
    ];
  };

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

  const getHRMetrics = (): DashboardMetric[] => {
    const { data: hrDashboardData } = useHrDashboardQuery();

    return [
      {
        title: 'Total Employees',
        value: hrDashboardData?.total_employees || 0,
        icon: <Users className="h-6 w-6" />,
        progress: 100,
        color: 'primary.main',
        trend: '+3 this week'
      },
      {
        title: 'Active Shifts',
        value: hrDashboardData?.active_shifts || 0,
        icon: <Clock className="h-6 w-6" />,
        progress: 80,
        color: 'success.main',
        subtitle: 'All shifts running'
      },
      {
        title: 'Upcoming Holidays',
        value: hrDashboardData?.upcoming_holidays?.length || 0,
        icon: <Calendar className="h-6 w-6" />,
        progress: 100,
        color: 'info.main',
        subtitle: 'Next: New Year'
      },
      {
        title: 'Gate Passes Today',
        value: hrDashboardData?.guest_passes_today || 0,
        icon: <DoorClosed className="h-6 w-6" />,
        progress: 60,
        color: 'warning.main',
        subtitle: 'Pending approval'
      },
      {
        title: 'Present Today',
        value: hrDashboardData?.present_today || 0,
        icon: <UserCheck className="h-6 w-6" />,
        progress: 95,
        color: 'success.main',
        subtitle: 'Attendance today'
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
  };

  const getEmployeeMetrics = (): DashboardMetric[] => {
    const { data: employeeData } = useEmployeeDashboardQuery();

    return [
      {
        title: 'Present Days',
        value: employeeData?.attendance_summary.present_days || 0,
        icon: <CheckCircle className="h-6 w-6" />,
        progress: employeeData?.attendance_summary.present_percent || 0,
        color: 'success.main',
        subtitle: `${employeeData?.attendance_summary.present_percent.toFixed(1)}% attendance`
      },
      {
        title: 'Late Days',
        value: employeeData?.attendance_summary.late_days || 0,
        icon: <Clock className="h-6 w-6" />,
        progress: employeeData?.attendance_summary.late_percent || 0,
        color: 'warning.main',
        subtitle: `${employeeData?.attendance_summary.late_percent.toFixed(1)}% late arrivals`
      },
      {
        title: 'Absent Days',
        value: employeeData?.attendance_summary.absent_days || 0,
        icon: <AlertTriangle className="h-6 w-6" />,
        progress: employeeData?.attendance_summary.absent_percent || 0,
        color: 'error.main',
        subtitle: `${employeeData?.attendance_summary.absent_percent.toFixed(1)}% absences`
      },
      {
        title: 'Total Holidays',
        value: employeeData?.holiday_stats.total_holidays || 0,
        icon: <Calendar className="h-6 w-6" />,
        progress: 100,
        color: 'info.main',
        subtitle: `${employeeData?.holiday_stats.total_holiday_days || 0} holiday days`
      },
      {
        title: 'Department',
        value: employeeData?.department || 'N/A',
        icon: <Building2 className="h-6 w-6" />,
        progress: 100,
        color: 'primary.main',
        subtitle: employeeData?.organization || 'N/A'
      },
      {
        title: 'Work Days',
        value: employeeData?.attendance_summary.total_work_days || 0,
        icon: <Timer className="h-6 w-6" />,
        progress: 100,
        color: 'secondary.main',
        subtitle: `Month: ${employeeData?.month || 'N/A'}`
      }
    ];
  };

  const renderSuperAdminAnalytics = () => {
    const { data: superAdminData } = useSuperAdminDashboardQuery();

    return (
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
                      { name: 'Company Clients', value: superAdminData?.client_statistics.company_clients || 0 },
                      { name: 'Individual Clients', value: superAdminData?.client_statistics.individual_clients || 0 },
                      { name: 'Service Providers', value: superAdminData?.client_statistics.service_providers || 0 }
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
                <AreaChart data={superAdminData?.organization_growth_trend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => value.split(' ')[0].substring(0, 3)}
                  />
                  <YAxis />
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="organizations_created"
                    stroke="#3498DB"
                    fill="#3498DB"
                    fillOpacity={0.3}
                    name="Organizations Created"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

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

  const renderHRAnalytics = () => {
    const { data: hrDashboardData } = useHrDashboardQuery();
    const [showAllActivities, setShowAllActivities] = useState(false);

    // Filter out departments with 0 count
    const activeDepartments = hrDashboardData?.employee_distribution.filter(dept => dept.count > 0) || [];
    
    // Get activities based on show all state
    const displayedActivities = showAllActivities 
      ? hrDashboardData?.recent_employee_activity || []
      : (hrDashboardData?.recent_employee_activity || []).slice(0, 5);

    return (
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
                    data={activeDepartments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="department"
                  >
                    {activeDepartments.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recent Employee Activity */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Employee Activity
                </Typography>
                {(hrDashboardData?.recent_employee_activity?.length || 0) > 5 && (
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowAllActivities(!showAllActivities)}
                    size="small"
                  >
                    {showAllActivities ? 'Show Less' : 'View More'}
                  </Button>
                )}
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Activity Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedActivities.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.description.includes('Absent') ? 'Absent' : 'Active'}
                            color={record.description.includes('Absent') ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {showAllActivities 
                    ? `Showing all ${hrDashboardData?.recent_employee_activity.length || 0} activities`
                    : `Showing 5 of ${hrDashboardData?.recent_employee_activity.length || 0} activities`
                  }
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderEmployeeAnalytics = () => {
    const { data: employeeData } = useEmployeeDashboardQuery();

    interface CustomLabelProps {
      cx: number;
      cy: number;
      midAngle: number;
      innerRadius: number;
      outerRadius: number;
      name: string;
      percentage: number;
    }

    // Create attendance distribution data for pie chart
    const attendanceDistribution = [
      { name: 'Present', value: employeeData?.attendance_summary.present_days || 0, percentage: employeeData?.attendance_summary.present_percent || 0 },
      { name: 'Late', value: employeeData?.attendance_summary.late_days || 0, percentage: employeeData?.attendance_summary.late_percent || 0 },
      { name: 'Absent', value: employeeData?.attendance_summary.absent_days || 0, percentage: employeeData?.attendance_summary.absent_percent || 0 }
    ].filter(item => item.value > 0); // Only show segments with values > 0

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percentage }: CustomLabelProps) => {
      const radius = outerRadius * 1.2;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="#666"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
        >
          {`${name} ${percentage.toFixed(1)}%`}
        </text>
      );
    };

    // Map status to colors
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Present':
          return '#4CAF50'; // Green
        case 'Late':
          return '#FFC107'; // Yellow
        case 'Absent':
          return '#F44336'; // Red
        default:
          return '#8884d8'; // Default purple
      }
    };

    return (
      <>
        <Grid container spacing={3}>
          {/* Attendance Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Monthly Attendance Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attendanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value, name, props) => [
                      `${props.payload.percentage.toFixed(1)}% (${value} days)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Summary Table */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Attendance Summary
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Days</TableCell>
                      <TableCell>Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Present Days</TableCell>
                      <TableCell>{employeeData?.attendance_summary.present_days}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${employeeData?.attendance_summary.present_percent.toFixed(1)}%`}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Late Days</TableCell>
                      <TableCell>{employeeData?.attendance_summary.late_days}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${employeeData?.attendance_summary.late_percent.toFixed(1)}%`}
                          color="warning"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Absent Days</TableCell>
                      <TableCell>{employeeData?.attendance_summary.absent_days}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${employeeData?.attendance_summary.absent_percent.toFixed(1)}%`}
                          color="error"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Work Days</TableCell>
                      <TableCell>{employeeData?.attendance_summary.total_work_days}</TableCell>
                      <TableCell>
                        <Chip
                          label="100%"
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Holidays</TableCell>
                      <TableCell>{employeeData?.holiday_stats.total_holidays}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${employeeData?.holiday_stats.total_holiday_days} days`}
                          color="info"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

  const getDashboardMetrics = () => {
    switch (userRole) {
      case 'SUPERADMIN':
        return getSuperAdminMetrics();
      case 'ADMIN':
        return getAdminMetrics();
      case 'HR':
        return getHRMetrics();
      case 'EMPLOYEE':
        return getEmployeeMetrics();
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
      {userRole === 'EMPLOYEE' && renderEmployeeAnalytics()}
    </Box>
  );
};

export default Dashboard;