const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const asyncHandler = require("../utils/async_handler");
/* GET */
router.get("/", controller.main);
/* POST */
router.post("/", controller.formulario);
router.post("/confirmacion", asyncHandler(controller.confirmarDatos));
router.post("/guardar", asyncHandler(controller.postPago));
module.exports = router;