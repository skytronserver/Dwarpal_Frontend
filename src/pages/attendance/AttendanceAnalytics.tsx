import { Grid, Typography, Paper, Box, Card, CardContent, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";

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

const topEmployees = [
  { id: 1, name: 'John Doe', department: 'IT', attendance: 100, avatar: '👨‍💻' },
  { id: 2, name: 'Jane Smith', department: 'HR', attendance: 98, avatar: '👩‍💼' },
  { id: 3, name: 'Mike Johnson', department: 'Finance', attendance: 97, avatar: '👨‍💼' },
  { id: 4, name: 'Sarah Wilson', department: 'IT', attendance: 96, avatar: '👩‍💻' },
];

const monthlyTrend = [
  { month: 'Jan', averageAttendance: 96, averagePunctuality: 94 },
  { month: 'Feb', averageAttendance: 94, averagePunctuality: 92 },
  { month: 'Mar', averageAttendance: 95, averagePunctuality: 93 },
  { month: 'Apr', averageAttendance: 93, averagePunctuality: 91 },
];

const AttendanceAnalytics = () => {
  const navigate = useNavigate();
  const {hasRole} = useAuth();
  const handleEmployeeClick = (employeeId: number) => {
    navigate(`/attendance/${employeeId}`);
  };

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

      {/* Top Performers */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>{hasRole(['HR','ADMIN']) ? 'Top Performers' : 'Employees Attendance'}</Typography>
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
              {topEmployees.map((employee) => (
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
                      bgcolor: 'success.light',
                      color: 'success.dark',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block'
                    }}>
                      Excellent
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AttendanceAnalytics; 