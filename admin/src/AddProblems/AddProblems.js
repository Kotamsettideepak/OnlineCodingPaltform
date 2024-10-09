import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  ButtonGroup,
  Button,
  Paper,
  Tooltip,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatListBulleted,
  FormatListNumbered,
  Image as ImageIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const tagsArray = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Breadth-First Search",
  "Tree",
  "Matrix",
  "Bit Manipulation",
  "Two Pointers",
  "Binary Tree",
  "Heap (Priority Queue)",
  "Prefix Sum",
  "Stack",
  "Simulation",
  "Graph",
  "Counting",
  "Design",
  "Sliding Window",
  "Backtracking",
  "Enumeration",
  "Union Find",
  "Linked List",
  "Ordered Set",
  "Monotonic Stack",
  "Number Theory",
  "Trie",
  "Segment Tree",
  "Divide and Conquer",
  "Queue",
  "Recursion",
  "Bitmask",
  "Binary Search Tree",
  "Geometry",
  "Memoization",
  "Binary Indexed Tree",
  "Hash Function",
  "Combinatorics",
  "Topological Sort",
  "String Matching",
  "Shortest Path",
  "Rolling Hash",
  "Game Theory",
  "Interactive",
  "Data Stream",
  "Brainteaser",
  "Monotonic Queue",
  "Randomized",
  "Merge Sort",
  "Iterator",
  "Doubly-Linked List",
  "Concurrency",
  "Probability and Statistics",
  "Quickselect",
  "Suffix Array",
  "Counting Sort",
  "Bucket Sort",
  "Minimum Spanning Tree",
  "Shell",
  "Line Sweep",
  "Reservoir Sampling",
  "Strongly Connected Component",
  "Eulerian Circuit",
  "Radix Sort",
  "Rejection Sampling",
  "Biconnected Component",
];

