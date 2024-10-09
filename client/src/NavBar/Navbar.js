import React from "react";
import { Link, useLocation } from "react-router-dom";
import style from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={style.navbar}>
      <h1
        onClick={() => {
          navigate("/");
        }}
        className={style.title}
      >
        Code Hunters
      </h1>
      <div className={style.links}>
        <Link
          to="/arena"
          className={`${style.link} ${
            location.pathname === "/arena" ? style.activeLink : ""
          }`}
        >
          Arena
        </Link>
        <Link
          to="/playground"
          className={`${style.link} ${
            location.pathname === "/playground" ? style.activeLink : ""
          }`}
        >
          PlayGround
        </Link>
        <Link
          to="/battleground"
          className={`${style.link} ${
            location.pathname === "/battleground" ? style.activeLink : ""
          }`}
        >
          BattleGround
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
