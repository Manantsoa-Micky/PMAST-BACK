import express from "express";
import multer from "multer";
// import * as masteringController from "../controllers/mastering.controller.js";
import masterize, {
  getFile,
  getFileName,
} from "../controllers/mastering.controller.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/masterize", upload.single("file"), masterize);
// router.get("/getMastered", (req, res) => {
//   console.log("called");
// });
router.get("/getMastered", getFile);
router.get("/getFileName", getFileName);

export default router;
