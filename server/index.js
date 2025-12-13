import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserModel from "./models/User.js";
import PlayStation from "./models/PlayStation.js";
import bcrypt from "bcryptjs";
import Download from "./models/Download.js";

const app = express();
app.use(cors());
app.use(express.json());

try {
  const conStr =
    "mongodb+srv://admin:1234@cluster0.6gkyrpp.mongodb.net/PlayStation?appName=Cluster0";
  mongoose.connect(conStr);
  console.log("Database Connected..");
} catch (error) {
  console.log("Database connection error.." + error);
}

app.listen(5000, () => {
  console.log("Server is working");
});

app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find(
      {},
      {
        password: 0,
        _id: 0,
        __v: 0,
      }
    );

    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const pwd_match = await bcrypt.compare(req.body.password, user.password);
      if (pwd_match) res.status(200).json({ user: user, message: "Success" });
      else res.status(200).json({ message: "Invalid Credentials.." });
    } else {
      res.status(500).json({ message: "User not found..." });
    }
  } catch (error) {
    res.send(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password, gender, dateOfBirth, age } = req.body;

    // Validate required fields
    if (!dateOfBirth) {
      return res.status(400).json({ message: "Date of Birth is required" });
    }

    const hash_password = await bcrypt.hash(password, 10);
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      // Calculate age from dateOfBirth
      const today = new Date();
      const birth = new Date(dateOfBirth);
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        calculatedAge--;
      }

      // Use provided age if valid, otherwise use calculated age
      const finalAge = age && age > 0 ? age : calculatedAge;

      // Save dateOfBirth as string (YYYY-MM-DD format) without time
      const dateString = dateOfBirth.split("T")[0]; // Extract date part only (YYYY-MM-DD)

      const new_user = new UserModel({
        username: username,
        email: email,
        password: hash_password,
        gender: gender,
        dateOfBirth: dateString,
        age: finalAge,
      });
      await new_user.save();
      res.status(200).json({ message: "Success" });
    } else {
      res.status(500).json({ message: "User already exists..." });
    }
  } catch (error) {
    console.log("Registration error:", error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
});

// Route for adding a new game
app.post("/saveGame", async (req, res) => {
  try {
    let { username, gameCode, title, releaseYear, gamePicture, description } =
      req.body;

    // Validate required fields
    if (!username || !gameCode || !title || !releaseYear) {
      return res.status(400).json({
        message: "Username, game code, title, and release year are required",
      });
    }

    username = username.trim();
    title = title.trim();
    description = description?.trim() || "";
    gamePicture = gamePicture?.trim() || "";

    const existingGame = await PlayStation.findOne({ gameCode });
    if (existingGame) {
      return res.status(400).json({
        message: "Game code already exists. Please use a unique game code.",
      });
    }

    // Create game object (default values will be applied by schema if fields are empty)
    const gameData = {
      username,
      gameCode: Number(gameCode),
      title,
      releaseYear: Number(releaseYear),
    };

    // Only add optional fields if they have values
    if (gamePicture) {
      gameData.gamePicture = gamePicture;
    }
    if (description) {
      gameData.description = description;
    }

    const newGame = new PlayStation(gameData);
    await newGame.save();
    res.status(201).json({ message: "Game saved successfully", data: newGame });
  } catch (error) {
    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Game code already exists. Please use a unique game code.",
      });
    }
    res
      .status(500)
      .json({ message: "Saving game failed", error: error.message });
  }
});

//
app.get("/showGame", async (req, res) => {
  try {
    const gamesWithUser = await PlayStation.aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "username",
          foreignField: "username",
          as: "user",
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          "user._id": 0,
          "user.password": 0,
          "user.isAdmin": 0,
          "user.profilePicture": 0,
          "user.dateOfBirth": 0,
          "user.gender": 0,
        },
      },
    ]);
    res.status(200).json({ data: gamesWithUser });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching games",
      error: error.message,
    });
  }
});

// Route for updating
app.put("/updateGame", async (req, res) => {
  try {
    let { _id, gameCode, title, releaseYear, gamePicture, description } =
      req.body;
    const game = await PlayStation.findById(_id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    game.gameCode = gameCode;
    game.title = title;
    game.releaseYear = releaseYear;
    game.gamePicture = gamePicture;
    game.description = description;
    await game.save();
    res.status(200).json({ message: "Game updated successfully", data: game });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Updating game failed", error: error.message });
  }
});

// Route for deleting
app.delete("/deleteGame/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedGame = await PlayStation.findOneAndDelete({ _id: id });
    if (!deletedGame) {
      return res
        .status(404)
        .json({ message: "Game not found, nothing was deleted" });
    }
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Deleting game failed", error: error.message });
  }
});

app.put("/updateProfile", async (req, res) => {
  try {
    const { email, username, dateOfBirth, gender, profilePicture } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    const birth = new Date(dateOfBirth);
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      calculatedAge--;
    }

    const dateString = dateOfBirth.split("T")[0];

    // If username changed, update all downloads with the new username
    if (user.username !== username) {
      await Download.updateMany(
        { username: user.username },
        { $set: { username: username } }
      );
    }

    user.username = username;
    user.gender = gender;
    user.dateOfBirth = dateString;
    user.age = calculatedAge;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/downloadGame", async (req, res) => {
  try {
    const { username, gameId } = req.body;

    const existing = await Download.findOne({ username, gameId });
    if (existing)
      return res.status(400).json({ message: "Already downloaded" });

    const download = new Download({ username, gameId });
    await download.save();

    res.status(201).json({ message: "Game downloaded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading game", error: error.message });
  }
});

// Get all downloaded games for a user
app.get("/downloads/:username", async (req, res) => {
  try {
    const username = req.params.username;

    // Find downloads by username
    const downloads = await Download.find({ username }).populate("gameId");

    // Map the data to include game details
    const downloadedGames = downloads.map((d) => ({
      _id: d.gameId._id,
      title: d.gameId.title,
      gameCode: d.gameId.gameCode,
      releaseYear: d.gameId.releaseYear,
      description: d.gameId.description,
      gamePicture: d.gameId.gamePicture,
      username: d.gameId.username,
      downloadedAt: d.downloadedAt,
    }));

    res.status(200).json(downloadedGames);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch downloaded games",
        error: error.message,
      });
  }
});

// Delete a downloaded game
app.delete("/deleteDownload/:username/:gameId", async (req, res) => {
  try {
    const { username, gameId } = req.params;

    const deletedDownload = await Download.findOneAndDelete({
      username,
      gameId,
    });

    if (!deletedDownload) {
      return res
        .status(404)
        .json({ message: "Download not found, nothing was deleted" });
    }

    res.status(200).json({ message: "Download deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Deleting download failed", error: error.message });
  }
});