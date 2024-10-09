import React, { useState, useEffect } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import Styles from "./Editor.module.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CachedIcon from "@mui/icons-material/Cached";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import {
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

const CodeEditor = ({ sampleTestCases, hiddenTestCases }) => {
  const [Language, setLanguage] = useState("java");
  const [ScreenMode, setScreenMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [codeContent, setCodeContent] = useState("");
  const [sampleResults, setSampleResults] = useState([]);
  const [hiddenResults, setHiddenResults] = useState([]);
  const [passedHiddenCount, setPassedHiddenCount] = useState(0);
  const [allPassed, setAllPassed] = useState(false);
  const [messageType, setMessageType] = useState(""); // Message type for animation

  const Code = {
    python: `print("Hello World!")`,
    java: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  };

  useEffect(() => {
    setCodeContent(Code[Language]);
  }, [Language]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const handleRunCode = async () => {
    const data = { Language, codeContent }; // Define data here
    try {
      const results = await Promise.all(
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
            expected: testCase.expected,
            received: res.data.output,
          };
        })
      );
      setSampleResults(results);
      setAllPassed(
        results.every((result) => result.expected === result.received)
      );
    } catch {
      alert("Something went wrong");
    }
  };

  const handleSubmitCode = async () => {
    const data = { Language, codeContent }; // Define data here
    try {
      // Run both sample and hidden test cases
      const results = await Promise.all(
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
            expected: testCase.expected,
            received: res.data.output,
          };
        })
      );
      setSampleResults(results);

      const hiddenResults = await Promise.all(
        hiddenTestCases.map(async (testCase) => {
          const res = await axios.post(
            "http://localhost:5000/execute/compile",
            {
              ...data,
              input: testCase.input,
            }
          );
          return {
            input: testCase.input,
            expected: testCase.expected,
            received: res.data.output,
          };
        })
      );
      setHiddenResults(hiddenResults);
      setPassedHiddenCount(
        hiddenResults.filter((result) => result.expected === result.received)
          .length
      );
    } catch {
      alert("Something went wrong");
    }
  };

  const handleResetCode = () => {
    setTimer(0);
    setIsRunning(true);
    setCodeContent(Code[Language]);
    setMessageType(""); // Reset the message type
  };

  const toggleFullscreen = () => {
    const editorElement = document.querySelector(`.${Styles.main}`);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      editorElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      handleRunCode();
    });
  };

  return (
    <div className={Styles.main}>
      <div className={Styles.left}>
        <div className={Styles.head}>
          <Select
            value={Language}
            onChange={(event) => setLanguage(event.target.value)}
            className={Styles.select}
          >
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
          <div className={Styles.headright}>
            <span className={Styles.time}>{formatTime(timer)}</span>
            <PlayArrowIcon
              style={{ color: "green", fontSize: "40px", cursor: "pointer" }}
              onClick={handleRunCode}
            />
            <Button
              variant="contained"
              color="primary"
              className={Styles.submitButton}
              onClick={handleSubmitCode}
            >
              Submit
            </Button>
            {ScreenMode ? (
              <DarkModeIcon onClick={() => setScreenMode(!ScreenMode)} />
            ) : (
              <LightModeIcon onClick={() => setScreenMode(!ScreenMode)} />
            )}
            <CachedIcon onClick={handleResetCode} />
            {isFullscreen ? (
              <FullscreenExitIcon onClick={toggleFullscreen} />
            ) : (
              <FullscreenIcon onClick={toggleFullscreen} />
            )}
          </div>
        </div>
        <MonacoEditor
          height="60vh"
          theme={ScreenMode ? "vs-dark" : "light"}
          language={Language}
          value={codeContent}
          onChange={(value) => setCodeContent(value)}
          options={{ fontSize: 16 }}
          onMount={handleEditorDidMount}
        />
        <div className={Styles.results}>
          {sampleResults.length > 0 && (
            <>
              <TableContainer component={Paper} className={Styles.resultsTable}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Input</TableCell>
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
                          {result.expected === result.received ? (
                            <span className={Styles.pass}>✔</span>
                          ) : (
                            <span className={Styles.fail}>✘</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className={Styles.hiddenResults}>
                <p>
                  Hidden Test Cases Passed: {passedHiddenCount} /{" "}
                  {hiddenTestCases.length}
                </p>
              </div>
              {allPassed && (
                <div className={Styles.successAnimation}>All Tests Passed!</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
