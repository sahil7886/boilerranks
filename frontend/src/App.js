import React, { useRef, useState, useEffect } from 'react';
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
      paper: '#1F1F1F',
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
  const [professorOptions, setProfessorOptions] = useState([]);
  const resultRef = useRef(null);
  const [avgGPA, setavgGPA] = useState(null);
  const [gradeMessage, setGradeMessage] = useState('');

  // Map of GPA to letter grades
  const gradeRanges = {
    4: 'A',
    3.7: 'A-',
    3.3: 'B+',
    3: 'B',
    2.7: 'B-',
    2.3: 'C+',
    2: 'C',
    1.7: 'C-',
    1.3: 'D+',
    1: 'D',
    0.7: 'D-',
    0: 'F'
  };

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

  useEffect(() => {
    const fetchProfessors = async () => {
      if (currentCourse.code && currentCourse.semester) {
        try {
          const response = await fetch('http://127.0.0.1:5000/professors', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              course: currentCourse.code,
              semester: currentCourse.semester
            })
          });
          const data = await response.json();
          setProfessorOptions(data.professors);
        } catch (error) {
          console.error('Error fetching professors:', error);
        }
      }
    };

    fetchProfessors();
  }, [currentCourse.code, currentCourse.semester]);

  const addCourse = () => {
    setCourses([...courses, currentCourse]);
    setCurrentCourse({ code: '', grade: '', semester: '', professor: '' });
  };

  const calculateRank = async () => {
    //done: link to backend
    //send to backend: semester, course, instructor & grade
    const response = await fetch('http://127.0.0.1:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        semester: currentCourse.semester,
        course: currentCourse.code,
        instructor: currentCourse.professor,
        grade: currentCourse.grade
      })
    });
    const data = await response.json();

    console.log(`upper bound = ${data.upper_bound} and lower bound = ${data.lower_bound}`);
    console.log(`avg gpa was ${data.avg_gpa}`);

    const result = Math.round(100 - data.lower_bound);
    setavgGPA(data.avg_gpa);
    await resultMessage(data.avg_gpa);
    setResult(result);
  };

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const resultMessage = (gpa) => {
    const findGrades = (gpa) => {
      const grades = Object.keys(gradeRanges).sort((a, b) => b - a);
      
      // Check for exact matches first
      for (let grade of grades) {
        if (parseFloat(grade) === gpa) {
          return `That translates to a ${gradeRanges[grade]}.`;
        }
      }

      // Find the range if not an exact match
      for (let i = 0; i < grades.length - 1; i++) {
        if (gpa >= grades[i]) {
          let upperGrade = gradeRanges[grades[i]];
          let lowerGrade = gradeRanges[grades[i + 1]];
          return `That is between a ${upperGrade} and ${lowerGrade}.`;
        }
      }

      // Handle edge cases
      if (gpa < grades[grades.length - 1]) {
        return `That translates to an F.`;
      } else if (gpa > grades[0]) {
        return `That translates to an A.`;
      }
    };

    if (gpa !== undefined) {
      const message = findGrades(gpa);
      setGradeMessage(message);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ width: '49%', mt: 8, mb: 12 }}>
        <Typography variant="h3" component="h2" gutterBottom align="center" color="primary" fontWeight="bold">
          BoilerRanks
        </Typography>
        <Typography variant='body1' sx={{ marginTop: '32px' }} fontWeight="regular" align="center">
        Because of vastly varying average grades from course to course, your grade in a class is often not an accurate representation of how well you did.<br /><br />That's where 
          <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            &nbsp;BoilerRanks&nbsp;
          </Typography>
          comes in. Using data sourced from Purdue, we help you accurately determine how well you actually did in a class.
        </Typography>
        
        <Card sx={{ mt: 5, mb: 4 }}>
          <CardContent>
            <RadioGroup row value={mode} onChange={handleModeChange} sx={{ mb: 2 }}>
              <FormControlLabel value="single" control={<Radio />} label="Single Course %ile" />
              <FormControlLabel value="overall" control={<Radio />} label="Overall %ile" />
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
                <InputLabel>Semester</InputLabel>
                <Select
                  name="semester"
                  value={currentCourse.semester}
                  onChange={handleInputChange}
                  label="Semester"
                >
                  {['Fall 2022', 'Spring 2023', 'Summer 2023', 'Fall 2023', 'Spring 2024'].map((semester) => (
                    <MenuItem key={semester} value={semester}>{semester}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Professor</InputLabel>
                <Select
                  name="professor"
                  value={currentCourse.professor}
                  onChange={handleInputChange}
                  label="Professor"
                >
                  {professorOptions.map((professor) => (
                    <MenuItem key={professor} value={professor}>{professor}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Grade</InputLabel>
                <Select
                  name="grade"
                  value={currentCourse.grade}
                  onChange={handleInputChange}
                  label="Grade"
                >
                  {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E', 'F'].map((grade) => (
                    <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
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
          <Typography variant="h6" align="center" sx={{mt: 6}} ref={resultRef} fontWeight={'regular'}>
            You were in the top {result}% of your {mode === 'single' ? 'class' : 'classes'}. The average GPA in that course session was {avgGPA}. {gradeMessage}
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