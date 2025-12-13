import mongoose from "mongoose";

const DownloadSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlayStations",
      required: true,
    },
    downloadedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Download = mongoose.model("Downloads", DownloadSchema, "Downloads");
export default Download;
