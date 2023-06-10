const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Skin = require('../../models/Skin');
const User = require('../../models/User');

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
    let skins = await Skin.findOne({ email: req.params.email }).select(
      '-email'
    );
    if (!skins) {
      skins = new Skin({
        email: req.params.email,
        white: { name: 'white', status: 'Unlocked', code: '#FFFFFF' },
        blue: { name: 'blue', status: 'Locked', code: '#AEE2FF' },
        yellow: { name: 'yellow', status: 'Locked', code: '#F6FA70' },
        green: { name: 'green', status: 'Locked', code: '#ADE792' },
        gray: { name: 'gray', status: 'Locked', code: '#DDDDDD' },
        pink: { name: 'pink', status: 'Locked', code: '#FFE1E1' },
        purple: { name: 'purple', status: 'Locked', code: '#E5D1FA' },
        orange: { name: 'orange', status: 'Locked', code: '#FFA559' },
      });
      await skins.save();
      skins = await Skin.findOne({ email: req.params.email }).select('-email');
    }

    res.json(skins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/arelements/:id
// @desc  Create an AR element
// @access Public

router.put('/', async (req, res) => {
  try {
    const { email, color } = req.body;
    let skin = await Skin.findOne({ email: email });
    user[color].status = 'Unlocked';

    await skin.save();

    let user = await User.findOne({ email: email });
    current = user.coins;
    user.coins = current - 50;
    await user.save();

    res.json('Skin Unlocked');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
