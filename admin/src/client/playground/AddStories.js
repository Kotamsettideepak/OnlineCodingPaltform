import React, { useEffect, useState } from "react";
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import {
  Visibility,
  Add,
  Edit,
  Delete,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import styles from "./AddStories.module.css";
import { useNavigate } from "react-router-dom";

function AddStories() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For viewing image
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false); // For preview
  const [openAddDialog, setOpenAddDialog] = useState(false); // For adding story
  const [openEditDialog, setOpenEditDialog] = useState(false); // For editing story
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [newStoryImage, setNewStoryImage] = useState(null);
  const [editStory, setEditStory] = useState(null); // Story to be edited
  const [updatedStoryTitle, setUpdatedStoryTitle] = useState(""); // Updated title
  const [updatedStoryImage, setUpdatedStoryImage] = useState(null); // Updated image

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:5000/playground/getCard");
        setStories(res.data.data);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    }

    fetchData();
  }, []);

  // Handle viewing the image
  const handleViewImage = (imageFile) => {
    setSelectedImage(`http://localhost:5000/images/${imageFile}`);
    setOpenImageDialog(true);
  };

  // Handle adding a problem
  const handleAddProblem = (id, region, subregion) => {
    console.log("Add Problem for story with id: ", id, region, subregion);
    navigate("/add-problem", {
      state: {
        region,
        subregion,
      },
    });
  };

  // Handle preview of the story
  const handlePreview = (story) => {
    setSelectedStory(story);
    setOpenPreviewDialog(true);
  };

  // Handle add story
  const handleAddStory = async () => {
    console.log(newStoryTitle, newStoryImage);

    const formData = new FormData();
    formData.append("region", "playground");
    formData.append("cardTitle", newStoryTitle);
    if (newStoryImage) {
      formData.append("cardImageFile", newStoryImage);
    }

    try {
      await axios.post("http://localhost:5000/playground/addCard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStories((prevStories) => [
        ...prevStories,
        {
          cardTitle: newStoryTitle,
          cardImageFile: newStoryImage ? newStoryImage.name : "",
        },
      ]);
      setOpenAddDialog(false);
      setNewStoryTitle("");
      setNewStoryImage(null);
      alert("Story Added");
    } catch (error) {
      alert("Story Not Added");
    }
  };

  // Handle edit story
  const handleEditStory = (story) => {
    setEditStory(story);
    setUpdatedStoryTitle(story.cardTitle);
    setOpenEditDialog(true);
  };

  const handleSaveChanges = async () => {
    if (!editStory) return; // Ensure there's a story to edit

    try {
      const formData = new FormData();
      formData.append("OldStoryTitle", editStory.cardTitle);
      formData.append("UpdatedStoryTitle", updatedStoryTitle);
      formData.append("PreviousStoryImage", editStory.cardImageFile);
      formData.append("region", "playground");
      if (updatedStoryImage) {
        formData.append("UpdatedStoryImage", updatedStoryImage);
      }

      await axios.post(
        `http://localhost:5000/playground/updateCard/${editStory._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the stories state after a successful update
      setStories((prevStories) =>
        prevStories.map((story) =>
          story._id === editStory._id
            ? {
                ...story,
                cardTitle: updatedStoryTitle,
                cardImageFile: updatedStoryImage
                  ? updatedStoryImage.name
                  : story.cardImageFile, // Use new image name if it exists, otherwise keep the old one
              }
            : story
        )
      );

      alert("Story updated successfully");
      setOpenEditDialog(false);
      setEditStory(null); // Clear the edit story state after saving
    } catch (error) {
      alert("Failed to update story");
      console.error("Error updating story:", error);
    }
  };

  // Handle delete story
  const handleDeleteStory = async (story) => {
    console.log(story);

    if (window.confirm(`Delete ${story.cardTitle}`)) {
      try {
        // Send the DELETE request with params
        await axios.delete(`http://localhost:5000/playground/deleteCard`, {
          data: { id: story._id, Image_name: story.cardImageFile },
        });
        setStories((prevCards) =>
          prevCards.filter((card) => card._id !== story._id)
        );
      } catch (error) {
        console.error("Error deleting the card:", error);
      }
    } else {
      return;
    }
  };

  return (
    <div className={styles.container}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Stories Page
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
          >
            Add Story
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table aria-label="stories table">
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Story Title</TableCell>
              <TableCell>Story Image</TableCell>
              <TableCell>Add Problem</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Preview</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stories.length > 0 ? (
              stories.map((story, index) => (
                <TableRow key={story._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{story.cardTitle}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewImage(story.cardImageFile)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Add />}
                      onClick={() =>
                        handleAddProblem(
                          story._id,
                          story.region,
                          story.cardTitle
                        )
                      }
                    >
                      Add Problem
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditStory(story)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteStory(story)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handlePreview(story)}
                    >
                      <PreviewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>No stories available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Viewing Image */}
      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Story Image</DialogTitle>
        <DialogContent>
          <Typography>Here is the image of the selected story.</Typography>
          {selectedImage && (
            <img src={selectedImage} alt="Story" width="100%" />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Preview */}
      <Dialog
        open={openPreviewDialog}
        onClose={() => setOpenPreviewDialog(false)}
      >
        <DialogTitle>Preview Story</DialogTitle>
        <DialogContent>
          {selectedStory && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card style={{ display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`http://localhost:5000/images/${selectedStory.cardImageFile}`}
                    alt={selectedStory.cardTitle}
                  />
                  <CardContent
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">
                      {selectedStory.cardTitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Story Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Story</DialogTitle>
        <DialogContent>
          <TextField
            label="Story Title"
            value={newStoryTitle}
            onChange={(e) => setNewStoryTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewStoryImage(e.target.files[0])}
            style={{ marginTop: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddStory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Story Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Story</DialogTitle>
        <DialogContent>
          <TextField
            label="Updated Story Title"
            value={updatedStoryTitle}
            onChange={(e) => setUpdatedStoryTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUpdatedStoryImage(e.target.files[0])}
            style={{ marginTop: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddStories;
