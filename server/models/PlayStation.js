import mongoose from "mongoose";

const PlayStationSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    gameCode: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    gamePicture: {
      type: String,
      default: "http://localhost:5000/assets/defaultGame.png",
    },
    description: { type: String, default: "No description available" },
    comments: [
      {
        username: { type: String },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const PlayStation = mongoose.model("PlayStations", PlayStationSchema, "PlayStations");
export default PlayStation;
