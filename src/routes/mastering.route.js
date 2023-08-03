import express from 'express';
import * as masteringController from '../controllers/mastering.controller.js'
const router = express.Router();
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

router.post('/masterize', upload.single('file'), masteringController.masterize);
router.post('/getMastered', masteringController.getFile);
router.get('/getFileName', masteringController.getFileName);

export default router;