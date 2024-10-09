import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import styles from "./AddContest.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

// Convert date string to format for datetime-local input
const formatDateTimeForInput = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Convert date string to yyyy-mm-dd format for comparison
const formatDateForComparison = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function AddContest() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [contests, setContests] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentContestId, setCurrentContestId] = useState(null);
  const [previousContestImage, setPreviousContestImage] = useState(null);
  const [newContest, setNewContest] = useState({
    name: "",
    image: null,
    scheduleDate: "",
    duration: 1,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [filter, setFilter] = useState({ status: "", date: "" });

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false); // Set to false when adding new contest
  };
  const handleClose = () => setOpen(false);

  const handleEdit = (contest) => {
    setPreviousContestImage(contest.image);
    setNewContest({
      name: contest.name,
      image: contest.image,
      scheduleDate: contest.contestScheduledDate,
      duration: contest.duration,
    });
    setCurrentContestId(contest.id);
    setEditMode(true);
    setOpen(true);
  };

  // Fetch contests using useEffect
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/battleground/getContests"
        );
        console.log(response);

        setContests(
          response.data.data.map((contest) => ({
            ...contest,
            id: contest._id,
            name: contest.contestTitle,
            status: calculateStatus(contest),
            date: formatDateTime(contest.contestScheduledDate),
            duration: contest.duration,
            image: contest.contestImage,
            dateForComparison: formatDateForComparison(
              contest.contestScheduledDate
            ),
          }))
        );
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };
    fetchContests();
  }, []);

  const handleDelete = async (cont) => {
    if (window.confirm("Are you sure you want to delete this contest?")) {
      await axios
        .delete(
          `http://localhost:5000/battleground/deleteContest/${cont.id}/${cont.contestImage}`
        )
        .then((res) => {
          if (res.status === 200) {
            setContests(contests.filter((contest) => contest.id !== cont.id));
          }
        })
        .catch(() => {
          alert("mg");
        });
    }
  };

  const handleAddContest = async () => {
    const formData = new FormData();
    formData.append("region", "battleground");
    formData.append("contestTitle", newContest.name);
    formData.append("contestScheduledDate", newContest.scheduleDate);
    formData.append("duration", newContest.duration);
    formData.append("contestImage", newContest.image);

    try {
      const res = await axios.post(
        "http://localhost:5000/battleground/addContest",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(res.data.message);

      const newContestData = {
        id: res.data.newContestId, // Assuming backend returns new contest ID
        name: newContest.name,
        date: formatDateTime(newContest.scheduleDate),
        duration: newContest.duration,
        status: calculateStatus({
          contestScheduledDate: newContest.scheduleDate,
          duration: newContest.duration,
        }),
        image: URL.createObjectURL(newContest.image),
        dateForComparison: formatDateForComparison(newContest.scheduleDate),
      };

      setContests((prevContests) => [...prevContests, newContestData]);

      handleClose(); // Close the dialog after successful submission
    } catch (error) {
      alert("Error adding contest");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewContest({ ...newContest, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const calculateStatus = (contest) => {
    const now = new Date();
    const contestStart = new Date(contest.contestScheduledDate);
    const contestEnd = new Date(contestStart);
    contestEnd.setHours(contestEnd.getHours() + contest.duration);

    if (now >= contestStart && now <= contestEnd) {
      return "live";
    } else if (now > contestEnd) {
      return "completed";
    } else {
      return "upcoming";
    }
  };

  const updateContestStatuses = () => {
    setContests((prevContests) =>
      prevContests.map((contest) => ({
        ...contest,
        status: calculateStatus(contest),
      }))
    );
  };

  useEffect(() => {
    const interval = setInterval(updateContestStatuses, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredContests = contests.filter((contest) => {
    const matchStatus = filter.status ? contest.status === filter.status : true;
    const matchDate = filter.date
      ? contest.dateForComparison === filter.date
      : true;
    return matchStatus && matchDate;
  });

  const handleAddProblem = (name) => {
    navigate("/add-problem", {
      state: {
        region: "battleground",
        subregion: name,
      },
    });
  };

  const handleUpdateContest = async () => {
    const formData = new FormData();
    formData.append("contestTitle", newContest.name);
    formData.append("contestScheduledDate", newContest.scheduleDate);
    formData.append("duration", newContest.duration);
    formData.append("OldContestImage", previousContestImage);

    // Only append the new image if it's a File object (indicating a new image was uploaded)
    if (newContest.image && typeof newContest.image === "object") {
      formData.append("contestImage", newContest.image);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/battleground/updateContest/${currentContestId}/${previousContestImage}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        const updatedContestData = {
          id: currentContestId,
          name: newContest.name,
          date: formatDateTime(newContest.scheduleDate),
          duration: newContest.duration,
          status: calculateStatus({
            contestScheduledDate: newContest.scheduleDate,
            duration: newContest.duration,
          }),
          image:
            newContest.image && typeof newContest.image === "object"
              ? URL.createObjectURL(newContest.image)
              : previousContestImage, // Keep the previous image URL if no new image is uploaded
        };

        // Update the contests list with the updated contest data
        setContests((prevContests) =>
          prevContests.map((contest) =>
            contest.id === currentContestId ? updatedContestData : contest
          )
        );

        alert("Contest updated successfully!");
      }
    } catch (error) {
      console.error("Error updating contest:", error);
      alert("Error updating contest");
    }

    handleClose();
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Battle Ground</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          className={styles.scheduleButton}
        >
          Schedule Contest
        </Button>
      </div>

      <div className={styles.filterContainer}>
        <Grid
          style={{ paddingLeft: "10px" }}
          container
          spacing={2}
          alignItems="center"
        >
          <Grid item xs={5}>
            <TextField
              label="Filter by Status"
              select
              value={filter.status}
              onChange={handleFilterChange}
              name="status"
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="live">Live</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={5}>
            <TextField
              label="Filter by Date"
              type="date"
              value={filter.date}
              onChange={handleFilterChange}
              name="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={1.5}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => setFilter({ status: "", date: "" })}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </div>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Contest Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Add Problems</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContests.map((contest, index) => (
              <TableRow key={contest.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{contest.name}</TableCell>
                <TableCell>{contest.status}</TableCell>
                <TableCell>{contest.date}</TableCell>
                <TableCell>{contest.duration} hr(s)</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleAddProblem(contest.name)}
                    disabled={contest.status !== "upcoming"}
                  >
                    Add Problems
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton
                    disabled={contest.status === "completed"}
                    color="primary"
                    onClick={() => handleEdit(contest)}
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(contest)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Schedule Contest Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? "Edit Contest" : "Schedule Contest"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Contest Name"
            value={newContest.name}
            onChange={(e) =>
              setNewContest({ ...newContest, name: e.target.value })
            }
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Scheduled Date"
            type="datetime-local"
            value={formatDateTimeForInput(newContest.scheduleDate)}
            onChange={(e) =>
              setNewContest({ ...newContest, scheduleDate: e.target.value })
            }
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Duration (in hours)"
            type="number"
            value={newContest.duration}
            onChange={(e) =>
              setNewContest({ ...newContest, duration: e.target.value })
            }
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          {imagePreview && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={editMode ? handleUpdateContest : handleAddContest}>
            {editMode ? "Update Contest" : "Schedule Contest"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddContest;
