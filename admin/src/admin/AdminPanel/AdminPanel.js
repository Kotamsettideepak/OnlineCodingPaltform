import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./NavBar.js";
import styles from "./AdminPanel.module.css";

import AddStories from "../../client/playground/AddStories.js";
import AddContest from "../../client/battleground/AddContest.js";
import AddAdmins from "../Admins/Admins.js";
import Users from "../../Users/Users.js";
import AddProblems from "../../AddProblems/AddProblems.js";
import Preview from "../../AddProblems/PreviewPage.js";
import AddArenaProblem from "../../client/arena/AddArenaProblem.js";
import DashBoard from "../AdminDashboard/AdminDashBoard.js";
const AdminPanel = () => {
  return (
    <div className={styles.adminPanel}>
      <div className={styles.NavBar}>
        <NavBar />
      </div>

      <div className={styles.pageContent}>
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/arena" element={<AddArenaProblem />} />
          <Route path="/add-problem" element={<AddProblems />} />
          <Route path="/playground" element={<AddStories />} />
          <Route path="/battleground" element={<AddContest />} />
          <Route path="/add-admins" element={<AddAdmins />} />
          <Route path="/users" element={<Users />} />
          <Route path="/preview" element={<Preview />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
