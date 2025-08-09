import { Grid, Typography, Paper, Box, Card, CardContent, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Button, Modal, TextField, Alert, Chip } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import WorkIcon from '@mui/icons-material/Work';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import React from 'react';
import { useAttendendenceAnalyticsQuery } from "../../services/dashboardServices";

// Fallback data used if API is loading or returns empty
const fallbackOverview = {
  totalEmployees: 0,
  presentToday: 0,
  lateToday: 0,
  absentToday: 0,
  averageAttendance: 0,
  averagePunctuality: 0,
  totalOvertimeHours: 0
};

const AttendanceAnalytics = () => {
  const navigate = useNavigate();
  const {hasRole} = useAuth();
  const [openModal, setOpenModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data, isLoading } = useAttendendenceAnalyticsQuery();

  const companyOverview = React.useMemo(() => {
    if (!data || !data.organization_summary) return fallbackOverview;
    const s = data.organization_summary;
    return {
      totalEmployees: s.total_employees || 0,
      presentToday: s.total_present || 0,
      lateToday: s.total_late || 0,
      absentToday: s.total_absent || 0,
      averageAttendance: Math.round(s.average_attendance || 0),
      averagePunctuality: Math.round(s.average_punctuality || 0),
      totalOvertimeHours: s.total_overtime_hours || 0
    };
  }, [data]);

  const departmentWiseAttendance = React.useMemo(() => {
    if (!data || !data.department_wise) return [];
    return data.department_wise.map(d => ({
      department: d.department || 'Unknown Department',
      present: d.present || 0,
      late: d.late || 0,
      absent: d.absent || 0,
      total: (d.present || 0) + (d.late || 0) + (d.absent || 0)
    }));
  }, [data]);

  const allEmployees = React.useMemo(() => {
    if (!data || !data.top_employees) return [];
    return data.top_employees.map((e, idx) => ({
      id: idx + 1,
      name: e.employee || 'Unknown Employee',
      department: e.department ?? 'No Department',
      attendance: e.attendance_percent || 0,
      avatar: '👤',
      status: e.status || 'Unknown',
    }));
  }, [data]);

  // Check if this is a scenario with no attendance data
  const isEmptyAttendanceData = companyOverview.totalEmployees > 0 && companyOverview.presentToday === 0 && companyOverview.averageAttendance === 0;

  // For top performers, show employees with >0% attendance, or if none exist, show a message
  const topEmployees = allEmployees.filter(emp => emp.attendance > 0);
  const hasTopPerformers = topEmployees.length > 0;

  const monthlyTrend = [
    { month: 'Jan', averageAttendance: companyOverview.averageAttendance, averagePunctuality: companyOverview.averagePunctuality },
  ];

  const handleEmployeeClick = (employeeId: number) => {
    navigate(`/attendance/${employeeId}`);
  };

  // Determine what to display based on role and data availability
  const getDisplayEmployees = () => {
    if (hasRole(['HR', 'ADMIN'])) {
      return hasTopPerformers ? topEmployees : allEmployees.slice(0, 5); // Show first 5 if no top performers
    }
    return allEmployees;
  };

  const displayEmployees = getDisplayEmployees();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 1000,
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflow: 'auto',
  } as const;

  const filteredEmployees = React.useMemo(() => {
    return allEmployees.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allEmployees]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {data?.organization ? `${data.organization} Attendance Analytics` : 'Company-wide Attendance Analytics'}
      </Typography>

      {/* Alert for empty attendance data */}
      {isEmptyAttendanceData && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
          No attendance records found for today. This might be a weekend, holiday, or no employees have checked in yet.
        </Alert>
      )}

      {/* Today's Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Present Today</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {companyOverview.presentToday}/{companyOverview.totalEmployees}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={companyOverview.totalEmployees ? (companyOverview.presentToday/companyOverview.totalEmployees) * 100 : 0} 
                sx={{ height: 8, borderRadius: 2 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {companyOverview.totalEmployees ? 
                  `${Math.round((companyOverview.presentToday/companyOverview.totalEmployees) * 100)}% present` : 
                  'No data'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6">Late Today</Typography>
              </Box>
              <Typography variant="h4">
                {companyOverview.lateToday}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                employees arrived late
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6">Avg. Attendance</Typography>
              </Box>
              <Typography variant="h4">
                {companyOverview.averageAttendance}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                overall company average
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventBusyIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6">Total Absent</Typography>
              </Box>
              <Typography variant="h4">
                {companyOverview.absentToday}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                employees absent today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Department-wise and Trends */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Department-wise Attendance</Typography>
            {departmentWiseAttendance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentWiseAttendance}>
                  <XAxis 
                    dataKey="department" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#4CAF50" name="Present" />
                  <Bar dataKey="late" fill="#FFC107" name="Late" />
                  <Bar dataKey="absent" fill="#F44336" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No department data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Company Overview</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {companyOverview.totalEmployees}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Attendance Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" sx={{ mr: 2 }}>
                  {companyOverview.averageAttendance}%
                </Typography>
                <Chip 
                  label={companyOverview.averageAttendance >= 90 ? "Excellent" : 
                         companyOverview.averageAttendance >= 75 ? "Good" :
                         companyOverview.averageAttendance >= 60 ? "Average" : "Needs Improvement"}
                  color={companyOverview.averageAttendance >= 90 ? "success" : 
                         companyOverview.averageAttendance >= 75 ? "info" :
                         companyOverview.averageAttendance >= 60 ? "warning" : "error"}
                  size="small"
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={companyOverview.averageAttendance} 
                sx={{ height: 8, borderRadius: 2 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Punctuality Rate
              </Typography>
              <Typography variant="h6">
                {companyOverview.averagePunctuality}%
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Overtime Hours
              </Typography>
              <Typography variant="h6">
                {companyOverview.totalOvertimeHours}h
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Employee Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            {hasRole(['HR','ADMIN']) ? 
              (hasTopPerformers ? 'Top Performers' : 'Employee Overview') : 
              'Employee Attendance'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleOpenModal}
            disabled={isLoading || allEmployees.length === 0}
          >
            View All Employees ({allEmployees.length})
          </Button>
        </Box>

        {/* Show message when no top performers exist for HR/ADMIN */}
        {hasRole(['HR','ADMIN']) && !hasTopPerformers && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            No employees currently meet the top performer criteria (95%+ attendance). 
            Showing all employees instead.
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Attendance Rate</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayEmployees.length > 0 ? (
                displayEmployees.map((employee) => (
                  <TableRow 
                    key={employee.id}
                    hover
                    onClick={() => handleEmployeeClick(employee.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>{employee.avatar}</Avatar>
                        {employee.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.department} 
                        variant="outlined" 
                        size="small"
                        color={employee.department === 'No Department' ? 'default' : 'primary'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {employee.attendance}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={employee.attendance} 
                          sx={{ 
                            width: 60, 
                            height: 6, 
                            borderRadius: 2,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: employee.attendance >= 95 ? '#4CAF50' :
                                             employee.attendance >= 75 ? '#2196F3' :
                                             employee.attendance >= 60 ? '#FFC107' : '#F44336'
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.status}
                        size="small"
                        color={employee.status === 'Excellent' ? 'success' :
                               employee.status === 'Good' ? 'info' :
                               employee.status === 'Average' ? 'warning' : 'error'}
                        variant="filled"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      No employee data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* All Employees Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="all-employees-modal"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            All Employees Attendance ({allEmployees.length} total)
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          {isEmptyAttendanceData && (
            <Alert severity="info" sx={{ mb: 3 }}>
              All employees currently show 0% attendance. This may indicate no check-ins have been recorded yet.
            </Alert>
          )}

          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Attendance Rate</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow 
                      key={employee.id}
                      hover
                      onClick={() => {
                        handleEmployeeClick(employee.id);
                        handleCloseModal();
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2 }}>{employee.avatar}</Avatar>
                          {employee.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={employee.department} 
                          variant="outlined" 
                          size="small"
                          color={employee.department === 'No Department' ? 'default' : 'primary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {employee.attendance}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={employee.attendance} 
                            sx={{ 
                              width: 60, 
                              height: 6, 
                              borderRadius: 2,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: employee.attendance >= 95 ? '#4CAF50' :
                                               employee.attendance >= 75 ? '#2196F3' :
                                               employee.attendance >= 60 ? '#FFC107' : '#F44336'
                              }
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={employee.status}
                          size="small"
                          color={employee.status === 'Excellent' ? 'success' :
                                 employee.status === 'Good' ? 'info' :
                                 employee.status === 'Average' ? 'warning' : 'error'}
                          variant="filled"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        {searchTerm ? 'No employees found matching your search.' : 'No employee data available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredEmployees.length} of {allEmployees.length} employees
            </Typography>
            <Button onClick={handleCloseModal} variant="contained">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AttendanceAnalytics;