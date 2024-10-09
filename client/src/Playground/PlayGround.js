import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import style from "./PlayGround.module.css";
import axios from "axios";

function Playground() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  const fetchCards = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/playground/getCard"
      );
      setCards(response.data.data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleExploreClick = (cardTitle) => {
    navigate("/ProblemSheet", {
      state: { region: "playground", subregion: cardTitle }, // Changed 'cardTitle' to 'subregion'
    });
  };

  return (
    <div className={style.Playground}>
      <div className={style.title}>
        <Typography variant="h4" align="center" className={style.titleText}>
          PlayGround
        </Typography>
      </div>
      <div className={style.body}>
        <Grid container spacing={2} style={{ marginTop: "20px" }}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={card._id}>
              <Card style={{ display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://localhost:5000/images/${card.cardImageFile}`}
                  alt={card.cardTitle}
                />
                <CardContent
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className={style.cardTitle}>{card.cardTitle}</span>
                  <Button
                    style={{ backgroundColor: "green", color: "white" }}
                    onClick={() => handleExploreClick(card.cardTitle)}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export default Playground;
