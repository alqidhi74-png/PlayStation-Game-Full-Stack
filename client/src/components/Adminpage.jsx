import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPlaystations, updatePlaystation, deletePlaystation } from "../features/PlaySlice";
import { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardText,
    CardTitle,
    Container,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import "../styles/Adminpage.css";

const Adminpage = () => {
    const dispatch = useDispatch();
    const playstations = useSelector((state) => state.playstation.playstation);
    const isSuccess = useSelector((state) => state.playstation.isSuccess);
    const theme = useSelector((state) => state.theme.mode);
    const isDark = theme === "dark";
    const [modal, setModal] = useState(false);
    const [gameTitle, setGameTitle] = useState("");
    const [gameCode, setGameCode] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [gamePicture, setGamePicture] = useState("");
    const [description, setDescription] = useState("");
    const [gameID, setGameID] = useState("");

    const toggle = (game) => {
        setModal(!modal);
        if (game) {
            setGameTitle(game.title);
            setGameCode(game.gameCode);
            setReleaseYear(game.releaseYear);
            setGamePicture(game.gamePicture || "");
            setDescription(game.description || "");
            setGameID(game._id);
        } else {
            setGameTitle("");
            setGameCode("");
            setReleaseYear("");
            setGamePicture("");
            setDescription("");
            setGameID("");
        }
    };

    const handleUpdate = async () => {
        const data = {
            _id: gameID,
            gameCode: Number(gameCode),
            title: gameTitle.trim(),
            releaseYear: Number(releaseYear),
            gamePicture: gamePicture.trim(),
            description: description.trim(),
        };
        await dispatch(updatePlaystation(data));
        toggle();
    };

    const handleDelete = (gameId) => {
        if (window.confirm("Are you sure to delete this game?") === true) {
            dispatch(deletePlaystation(gameId));
            dispatch(getPlaystations());
        }
    };

    useEffect(() => {
        dispatch(getPlaystations());
    }, [dispatch]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(getPlaystations());
        }
    }, [isSuccess, dispatch]);

    return (
        <div className={isDark ? "admin-page-dark" : "admin-page-light"}>
            <Container>
                <div className="admin-header">
                    <h1 className="admin-title">
                        🎮 Admin Dashboard
                    </h1>
                    <p className="admin-subtitle">
                        Manage your game library
                    </p>
                </div>

                {playstations.length === 0 && (
                    <div className="admin-empty-state">
                        <h4 className="admin-empty-title">
                            📭 No games available
                        </h4>
                        <p className="admin-empty-text">
                            Add your first game to get started
                        </p>
                    </div>
                )}

                {playstations.length > 0 && (
                    <div className="admin-games-row">
                        {playstations.map((game) => {
                            return (
                                <Card className="admin-card fade-in" key={game._id}>
                                    <CardHeader className="admin-card-image">
                                        {game.gamePicture && game.gamePicture.trim() !== "" ? (
                                            <img
                                                src={game.gamePicture}
                                                alt={game.title}
                                                className="img-fluid"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    const placeholder = e.target.parentElement.querySelector('.admin-card-image-placeholder');
                                                    if (placeholder) placeholder.style.display = "flex";
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="admin-card-image-placeholder"
                                            style={{
                                                display: (!game.gamePicture || game.gamePicture.trim() === "") ? "flex" : "none",
                                            }}
                                        >
                                            🎮 No Image
                                        </div>
                                    </CardHeader>
                                    <CardBody className="admin-card-body">
                                        <CardTitle tag="h5" className="admin-card-title">
                                            {game.title}
                                        </CardTitle>
                                        <CardText className="admin-card-text">
                                            <strong>Game Code:</strong> {game.gameCode}
                                        </CardText>
                                        <CardText className="admin-card-text">
                                            <strong>Release Year:</strong> {game.releaseYear}
                                        </CardText>
                                        {game.description && (
                                            <CardText className="admin-card-text">
                                                <strong>Description:</strong> {game.description.length > 50 
                                                    ? `${game.description.substring(0, 50)}...` 
                                                    : game.description}
                                            </CardText>
                                        )}
                                        {game.user && game.user.length > 0 && (
                                            <CardText>
                                                <small style={{ color: isDark ? "#94a3b8" : "#6b7280", fontSize: "0.8rem" }}>
                                                    Added by: <strong style={{ color: "#667eea" }}>{game.user[0].username}</strong>
                                                </small>
                                            </CardText>
                                        )}
                                    </CardBody>
                                    <CardFooter className="admin-card-footer">
                                        <BiEdit
                                            onClick={() => toggle(game)}
                                            className="admin-icon-btn admin-icon-edit"
                                        />
                                        <MdDelete
                                            onClick={() => handleDelete(game._id)}
                                            className="admin-icon-btn admin-icon-delete"
                                        />
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}

                <Modal
                    isOpen={modal}
                    toggle={toggle}
                    className="admin-modal"
                >
                    <ModalHeader toggle={toggle} className="admin-modal-header">
                        ✏️ Update Game
                    </ModalHeader>
                    <ModalBody className="admin-modal-body">
                        <Input
                            type="text"
                            placeholder="Game Code"
                            value={gameCode}
                            onChange={(e) => setGameCode(e.target.value)}
                            className="admin-modal-input"
                        />
                        <Input
                            type="text"
                            placeholder="Title"
                            value={gameTitle}
                            onChange={(e) => setGameTitle(e.target.value)}
                            className="admin-modal-input"
                        />
                        <Input
                            type="text"
                            placeholder="Release Year"
                            value={releaseYear}
                            onChange={(e) => setReleaseYear(e.target.value)}
                            className="admin-modal-input"
                        />
                        <Input
                            type="text"
                            placeholder="Game Picture URL"
                            value={gamePicture}
                            onChange={(e) => setGamePicture(e.target.value)}
                            className="admin-modal-input"
                        />
                        <Input
                            type="textarea"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="admin-modal-input"
                        />
                    </ModalBody>
                    <ModalFooter className="admin-modal-footer">
                        <Button
                            color="primary"
                            onClick={() => {
                                if (!gameTitle || !gameCode || !releaseYear) {
                                    alert("Title, Game Code, and Release Year are required");
                                } else {
                                    handleUpdate();
                                }
                            }}
                            className="admin-modal-btn-update"
                        >
                            ✅ UPDATE
                        </Button>{" "}
                        <Button
                            color="secondary"
                            onClick={toggle}
                            className="admin-modal-btn-cancel"
                        >
                            ❌ CANCEL
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    );
};

export default Adminpage;
