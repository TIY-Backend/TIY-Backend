const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const ARelement = require('../../models/ARelement');

// @route  api/arelements
// @desc  Get all AR elements

router.get('/', async (req, res) => {
  try {
    const arelements = await ARelement.find();

    res.json(arelements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  api/arelements/:id
// @desc  Get AR element by id

router.get('/:id', async (req, res) => {
  try {
    const arelements = await ARelement.find({ arid: req.params.id });
    res.json(arelements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/auth
// @desc  Create an AR element

router.post(
  '/',
  [
    check('arid', 'Please add unique ID').not().isEmpty(),
    check('url', 'Please include a valid url').not().isEmpty(),
    check('level', 'Please include a valid level').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { arid, url, level } = req.body;

    try {
      let arelement = await ARelement.findOne({ arid });

      if (arelement) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'AR element already exists' }] });
      }

      arelement = new ARelement({
        arid,
        url,
        level,
      });

      await arelement.save();

      res.status(200).json(arelement);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
