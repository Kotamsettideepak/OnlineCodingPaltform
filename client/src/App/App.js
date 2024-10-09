import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import Home from "../Home/Home";
import Arena from "../Arena/Arena";
import PlayGround from "../Playground/PlayGround";
import BattleGround from "../BattleGround/BattleGround";
import style from "./App.module.css";
import ProblemSheet from "../ProblemSheet/ProblemSheet";
import ProblemPage from "../Problems/ProblemPage";
function App() {
  return (
    <Router>
      <div className={style.container}>
        <div className={style.navbar}>
          <Navbar />
        </div>
        <div className={style.pageContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/playground" element={<PlayGround />} />
            <Route path="/battleground" element={<BattleGround />} />
            <Route path="/ProblemSheet" element={<ProblemSheet />} />
            <Route path="/problem-page" element={<ProblemPage />} />
          </Routes>
        </div>
      </div>
      {/* <Editor /> */}
    </Router>
  );
}

export default App;
