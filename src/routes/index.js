const express = require('express');
const router = express.Router();
const imageRoutes = require('./images');

router.use('/api/images', imageRoutes);

module.exports = router;