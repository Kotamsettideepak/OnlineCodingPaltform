import React from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    title,
    description,
    sampleTestCases,
    hiddenTestCases,
    region,
    subregion,
    tags,
    difficulty,
  } = location.state || {};

  const handleSubmit = async () => {
    const data = {
      title,
      description,
      sampleTestCases,
      hiddenTestCases,
      region,
      subregion,
      tags,
      difficulty,
    };

    try {
      const res = await axios.post(
        `http://localhost:5000/${region}/addProblem`,
        data
      );
      console.log(res);

      if (res.status === 200) {
        alert(res.data.message);
        localStorage.removeItem("formData");
        navigate("/add-stories");
      } else {
        alert("Unexpected response");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <Grid container spacing={2} style={{ padding: "20px" }}>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{title}</Typography>
          <Typography variant="h6" color="textSecondary">
            Difficulty: {difficulty}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Problem Description
          </Typography>
          <Typography
            variant="body1"
            paragraph
            style={{ whiteSpace: "pre-line" }} // This preserves line breaks
          >
            {description}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Sample Inputs and Outputs
          </Typography>
          <List>
            {sampleTestCases.map((sample, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Input ${index + 1}: ${sample.input}`}
                  secondary={`Output ${index + 1}: ${sample.output}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Tags: {tags.join(", ")}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginRight: "10px" }}
          >
            Submit
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back to Edit
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Preview;
