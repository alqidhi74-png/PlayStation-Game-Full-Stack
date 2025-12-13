import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardImg,
  Spinner,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPlaystations, downloadGame } from "../features/PlaySlice";
import { RxDownload } from "react-icons/rx";
import { jsPDF } from "jspdf";
import "../styles/Home.css";

const Home = () => {
  const dispatch = useDispatch();

  const { playstation = [], isLoading } = useSelector(
    (state) => state.playstation
  );

  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");

  const savedUser = JSON.parse(localStorage.getItem("user"));
  const currentUsername = savedUser?.username;

  useEffect(() => {
    dispatch(getPlaystations());
  }, [dispatch]);

  // Expose search handler to window for Header component
  useEffect(() => {
    window.handleSearchChange = (value) => {
      setSearch(value);
    };
    return () => {
      delete window.handleSearchChange;
    };
  }, []);

  const handleDownload = (game) => {
    if (!currentUsername) return alert("User not logged in");

    dispatch(downloadGame({ username: currentUsername, gameId: game._id }));

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Game Information", 20, 20);
    doc.setFontSize(12);
    doc.text(`Title: ${game.title}`, 20, 40);
    doc.text(`Game Code: ${game.gameCode}`, 20, 50);
    doc.text(`Release Year: ${game.releaseYear}`, 20, 60);
    doc.text(`Description: ${game.description || "N/A"}`, 20, 70);
    doc.text(`Added By: ${game.username}`, 20, 80);
    doc.save(`${game.title}_info.pdf`);
  };

  const filteredPlaystation = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return playstation;

    return playstation.filter((game) => {
      const title = (game?.title || "").toLowerCase();
      const code = String(game?.gameCode ?? "").toLowerCase();
      return title.startsWith(q) || code.startsWith(q);
    });
  }, [search, playstation]);

  if (isLoading) {
    return (
      <div className={`${isDark ? "home-page-dark" : "home-page-light"} home-loading-container`}>
        <div className="home-loading-content">
          <Spinner className="home-spinner" />
          <h3 className="home-loading-text">
            Loading games... 🎮
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? "home-page-dark" : "home-page-light"}>
      {/* 🎮 Games Container */}
      <div className="home-games-container">
        {filteredPlaystation.length === 0 && (
          <div className="home-empty-state">
            <h4 className="home-empty-title">
              {search ? "🔍 No games found" : "📭 No games available"}
            </h4>
            <p className="home-empty-text">
              {search
                ? "Try searching with different keywords"
                : "Check back later for new games"}
            </p>
          </div>
        )}

        {filteredPlaystation.length > 0 && (
          <div className="home-games-row">
            {filteredPlaystation.map((game, index) => (
              <Card className="game-card-home fade-in" key={game._id}>
                {/* Image */}
                <div className="game-card-image-container">
                  {game.gamePicture ? (
                    <CardImg
                      top
                      src={game.gamePicture}
                      alt={game.title}
                      className="game-card-image"
                    />
                  ) : (
                    <div className="game-card-image-placeholder">
                      🎮 No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardBody className="game-card-body">
                  <CardTitle tag="h4" className="game-card-title">
                    {game.title}
                  </CardTitle>

                  <div className="game-card-info">
                    <span>
                      <strong>Code:</strong> {game.gameCode}
                    </span>
                    <span>
                      <strong>Year:</strong> {game.releaseYear}
                    </span>
                  </div>

                  {game.description && (
                    <div className="game-card-description">
                      {game.description}
                    </div>
                  )}

                  <div className="game-card-author">
                    Added by <strong>{game.username}</strong>
                  </div>

                  {/* Download Button */}
                  <div
                    onClick={() => handleDownload(game)}
                    className="game-card-download-btn"
                  >
                    <RxDownload size={18} />
                    <span>Download Info</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
