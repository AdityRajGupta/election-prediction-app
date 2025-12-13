// server/src/routes/campaignMemberRoutes.js

const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/campaignMemberController");

// User sends join request
router.post("/join", auth, controller.joinCampaign);

// PartyHead approves or rejects
router.put("/:memberId/status", auth, controller.updateStatus);

// Get pending requests
router.get("/:campaignId/pending", auth, controller.getPending);

// Get my membership in a specific campaign
router.get("/my/:campaignId", auth, controller.getMyMembership);


module.exports = router;
