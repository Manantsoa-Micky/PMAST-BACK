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

export const getFile = async (req, res) => {
  const filepath = `${absolutePath}/mastered`;
  const { username, filename } = req.query;
  res.download(`${filepath}/${username}/${filename}`);
};
