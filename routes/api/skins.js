const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Skin = require('../../models/Skin');

// @route GET api/arelements
// @desc  Create an AR element
// @access Public

router.get('/', async (req, res) => {
  try {
    const skins = await Skin.find();

    res.json(skins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/arelements/:id
// @desc  Create an AR element
// @access Public

router.get('/:email', async (req, res) => {
  try {
    let skins = await Skin.findOne({ email: req.params.email });
    if (!skins) {
      skins = new Skin({
        email: req.params.email,
        white: 'Unlocked',
        blue: 'Locked',
        yellow: 'Locked',
        green: 'Locked',
        gray: 'Locked',
        pink: 'Locked',
        purple: 'Locked',
        orange: 'Locked',
      });
      await skins.save();
    }

    res.json(skins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
