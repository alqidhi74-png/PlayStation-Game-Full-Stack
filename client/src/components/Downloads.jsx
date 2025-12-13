import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Spinner,
  Button,
} from "reactstrap";
import { getDownloadedGames, deleteDownloadedGame } from "../features/PlaySlice";
import { MdDelete } from "react-icons/md";
import "../styles/Downloads.css";

const Downloads = () => {
  const dispatch = useDispatch();

  const savedUser = JSON.parse(localStorage.getItem("user"));
  const currentUsername = savedUser?.username;

  const { downloaded, isLoading, isError, message } = useSelector(
    (state) => state.playstation
  );

  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  useEffect(() => {
    if (currentUsername) {
      dispatch(getDownloadedGames(currentUsername));
    }
  }, [dispatch, currentUsername]);

  const handleDelete = (gameId) => {
    if (
      window.confirm("Are you sure you want to remove this game from your downloads?")
    ) {
      dispatch(deleteDownloadedGame({ username: currentUsername, gameId }));
    }
  };

  if (isLoading)
    return (
      <div className={`${isDark ? "downloads-page-dark" : "downloads-page-light"} downloads-loading-container`}>
        <div className="downloads-loading-content">
          <Spinner className="downloads-spinner" />
          <h3 className="downloads-loading-text">
            Loading downloads... ⬇️
          </h3>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className={`${isDark ? "downloads-page-dark" : "downloads-page-light"} downloads-error-container`}>
        <div className="downloads-error-content">
          <h4 className="downloads-error-title">
            ⚠️ Error
          </h4>
          <p className="downloads-error-text">{message}</p>
        </div>
      </div>
    );

  return (
    <div className={isDark ? "downloads-page-dark" : "downloads-page-light"}>
      <Container>
        <div className="downloads-header">
          <h1 className="downloads-title">
            My Downloads
          </h1>
          <p className="downloads-subtitle">
            Your downloaded games collection
          </p>
        </div>

        {downloaded.length === 0 && (
          <div className="downloads-empty-state">
            <h4 className="downloads-empty-title">
              📭 No downloads yet
            </h4>
            <p className="downloads-empty-text">
              Start downloading games from the home page!
            </p>
          </div>
        )}

        {downloaded.length > 0 && (
          <div className="downloads-games-row">
            {downloaded.map((game) => (
              <Card className="downloads-card fade-in" key={game._id}>
                {game.gamePicture && game.gamePicture.trim() !== "" ? (
                  <CardImg
                    top
                    width="100%"
                    src={game.gamePicture}
                    alt={game.title}
                    className="downloads-card-image"
                  />
                ) : (
                  <div className="downloads-card-image-placeholder">
                    🎮 No Image
                  </div>
                )}

                <CardBody className="downloads-card-body">
                  <CardTitle tag="h5" className="downloads-card-title">
                    {game.title}
                  </CardTitle>

                  <CardText className="downloads-card-text">
                    <strong>Game Code:</strong> {game.gameCode}
                  </CardText>
                  <CardText className="downloads-card-text">
                    <strong>Release Year:</strong> {game.releaseYear}
                  </CardText>
                  {game.description && (
                    <CardText className="downloads-card-description">
                      <strong>Description:</strong> {game.description}
                    </CardText>
                  )}
                  <div className="downloads-card-footer">
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(game._id)}
                      className="downloads-delete-btn"
                    >
                      <MdDelete className="downloads-delete-icon" />
                      Remove
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Downloads;
