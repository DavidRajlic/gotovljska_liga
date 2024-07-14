var express = require("express");
var router = express.Router();
var TeamController = require("../controllers/teamController.js");

/*
 * GET
 */
router.get("/", TeamController.list);

/*
 * GET
 */
router.get("/:id", TeamController.show);

/*
 * POST
 */
router.post("/", TeamController.create);

/*
 * PUT
 */
router.put("/:id", TeamController.update);
router.put("/again/:id", TeamController.updateTeam);

/*
 * DELETE
 */
router.delete("/:id", TeamController.remove);

module.exports = router;
