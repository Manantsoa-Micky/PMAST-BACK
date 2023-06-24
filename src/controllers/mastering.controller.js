import * as masteringMusic from '../services/mastering.service.mjs';
import fs from 'fs'
// TAKING WAV FILES
export const masterize = async(req, res) => {
    const file = req.file;
    const username = req.query.username;
    const folderName = 'mastered/' + username;
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
    } catch (err) {
        console.error(err);
    }
    const outputPath = folderName + '/' + file.originalname;
    console.log(outputPath);
    console.log(file);
    console.log(username);
    try {
        if (file) {
            const response = await masteringMusic.main(req.file.path, outputPath)
            res.status(200).json(response);
        }
    } catch (error) {
        return error
    }
}

export const getMasterized = async(req, res) => {
    const username = req.query.username;
    try {
        if (username) {
            const directory = `mastered/${username}`;
            const response = await masteringMusic.getMasteredFiles(directory);
            console.log(response)
            res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}