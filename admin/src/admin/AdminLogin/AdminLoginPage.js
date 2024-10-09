import React, { useState } from "react";
import { TextField, Button, Paper, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AdminLoginPage.module.css";

function AdminLoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(credentials);

    axios
      .post("http://localhost:5000/admin/authentication", credentials)
      .then((res) => {
        console.log(res);
        // Mark user as authenticated
        onLogin();
        // Redirect to AdminPanel
        navigate("/admin-panel");
      })
      .catch((error) => {
        console.error(error.response ? error.response.data : error.message);
        // Handle error, e.g., show an error message to the user
      });
  };

  return (
    <Paper className={styles.root}>
      <Paper className={styles.paper} elevation={6}>
        <Typography variant="h5" component="h1" className={styles.typography}>
          Admin Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          className={styles.form}
        >
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            className={styles.inputField}
            value={credentials.email}
            onChange={handleChange}
          />
          <TextField
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            className={styles.inputField}
            value={credentials.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={styles.button}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Paper>
  );
}

export default AdminLoginPage;