const AddProblems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [description, setdescription] = useState("");
  const [sampleTestCases, setsampleTestCases] = useState([
    { input: "", output: "" },
  ]);
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: "", output: "" },
  ]);
  const [tags, setTags] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("");
  const [subregion, setSubregion] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setTitle(data.title || "");
      setdescription(data.description || "");
      setsampleTestCases(data.sampleTestCases || [{ input: "", output: "" }]);
      setHiddenTestCases(data.hiddenTestCases || [{ input: "", output: "" }]);
      setTags(data.tags || []);
      setDifficulty(data.difficulty || "");
      setRegion(data.region || "");
      setSubregion(data.subregion || "");
    } else if (state) {
      setTitle(state.title || "");
      setdescription(state.description || "");
      setsampleTestCases(state.sampleTestCases || [{ input: "", output: "" }]);
      setHiddenTestCases(state.hiddenTestCases || [{ input: "", output: "" }]);
      setTags(state.tags || []);
      setDifficulty(state.difficulty || "");
      setRegion(state.region || "");
      setSubregion(state.subregion || "");
    }
  }, [state]);

  const handleFormatting = (command) => {
    document.execCommand(command);
  };

  const handlePreview = () => {
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
    localStorage.setItem("formData", JSON.stringify(data));

    navigate("/preview", { state: data });
  };

  const handleSampleInputChange = (index, field, value) => {
    const updatedsampleTestCases = [...sampleTestCases];
    updatedsampleTestCases[index][field] = value;
    setsampleTestCases(updatedsampleTestCases);
  };

  const handleHiddenTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...hiddenTestCases];
    updatedTestCases[index][field] = value;
    setHiddenTestCases(updatedTestCases);
  };

  const addSampleInput = () => {
    setsampleTestCases([...sampleTestCases, { input: "", output: "" }]);
  };

  const addHiddenTestCase = () => {
    setHiddenTestCases([...hiddenTestCases, { input: "", output: "" }]);
  };

  const deleteSampleInput = (index) => {
    setsampleTestCases(sampleTestCases.filter((_, i) => i !== index));
  };

  const deleteHiddenTestCase = (index) => {
    setHiddenTestCases(hiddenTestCases.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageHTML = (
          <img
            src={event.target.result}
            alt={file.name}
            style={{ maxWidth: "100%" }}
          />
        );
        setdescription((prevdescription) => prevdescription + imageHTML);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value.length <= 5) {
      setTags(value);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      style={{
        height: "100%",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4">
            {region}/{subregion}
          </Typography>
          <Button
            style={{ float: "right" }}
            variant="contained"
            color="success" // Use 'success' to get a green color button
            onClick={handlePreview}
          >
            Preview
          </Button>
        </Grid>
      </Grid>
      {/* Combined Grid container for Difficulty, Tags, Title, and Preview */}
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                label="Difficulty"
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={tags}
                onChange={handleTagChange}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {tagsArray.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ height: "100%" }}>
        <Grid
          item
          xs={12}
          md={8}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box style={{ overflow: "hidden", marginLeft: "20px" }}>
            <Box style={{ marginTop: "20px" }}>
              <ButtonGroup variant="outlined" aria-label="text formatting">
                <Tooltip title="Bold">
                  <Button onClick={() => handleFormatting("bold")}>
                    <FormatBold />
                  </Button>
                </Tooltip>
                <Tooltip title="Italic">
                  <Button onClick={() => handleFormatting("italic")}>
                    <FormatItalic />
                  </Button>
                </Tooltip>
                <Tooltip title="Underline">
                  <Button onClick={() => handleFormatting("underline")}>
                    <FormatUnderlined />
                  </Button>
                </Tooltip>
                <Tooltip title="Align Left">
                  <Button onClick={() => handleFormatting("justifyLeft")}>
                    <FormatAlignLeft />
                  </Button>
                </Tooltip>
                <Tooltip title="Align Center">
                  <Button onClick={() => handleFormatting("justifyCenter")}>
                    <FormatAlignCenter />
                  </Button>
                </Tooltip>
                <Tooltip title="Align Right">
                  <Button onClick={() => handleFormatting("justifyRight")}>
                    <FormatAlignRight />
                  </Button>
                </Tooltip>
                <Tooltip title="Bullet List">
                  <Button
                    onClick={() => handleFormatting("insertUnorderedList")}
                  >
                    <FormatListBulleted />
                  </Button>
                </Tooltip>
                <Tooltip title="Numbered List">
                  <Button onClick={() => handleFormatting("insertOrderedList")}>
                    <FormatListNumbered />
                  </Button>
                </Tooltip>
                <Tooltip title="Upload Image">
                  <Button component="label">
                    <ImageIcon />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      hidden
                    />
                  </Button>
                </Tooltip>
              </ButtonGroup>
              <Paper
                style={{
                  padding: "20px",
                  boxSizing: "border-box",
                  overflowY: "auto",
                  marginTop: "10px",
                }}
              >
                <Typography variant="h5" style={{ marginBottom: "20px" }}>
                  Problem Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                  placeholder="Enter problem description here..."
                />
              </Paper>
              <Box style={{ marginTop: "20px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addSampleInput}
                  style={{ marginTop: "10px", float: "right" }}
                >
                  Add Sample Input
                </Button>
                {sampleTestCases.map((item, index) => (
                  <Paper
                    key={index}
                    elevation={3}
                    style={{ padding: "20px", marginTop: "10px" }}
                  >
                    <Typography variant="h6">
                      Sample Input {index + 1}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      label="Input"
                      value={item.input}
                      style={{ marginBottom: "5px" }}
                      onChange={(e) =>
                        handleSampleInputChange(index, "input", e.target.value)
                      }
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      label="Output"
                      style={{ marginBottom: "5px" }}
                      value={item.output}
                      onChange={(e) =>
                        handleSampleInputChange(index, "output", e.target.value)
                      }
                    />

                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteSampleInput(index)}
                      style={{ marginTop: "10px" }}
                    >
                      Delete
                    </Button>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={addHiddenTestCase}
            style={{ marginTop: "20px", float: "right" }}
          >
            Add Hidden Test Case
          </Button>
          <Box style={{ marginTop: "80px" }}>
            {/* Hidden Test Cases Section */}
            {hiddenTestCases.map((item, index) => (
              <Paper
                key={index}
                elevation={3}
                style={{ padding: "20px", marginTop: "10px" }}
              >
                <Typography variant="h6">
                  Hidden Test Case {index + 1}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  style={{ marginBottom: "5px" }}
                  rows={2}
                  variant="outlined"
                  label="Input"
                  value={item.input}
                  onChange={(e) =>
                    handleHiddenTestCaseChange(index, "input", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  label="Output"
                  value={item.output}
                  onChange={(e) =>
                    handleHiddenTestCaseChange(index, "output", e.target.value)
                  }
                />
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => deleteHiddenTestCase(index)}
                  style={{ marginTop: "10px" }}
                >
                  Delete
                </Button>
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddProblems;
