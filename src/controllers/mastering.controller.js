import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as masteringMusic from "../services/mastering.service.mjs";
import path from "path";

// TAKING WAV FILES
export default async (req, res) => {
  const file = req.file;
  const username = req.body.username;
  const folderName = "mastered/" + username;

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }

  console.log(folderName);
  const outputPath = folderName + "/" + file.originalname;
  try {
    if (file) {
      const response = await masteringMusic.main(req.file.path, outputPath);
      return res.json({ message: "Audio masterisé", data: response });
    }
  } catch (error) {
    return error;
  }
};

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const absolutePath = join(dirname(currentFilePath), "../..");

const getFileName = (username) => {
  return new Promise((resolve, reject) => {
    const folderPath = path.join("mastered", username);
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error("Error while reading mastered folder:", err);
        reject(err);
        return;
      }
      if (files.length === 0) {
        console.error("No files found in the mastered folder.");
        reject(new Error("No files found."));
        return;
      }
      const filename = files[0];
      console.log(filename);
      resolve(filename);
    });
  });
};

export const getFile = async (req, res) => {
  const filepath = `${absolutePath}/mastered`;
  const { username } = req.query;
  const filename = await getFileName(username);
  res.download(`${filepath}/${username}/${filename}`);
};
