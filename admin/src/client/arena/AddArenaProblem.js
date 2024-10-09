import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AddArenaProblems.module.css";

function AddArenaProblem() {
  const navigate = useNavigate();

  const fields = useMemo(
    () => [
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
    ],
    []
  );

  const [tagsCount, setTagsCount] = useState({});

  useEffect(() => {
    console.log("vacha");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/arena/getCount/${fields}`
        );
        console.log(response.data);

        setTagsCount(response.data);
      } catch (err) {
        console.error("Error Getting Count:", err);
      }
    };

    fetchData();
  }, [fields]);

  const handleAddProblem = (field) => {
    navigate("/add-problem", {
      state: {
        region: "arena",
        subregion: field,
      },
    });
  };

  return (
    <TableContainer component={Paper}>
      <div className={styles.container} style={{}}>
        <h1 className={styles.title}>Arena 🏟️</h1>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Field</TableCell>
            <TableCell>Add Problem</TableCell>
            <TableCell>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{field}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddProblem(field)}
                >
                  Add Problem
                </Button>
              </TableCell>
              <TableCell>{`${tagsCount[field] || 0} Problems`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AddArenaProblem;
