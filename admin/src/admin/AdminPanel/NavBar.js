import React from "react";
import styles from "./NavBar.module.css";
import { Link } from "react-router-dom";
import logo from "../../Images/Logo.webp";

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} />
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/arena">Arena</Link>
        </li>
        <li>
          <Link to="/playground">Play Ground</Link>
        </li>
        <li>
          <Link to="/battleground">Battleground</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
