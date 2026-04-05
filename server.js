import express from "express";
import { exec } from "child_process";
import fs from "fs";

const app = express();

const HLS_DIR = "./hls";

// створюємо папку якщо нема
if (!fs.existsSync(HLS_DIR)) {
  fs.mkdirSync(HLS_DIR);
}

// 🔥 тут твій стрім
const STREAM_URL = "http://livego.club:8080/live/.../281096.ts";

// запускаємо ffmpeg
exec(`ffmpeg -i "${STREAM_URL}" -c copy -f hls -hls_time 2 -hls_list_size 6 -hls_flags delete_segments ${HLS_DIR}/index.m3u8`);

app.use("/hls", express.static(HLS_DIR));

app.get("/", (req, res) => {
  res.send("HLS працює 😏");
});

app.listen(3000, () => {
  console.log("Server started");
});
