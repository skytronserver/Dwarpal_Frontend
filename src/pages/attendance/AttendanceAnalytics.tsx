import { Grid, Typography, Paper, Box, Card, CardContent, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Button, Modal, TextField } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import React from 'react';

// Dummy data for all employees analytics
const companyOverview = {
  totalEmployees: 150,
  presentToday: 142,
  lateToday: 5,
  absentToday: 3,
  averageAttendance: 95,
  averagePunctuality: 92,
  totalOvertimeHours: 256
};

const departmentWiseAttendance = [
  { department: 'IT', present: 45, late: 2, absent: 1 },
  { department: 'HR', present: 15, late: 1, absent: 0 },
  { department: 'Finance', present: 25, late: 1, absent: 1 },
  { department: 'Operations', present: 57, late: 1, absent: 1 },
];

// Dummy data for all employees
const allEmployees = [
  { id: 1, name: 'John Doe', department: 'IT', attendance: 100, avatar: '👨‍💻', status: 'Excellent' },
  { id: 2, name: 'Jane Smith', department: 'HR', attendance: 98, avatar: '👩‍💼', status: 'Excellent' },
  { id: 3, name: 'Mike Johnson', department: 'Finance', attendance: 97, avatar: '👨‍💼', status: 'Excellent' },
  { id: 4, name: 'Sarah Wilson', department: 'IT', attendance: 96, avatar: '👩‍💻', status: 'Excellent' },
  { id: 5, name: 'Tom Brown', department: 'Operations', attendance: 92, avatar: '👨‍💼', status: 'Good' },
  { id: 6, name: 'Emily Davis', department: 'Marketing', attendance: 89, avatar: '👩‍💼', status: 'Good' },
  { id: 7, name: 'David Lee', department: 'IT', attendance: 88, avatar: '👨‍💻', status: 'Good' },
  { id: 8, name: 'Lisa Anderson', department: 'HR', attendance: 87, avatar: '👩‍💼', status: 'Good' },
  { id: 9, name: 'James Wilson', department: 'Finance', attendance: 85, avatar: '👨‍💼', status: 'Average' },
  { id: 10, name: 'Maria Garcia', department: 'Operations', attendance: 84, avatar: '👩‍💼', status: 'Average' },
  { id: 11, name: 'Robert Taylor', department: 'IT', attendance: 82, avatar: '👨‍💻', status: 'Average' },
  { id: 12, name: 'Jennifer Moore', department: 'Marketing', attendance: 80, avatar: '👩‍💼', status: 'Average' },
  { id: 13, name: 'Michael Brown', department: 'IT', attendance: 78, avatar: '👨‍💻', status: 'Needs Improvement' },
  { id: 14, name: 'Amanda White', department: 'HR', attendance: 75, avatar: '👩‍💼', status: 'Needs Improvement' },
  { id: 15, name: 'Kevin Martin', department: 'Finance', attendance: 73, avatar: '👨‍💼', status: 'Needs Improvement' }
];

// Top performers (employees with attendance >= 95%)
const topEmployees = allEmployees.filter(emp => emp.attendance >= 95);

const monthlyTrend = [
  { month: 'Jan', averageAttendance: 96, averagePunctuality: 94 },
  { month: 'Feb', averageAttendance: 94, averagePunctuality: 92 },
  { month: 'Mar', averageAttendance: 95, averagePunctuality: 93 },
  { month: 'Apr', averageAttendance: 93, averagePunctuality: 91 },
];

const AttendanceAnalytics = () => {
  const navigate = useNavigate();
  const {hasRole} = useAuth();
  const [openModal, setOpenModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleEmployeeClick = (employeeId: number) => {
    navigate(`/attendance/${employeeId}`);
  };

  // Get the appropriate employee list based on role
  const displayEmployees = hasRole(['HR', 'ADMIN']) ? topEmployees : allEmployees;

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
  };

  const filteredEmployees = React.useMemo(() => {
    return allEmployees.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Company-wide Attendance Analytics
      </Typography>

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
                value={(companyOverview.presentToday/companyOverview.totalEmployees) * 100} 
                sx={{ height: 8, borderRadius: 2 }}
              />
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventBusyIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6">Total Overtime</Typography>
              </Box>
              <Typography variant="h4">
                {companyOverview.totalOvertimeHours}h
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentWiseAttendance}>
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#4CAF50" name="Present" />
                <Bar dataKey="late" fill="#FFC107" name="Late" />
                <Bar dataKey="absent" fill="#F44336" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Monthly Trends</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageAttendance" fill="#2196F3" name="Attendance %" />
                <Bar dataKey="averagePunctuality" fill="#4CAF50" name="Punctuality %" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Performers or All Employees Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            {hasRole(['HR','ADMIN']) ? 'Top Performers' : 'Employees Attendance'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleOpenModal}
          >
            View All Employees
          </Button>
        </Box>
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
              {displayEmployees.map((employee) => (
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
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.attendance}%</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      bgcolor: employee.status === 'Excellent' ? 'success.light' :
                              employee.status === 'Good' ? 'info.light' :
                              employee.status === 'Average' ? 'warning.light' : 'error.light',
                      color: employee.status === 'Excellent' ? 'success.dark' :
                             employee.status === 'Good' ? 'info.dark' :
                             employee.status === 'Average' ? 'warning.dark' : 'error.dark',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block'
                    }}>
                      {employee.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
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
            All Employees Attendance
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />
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
                {filteredEmployees.map((employee) => (
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
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.attendance}%</TableCell>
                    <TableCell>
                      <Box sx={{ 
                        bgcolor: employee.status === 'Excellent' ? 'success.light' :
                                employee.status === 'Good' ? 'info.light' :
                                employee.status === 'Average' ? 'warning.light' : 'error.light',
                        color: employee.status === 'Excellent' ? 'success.dark' :
                               employee.status === 'Good' ? 'info.dark' :
                               employee.status === 'Average' ? 'warning.dark' : 'error.dark',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'inline-block'
                      }}>
                        {employee.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
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