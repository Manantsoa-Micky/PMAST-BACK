import express from "express";
import multer from "multer";
import masterize, {
  getFile,
} from "../controllers/mastering.controller.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/masterize", upload.single("file"), masterize);
router.get("/getMastered", getFile);

export default router;
