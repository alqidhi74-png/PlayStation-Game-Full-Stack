import React from "react";
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  Button,
  Alert,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddPlaystationSchema } from "../validations/AddPlaystation";
import { useSelector, useDispatch } from "react-redux";
import { addPlaystation, getPlaystations } from "../features/PlaySlice";
import "../styles/AddPlaystation.css";

const AddPlaystation = () => {
  const [gameCode, setGameCode] = useState("");
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [gamePicture, setGamePicture] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const message = useSelector((state) => state.playstation.message);
  const isError = useSelector((state) => state.playstation.isError);
  const isSuccess = useSelector((state) => state.playstation.isSuccess);
  const isLoading = useSelector((state) => state.playstation.isLoading);
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddPlaystationSchema),
  });

  const validate = async () => {
    const data = {
      username: user.username,
      gameCode: Number(gameCode),
      title: title.trim(),
      releaseYear: Number(releaseYear),
      gamePicture: gamePicture.trim(),
      description: description.trim(),
    };

    const result = await dispatch(addPlaystation(data));
    if (result.payload?.message === "Game saved successfully") {
      setGameCode("");
      setTitle("");
      setReleaseYear("");
      setGamePicture("");
      setDescription("");
      dispatch(getPlaystations());
    }
  };

  return (
    <div className={isDark ? "add-playstation-page-dark" : "add-playstation-page-light"}>
      <Container>
        <Row className="justify-content-center">
          <Col xs="12" sm="10" md="8" lg="7" xl="6">
            <div className="add-playstation-card">
              <h2 className="text-center mb-4 add-playstation-title">Add PlayStation Game</h2>

              <form onSubmit={submitForm(validate)}>
                <FormGroup>
                  <input
                    type="text"
                    placeholder="Game Code"
                    className="form-control add-playstation-input"
                    {...register("gameCode", {
                      onChange: (e) => setGameCode(e.target.value),
                    })}
                  />
                  <p className="add-playstation-error">{errors.gameCode?.message}</p>
                </FormGroup>

                <FormGroup>
                  <input
                    type="text"
                    placeholder="Title"
                    className="form-control add-playstation-input"
                    {...register("title", {
                      onChange: (e) => setTitle(e.target.value),
                    })}
                  />
                  <p className="add-playstation-error">{errors.title?.message}</p>
                </FormGroup>

                <FormGroup>
                  <input
                    type="text"
                    placeholder="Release Year (e.g. 2024)"
                    className="form-control add-playstation-input"
                    {...register("releaseYear", {
                      onChange: (e) => setReleaseYear(e.target.value),
                    })}
                  />
                  <p className="add-playstation-error">{errors.releaseYear?.message}</p>
                </FormGroup>

                <FormGroup>
                  <input
                    type="text"
                    placeholder="Game Picture URL (optional)"
                    className="form-control add-playstation-input"
                    {...register("gamePicture", {
                      onChange: (e) => setGamePicture(e.target.value),
                    })}
                  />
                  <small className="text-muted">
                    Leave blank to use the default cover.
                  </small>
                  <p className="add-playstation-error">{errors.gamePicture?.message}</p>
                </FormGroup>

                <FormGroup>
                  <textarea
                    placeholder="Description"
                    className="form-control add-playstation-textarea"
                    rows="4"
                    {...register("description", {
                      onChange: (e) => setDescription(e.target.value),
                    })}
                  />
                  <p className="add-playstation-error">{errors.description?.message}</p>
                </FormGroup>

                <Button
                  type="submit"
                  className="form-control add-playstation-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Game"}
                </Button>

                {message && (
                  <Alert
                    color={isError ? "danger" : isSuccess ? "success" : "secondary"}
                    className="add-playstation-alert"
                  >
                    {message}
                  </Alert>
                )}
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddPlaystation;
