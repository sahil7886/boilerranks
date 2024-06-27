import React, { useState } from 'react';
import { 
  ThemeProvider, createTheme, 
  CssBaseline, Container, Typography, 
  Box, Card, CardContent, TextField, 
  Button, Radio, RadioGroup, FormControlLabel, 
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFCC00',
    },
    background: {
      default: '#1A1A1A',
      paper: '#232323',
    },
    text: {
      primary: '#FFFFFF',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

function App() {
  const [mode, setMode] = useState('single');
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState({
    code: '',
    grade: '',
    semester: '',
    professor: '',
  });
  const [result, setResult] = useState(null);

  const handleModeChange = (event) => {
    setMode(event.target.value);
    setResult(null);
  };

  const handleInputChange = (event) => {
    setCurrentCourse({
      ...currentCourse,
      [event.target.name]: event.target.value,
    });
  };

  const addCourse = () => {
    setCourses([...courses, currentCourse]);
    setCurrentCourse({ code: '', grade: '', semester: '', professor: '' });
  };

  const calculateRank = () => {
    // This is where you'd implement the actual ranking logic
    const rank = Math.floor(Math.random() * 100);
    setResult(rank);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          BoilerRanks
        </Typography>
        <Card sx={{ mt: 8, mb: 4 }}>
          <CardContent>
            <RadioGroup row value={mode} onChange={handleModeChange} sx={{ mb: 2 }}>
              <FormControlLabel value="single" control={<Radio />} label="Single Course" />
              <FormControlLabel value="overall" control={<Radio />} label="Overall Ranking" />
            </RadioGroup>
            <Box component="form" noValidate autoComplete="off">
              <TextField
                fullWidth
                label="Course Code"
                name="code"
                value={currentCourse.code}
                onChange={handleInputChange}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Grade</InputLabel>
                <Select
                  name="grade"
                  value={currentCourse.grade}
                  onChange={handleInputChange}
                  label="Grade"
                >
                  {['A', 'B', 'C', 'D', 'F'].map((grade) => (
                    <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Semester"
                name="semester"
                value={currentCourse.semester}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Professor"
                name="professor"
                value={currentCourse.professor}
                onChange={handleInputChange}
                margin="normal"
              />
              {mode === 'overall' && (
                <Button variant="contained" onClick={addCourse} sx={{ mt: 2 }}>
                  Add Course
                </Button>
              )}
              <Button 
                fullWidth 
                variant="contained" 
                onClick={calculateRank} 
                sx={{ mt: 2 }}
              >
                Calculate Rank
              </Button>
            </Box>
          </CardContent>
        </Card>
        {result !== null && (
          <Typography variant="h5" align="center">
            Your {mode === 'single' ? 'percentile' : 'average percentile'} rank: {result}%
          </Typography>
        )}
        {mode === 'overall' && courses.length > 0 && (
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Added Courses</Typography>
              {courses.map((course, index) => (
                <Typography key={index} variant="body2">
                  {course.code} - {course.grade} ({course.semester}, {course.professor})
                </Typography>
              ))}
            </CardContent>
          </Card>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;