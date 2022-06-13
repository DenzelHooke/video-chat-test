const express = require("express");
const router = express.Router();
const { rtcToken, rtmToken} = require("../controllers/auth");

router.route("/rtctoken").post(rtcToken);
router.route("/rtmtoken").post(rtmToken);

module.exports = router;
