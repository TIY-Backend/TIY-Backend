const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Tour = require('../../models/Tour');

// @route GET api/arelements
// @desc  Create an AR element
// @access Public

router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/arelements
// @desc  Create an AR element
// @access Public

router.get('/:email', async (req, res) => {
  try {
    const tours = await Tour.find({ email: req.params.email });
    res.json(tours);
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
    check('email', 'Please include valid email').not().isEmpty(),
    check('routeid', 'Please include the route id').not().isEmpty(),
    check('description', 'Please include a description').not().isEmpty(),
    check('theme', 'Please include a valid theme').not().isEmpty(),
    check('experience_level', 'Please include the experince level')
      .not()
      .isEmpty(),
    check('duration', 'Please include the experince level').not().isEmpty(),
    check('evaluation_grade', 'Please include the evaluation grade')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      routeid,
      description,
      theme,
      experience_level,
      duration,
      evaluation_grade,
    } = req.body;

    try {
      let tour = new Tour({
        email: email,
        routeid: routeid,
        description: description,
        theme: theme,
        experience_level: experience_level,
        duration: duration,
        evaluation_grade: evaluation_grade,
      });

      await tour.save();

      res.status(200).json(tour);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
