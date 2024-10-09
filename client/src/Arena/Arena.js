import React, { useState } from "react";
import {
  Chip,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./Arena.module.css";

function Arena() {
  const [selectedChip, setSelectedChip] = useState("");
  const navigate = useNavigate();

  const handleChipClick = (chipName) => {
    setSelectedChip(chipName);
  };

  const handleStartClick = () => {
    if (selectedChip) {
      navigate("/ProblemSheet", {
        state: { region: "arena", subregion: selectedChip },
      });
    }
  };

  const chipData = [
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
  ];

  const rows = [];
  for (let i = 0; i < chipData.length; i += 4) {
    rows.push(chipData.slice(i, i + 4)); // 4 chips per row
  }

  return (
    <div className={styles.page}>
      {/* Title Section */}
      <div className={styles.title}>
        <Typography variant="h4" align="center" className={styles.titleText}>
          🚀 Level Up Your Coding
        </Typography>
      </div>

      {/* Content Section (Left and Right) */}
      <div className={styles.content}>
        {/* Left Section */}
        <div className={styles.left}>
          <Table>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((label, index) => (
                    <TableCell key={index}>
                      <Chip
                        label={label}
                        onClick={() => handleChipClick(label)}
                        className={`${styles.chip} ${
                          selectedChip === label ? styles.selectedChip : ""
                        }`}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right Section */}
        <div className={styles.right}>
          <Typography variant="h5" align="center" className={styles.rightText}>
            {selectedChip
              ? `Selected Topic: ${selectedChip}`
              : "Select a Topic"}
          </Typography>

          {selectedChip && (
            <Button
              variant="contained"
              onClick={handleStartClick}
              className={styles.startButton}
            >
              Start
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Arena;
