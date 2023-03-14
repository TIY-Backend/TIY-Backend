const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Theme = require('../../models/Theme');

// @route GET api/arelements
// @desc  Create an AR element
// @access Public

router.get('/', async (req, res) => {
  try {
    const themes = await Theme.find();

    res.json(themes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/arelements/:id
// @desc  Create an AR element
// @access Public

router.get('/:id', async (req, res) => {
  try {
    const themes = await Theme.find({ themeid: req.params.id });
    res.json(themes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/auth
// @desc  Create an AR element
// @access Public

router.post(
  '/',
  [
    check('themeid', 'Please add unique ID').not().isEmpty(),
    check('theme', 'Please include a valid theme').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { themeid, theme } = req.body;

    try {
      let themes = await Theme.findOne({ themeid });

      if (themes) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Theme already exists' }] });
      }

      themes = new Theme({
        themeid,
        theme,
      });

      await themes.save();

      res.status(200).json(themes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
