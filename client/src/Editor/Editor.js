import React, { useState, useEffect, useCallback } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Grid,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import axios from "axios";

const Editor = ({ sampleTestCases, hiddenTestCases }) => {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [editorTheme, setEditorTheme] = useState("dark");
  const [timer, setTimer] = useState(0);
  const [sampleResults, setSampleResults] = useState([]);
  const [hiddenResults, setHiddenResults] = useState([]);
  const [allPassed, setAllPassed] = useState(false);
  const [passedHiddenCount, setPassedHiddenCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [AllCasesPassed, setAllCasesPassed] = useState(true);

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Default Hello World programs
  const defaultPrograms = {
    python: `print("Hello World!")`,
    java: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  };

  // Update code when language changes
  useEffect(() => {
    setCode(defaultPrograms[language]);
  }, [language]);

  const handleLanguageChange = (event) => setLanguage(event.target.value);

  const handleThemeToggle = () =>
    setEditorTheme((prev) => (prev === "light" ? "dark" : "light"));

  const normalizeOutput = (output) => output.trim().replace(/\s+/g, " ");

  const handleReset = () => {
    setCode(defaultPrograms[language]);
    setTimer(0);
    setSampleResults([]);
    setHiddenResults([]);
    setPassedHiddenCount(0);
    setSubmitClicked(false);
    setAllCasesPassed(true);
  };

  const handleSubmit = useCallback(async () => {
    const data = { language, code };
    setLoading(true);
    setSubmitClicked(true);

    try {
      // Execute sample test cases
      const sampleResults = await Promise.all(
        sampleTestCases.map(async (testCase) => {
          const res = await axios.post(
            "http://localhost:5000/execute/compile",
            {
              ...data,
              input: testCase.input,
            }
          );
          return {
            input: testCase.input,
            expected: normalizeOutput(testCase.output),
            received: normalizeOutput(res.data.output),
          };
        })
      );

      setSampleResults(sampleResults);

      // Execute hidden test cases with live updates
      let passedCount = 0;
      const hiddenResults = [];

      for (const testCase of hiddenTestCases) {
        const res = await axios.post("http://localhost:5000/execute/compile", {
          ...data,
          input: testCase.input,
        });
        const result = {
          input: testCase.input,
          expected: normalizeOutput(String(testCase.output)),
          received: normalizeOutput(String(res.data.output)),
        };
        hiddenResults.push(result);

        if (result.expected === result.received) {
          passedCount++;
        } else {
          setAllCasesPassed(false);
          break; // Stop execution on first failure
        }
      }

      setHiddenResults(hiddenResults);
      setPassedHiddenCount(passedCount);

      setAllPassed(
        sampleResults.every((result) => result.expected === result.received) &&
          hiddenResults.length === hiddenTestCases.length
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [code, language, sampleTestCases, hiddenTestCases]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div>
      {/* Header Row: Language, Theme Toggle, Timer */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{ marginBottom: "20px" }}
      >
        {/* Language Selector */}
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              value={language}
              onChange={handleLanguageChange}
              label="Language"
            >
              <MenuItem value={"java"}>Java</MenuItem>
              <MenuItem value={"python"}>Python</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Theme Toggle */}
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            Theme
          </Typography>
          <IconButton onClick={handleThemeToggle}>
            {editorTheme === "light" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Grid>

        {/* Timer */}
        <Grid
          item
          xs={12}
          sm={4}
          md={6}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <AccessTime fontSize="large" sx={{ marginRight: 1 }} />
          <Typography variant="body1">Timer: {formatTime(timer)}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setTimer(1)}
            sx={{ marginLeft: 2 }}
          >
            Start Timer
          </Button>
        </Grid>
      </Grid>

      {/* Monaco Editor */}
      <MonacoEditor
        height="400px"
        language={language}
        theme={editorTheme === "light" ? "light" : "vs-dark"}
        value={code}
        onChange={(value) => setCode(value)}
      />

      {/* Run, Reset, and Submit Buttons */}
      <Grid container spacing={2} sx={{ marginTop: "20px" }}>
        {/* Left side for Run and Reset buttons */}
        <Grid item xs={12} sm={6} md={8}>
          <Button variant="contained" color="secondary" onClick={handleReset}>
            Reset Code
          </Button>
        </Grid>

        {/* Right side for Submit button */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>

      {/* Results Table */}
      {submitClicked &&
        (sampleResults.length > 0 || hiddenResults.length > 0) && (
          <TableContainer
            style={{ whiteSpace: "pre-line" }}
            component={Paper}
            sx={{ marginTop: "20px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sample Input</TableCell>
                  <TableCell>Expected Output</TableCell>
                  <TableCell>Received Output</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.input}</TableCell>
                    <TableCell>{result.expected}</TableCell>
                    <TableCell>{result.received}</TableCell>
                    <TableCell>
                      {result.expected === result.received
                        ? "Correct"
                        : "Incorrect"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

      {/* Hidden Test Cases Results */}
      {submitClicked && hiddenTestCases.length > 0 && (
        <Typography sx={{ marginTop: "20px" }}>
          Hidden Test Cases Passed: {passedHiddenCount} /{" "}
          {hiddenTestCases.length}
        </Typography>
      )}

      {/* Success Animation */}
      {AllCasesPassed && allPassed && hiddenResults.length > 0 && (
        <Grid container justifyContent="center" sx={{ marginTop: "20px" }}>
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            All Test Cases Passed 🎉
          </Typography>
        </Grid>
      )}

      {loading && (
        <Grid container justifyContent="center" sx={{ marginTop: "20px" }}>
          <CircularProgress />
        </Grid>
      )}
    </div>
  );
};

export default Editor;
