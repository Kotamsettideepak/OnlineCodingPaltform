import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
function ProblemSheet() {
  const location = useLocation();
  const navigate = useNavigate();
  const { region, subregion } = location.state || {};
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/${region}/getProblems/${subregion}`
        );
        console.log(res);

        setProblems(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [region, subregion]);

  const handleSolveClick = (problem) => {
    navigate("/problem-page", {
      state: {
        problemTitle: problem.cardTitle,
        description: problem.description,
        sampleTestCases: problem.sampleTestCases,
        hiddenTestCases: problem.hiddenTestCases,
        tags: problem.tags,
        difficulty: problem.difficulty,
      },
    });
  };

  // Function to determine color based on difficulty level
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "#4caf50"; // green for easy
      case "medium":
        return "#ff9800"; // orange for medium
      case "hard":
        return "#f44336"; // red for hard
      default:
        return "#607d8b"; // default grey
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <center>
        <h2>Coding Questions</h2>
      </center>

      <p style={{ fontSize: "20px", marginBottom: "20px" }}>{subregion}</p>

      {loading ? (
        <p>Loading problems...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="problem table">
            <TableHead>
              <TableRow>
                <TableCell>Problem Title</TableCell>
                <TableCell align="center">Difficulty</TableCell>
                <TableCell align="center">Solve</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {problems.map((problem, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {problem.title}
                  </TableCell>
                  <TableCell align="center">
                    {problem.difficulty.charAt(0).toUpperCase() +
                      problem.difficulty.slice(1)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#4caf50", color: "white" }}
                      onClick={() => handleSolveClick(problem)}
                    >
                      Solve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default ProblemSheet;
