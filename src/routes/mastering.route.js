import express from 'express';
import * as masteringController from '../controllers/mastering.controller.js'
const router = express.Router();
import multer from 'multer';
const upload = multer({ dest: 'src/uploads/' });

router.post('/masterize', upload.single('file'), masteringController.masterize);
router.get('/getMastered', masteringController.getMasterized)

export default router;