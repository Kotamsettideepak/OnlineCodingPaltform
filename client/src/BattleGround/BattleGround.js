import React, { useState, useEffect } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import styles from "./BattleGround.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading.js";

// Format date and time for display
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const BattleGround = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState({
    ongoing: [],
    upcoming: [],
    previous: [],
  });

  // State to track the loading status for each contest registration
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/battleground/getContests"
        );
        const contestData = response.data.data;
        categorizeContests(contestData);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    const categorizeContests = (contestData) => {
      const now = new Date();
      const ongoing = [];
      const upcoming = [];
      const previous = [];

      contestData.forEach((contest) => {
        const contestStart = new Date(contest.contestScheduledDate);
        const contestEnd = new Date(contestStart);
        contestEnd.setHours(contestEnd.getHours() + contest.duration);

        if (now >= contestStart && now <= contestEnd) {
          ongoing.push(contest);
        } else if (now < contestStart) {
          upcoming.push(contest);
        } else {
          previous.push(contest);
        }
      });

      setContests({
        ongoing,
        upcoming,
        previous,
      });
    };

    fetchContests();
  }, []);

  const renderContests = (title, contestList) => (
    <Grid item xs={12} className={styles.section}>
      <Typography variant="h6" className={styles.sectionTitle}>
        {title}
      </Typography>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell>Contest Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contestList.length > 0 ? (
              contestList.map((contest) => (
                <TableRow key={contest._id} className={styles.tableRow}>
                  <TableCell>{contest.contestTitle}</TableCell>
                  <TableCell>
                    {formatDateTime(contest.contestScheduledDate)}
                  </TableCell>
                  <TableCell className={styles[calculateStatus(contest)]}>
                    {calculateStatus(contest)}
                  </TableCell>
                  <TableCell>
                    {calculateStatus(contest) === "Upcoming" ? (
                      <Button
                        className={styles.registerButton}
                        disabled={loading}
                        onClick={() => handleRegister(contest.contestTitle)}
                      >
                        {loading ? <CircularProgress size={24} /> : "Register"}
                      </Button>
                    ) : (
                      <Button
                        className={styles.goToContestButton}
                        onClick={() => handleGoToContest(contest.contestTitle)}
                      >
                        Go to Contest
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className={styles.noDataMessage}>
                  No Contests Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );

  const calculateStatus = (contest) => {
    const now = new Date();
    const contestStart = new Date(contest.contestScheduledDate);
    const contestEnd = new Date(contestStart);
    contestEnd.setHours(contestEnd.getHours() + contest.duration);

    if (now >= contestStart && now <= contestEnd) {
      return "Live";
    } else if (now < contestStart) {
      return "Upcoming";
    } else {
      return "Completed";
    }
  };

  const handleGoToContest = (contestTitle) => {
    navigate("/ProblemSheet", {
      state: {
        region: "battleground",
        subregion: contestTitle,
      },
    });
  };

  const handleRegister = async (contestTitle) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/battleground/register", {
        user: "Deepak",
        mail: "deepaksj157@gmail.com",
        contestName: contestTitle,
      });
    } catch (error) {
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.BattleGround}>
      <div className={styles.title}>
        <Typography variant="h4" align="center" className={styles.titleText}>
          BattleGround
        </Typography>
      </div>
      <div className={styles.body}>
        <Grid container spacing={2} style={{ marginTop: "20px" }}>
          {renderContests("Ongoing Contests", contests.ongoing)}
          {renderContests("Upcoming Contests", contests.upcoming)}
          {renderContests("Previous Contests", contests.previous)}
        </Grid>
      </div>
    </div>
  );
};

export default BattleGround;
