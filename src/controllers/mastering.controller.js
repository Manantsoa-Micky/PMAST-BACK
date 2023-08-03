import * as masteringMusic from "../services/mastering.service.mjs";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


// TAKING WAV FILES
export const masterize = async (req, res) => {
  const file = req.file;
  const username = req.query.username;
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

// export const getMasterized = async (req, res) => {
//   const username = req.query.username;
//   try {
//     if (username) {
//       // const directory = `mastered/${username}`;
//       const directory = 'mastered'
//       const response = await masteringMusic.getMasteredFiles(directory);
//       console.log(response);
//       res.status(200).json(response);
//     }
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const absolutePath = join(dirname(currentFilePath), '../..');

export const getFile = (req, res) => {
  const filepath = `${absolutePath}/mastered`;
  const filename = `${req.query.username}`;

  res.download(filepath, filename);
};

export const getFileName = (req, res) => {
  fs.readdir('mastered', (err, files) => {
    if (err) {
      console.error('Error while reading mastered folder:', err);
      res.status(500).send('Failed to read mastered folder.');
      return;
    }

    if (files.length === 0) {
      res.status(404).send('No files found in the mastered folder.');
      return;
    }

    const filename = files[0];
    res.json({ filename });
  });
};
