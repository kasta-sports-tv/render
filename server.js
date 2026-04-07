import express from "express";
import { spawn } from "child_process";
import fs from "fs";

const app = express();

const HLS_DIR = "./hls";

if (!fs.existsSync(HLS_DIR)) {
  fs.mkdirSync(HLS_DIR);
}

// ⚠️ ВСТАВ СВІЙ ПОВНИЙ TS ЛІНК ТУТ
const STREAM_URL = "http://livego.club:8080/live/a8j97B13rd07/fuJAMz85AJaB/281097.ts";

// 👇 запускаємо ffmpeg (вбудований в систему Render)
const ffmpeg = spawn("ffmpeg", [
  "-i", STREAM_URL,
  "-c", "copy",
  "-f", "hls",
  "-hls_time", "2",
  "-hls_list_size", "6",
  "-hls_flags", "delete_segments",
  `${HLS_DIR}/index.m3u8`
]);

ffmpeg.stderr.on("data", (data) => {
  console.log("FFmpeg:", data.toString());
});

ffmpeg.on("close", (code) => {
  console.log("FFmpeg stopped:", code);
});

app.use("/hls", express.static(HLS_DIR));

app.listen(3000, () => {
  console.log("Server started");
});
