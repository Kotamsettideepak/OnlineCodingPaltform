import React from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import temp from "../images/temp.jpg";
import slide1 from "../images/Slide 1.webp";
import slide2 from "../images/Slide 2.png";
import style from "./Home.module.css";

function Home() {
  const images = [
    {
      src: temp,
      label: "First slide label",
      caption: "Some representative placeholder content for the first slide.",
    },
    {
      src: slide1,
      label: "Second slide label",
      caption: "Some representative placeholder content for the second slide.",
    },
    {
      src: slide2,
      label: "Third slide label",
      caption: "Some representative placeholder content for the third slide.",
    },
  ];

  return (
    <div>
      {/* Carousel */}
      <div
        id="carouselExampleCaptions"
        className={`${style.homeCarouselContainer} carousel slide`}
      >
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
        <div className="carousel-inner">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={image.src}
                alt={`Slide ${index + 1}`}
                className={style.carouselImage}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>{image.label}</h5>
                <p>{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <Typography variant="h4" align="center" style={{ margin: "20px 0" }}>
        Explore Our Features
      </Typography>

      {/* Cards Section */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        style={{ marginTop: "30px" }}
      >
        {/* Playground Card */}
        <Grid item xs={12} sm={4}>
          <Card className={style.card}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Play Ground
              </Typography>
              <Typography variant="body2" className={style.cardDescription}>
                Dive into interactive stories with coding challenges embedded in
                each chapter. Discover different plotlines and enhance your
                coding prowess.
              </Typography>
              <Button variant="contained" className={style.cardButton}>
                Visit <ArrowForward />
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Arena Card */}
        <Grid item xs={12} sm={4}>
          <Card className={style.card}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Arena
              </Typography>
              <Typography variant="body2" className={style.cardDescription}>
                Train in specific coding topics by selecting from a wide array
                of tags.
              </Typography>
              <Button variant="contained" className={style.cardButton}>
                Visit <ArrowForward />
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* BattleGround Card */}
        <Grid item xs={12} sm={4}>
          <Card className={style.card}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                BattleGround
              </Typography>
              <Typography variant="body2" className={style.cardDescription}>
                Test your skills in live coding contests! Compete against others
                in real-time.
              </Typography>
              <Button variant="contained" className={style.cardButton}>
                Visit <ArrowForward />
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
