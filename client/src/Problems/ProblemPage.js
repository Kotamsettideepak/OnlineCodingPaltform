import React from "react";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import Editor from "../Editor/Editor";
import { Box, Typography, Paper, Chip, Grid } from "@mui/material";

function ProblemPage() {
  const location = useLocation();
  const {
    problemTitle,
    description,
    sampleTestCases,
    hiddenTestCases,
    tags,
    difficulty,
  } = location.state || {};

  return (
    <Grid container sx={{ height: "90vh" }}>
      {/* Left Section */}
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          overflowY: "auto", // Scrollable content on the left
          padding: 2,
          height: "100%", // Full height for the left section
        }}
      >
        <Typography variant="h4" gutterBottom>
          {problemTitle}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "red", fontWeight: "bold" }}
        >
          Difficulty: {difficulty}
        </Typography>

        <Box sx={{ marginBottom: 2 }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              sx={{ marginRight: 1, marginBottom: 1 }}
            />
          ))}
        </Box>

        <Paper elevation={2} sx={{ padding: 2, marginBottom: 3 }}>
          <Typography
            variant="body1"
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description),
            }}
          />
        </Paper>

        <Typography variant="h5" gutterBottom>
          Sample Test Cases:
        </Typography>

        {sampleTestCases.length > 0 ? (
          sampleTestCases.map((testCase, index) => (
            <Paper
              style={{ whiteSpace: "pre-line" }}
              key={index}
              elevation={1}
              sx={{ padding: 2, marginBottom: 2 }}
            >
              <Typography>
                <strong>Input:</strong> <br />
                {testCase.input}
              </Typography>
              <Typography>
                <strong>Output:</strong> {testCase.output}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography>No sample test cases available.</Typography>
        )}
      </Grid>

      {/* Right Section */}
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          padding: 2,
          height: "100%", // Full height for the right section
        }}
      >
        <Editor
          sampleTestCases={sampleTestCases}
          hiddenTestCases={hiddenTestCases}
        />
      </Grid>
    </Grid>
  );
}

export default ProblemPage;
