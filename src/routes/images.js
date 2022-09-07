const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');

router.get('/bind', imageController.getImageBind);

module.exports = router;