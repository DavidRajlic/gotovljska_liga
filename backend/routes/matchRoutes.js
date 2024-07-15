var express = require("express");
var router = express.Router();
var matchController = require("../controllers/matchController.js");

/*
 * GET
 */
router.get("/", matchController.list);
router.get("/latest", matchController.latest);

/*
 * GET
 */
router.get("/:id", matchController.show);

/*
 * POST
 */
router.post("/", matchController.create);

/*
 * PUT
 */
router.put("/:id", matchController.update);

/*
 * DELETE
 */
router.delete("/:id", matchController.remove);

module.exports = router;
