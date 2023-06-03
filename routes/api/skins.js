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
        white: { status: 'Unlocked', code: '#FFFFFF' },
        blue: { status: 'Locked', code: '#AEE2FF' },
        yellow: { status: 'Locked', code: '#F6FA70' },
        green: { status: 'Locked', code: '#ADE792' },
        gray: { status: 'Locked', code: '#DDDDDD' },
        pink: { status: 'Locked', code: '#FFE1E1' },
        purple: { status: 'Locked', code: '#E5D1FA' },
        orange: { status: 'Locked', code: '#FFA559' },
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
