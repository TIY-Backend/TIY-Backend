const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const POI = require('../../models/POI');

const Tour = require('../../models/Tour');

// @route  api/tours
// @desc  Get all tours

router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find().populate('pois', [
      'poiid',
      'name',
      'description',
      'address',
      'coordinates',
      'arid',
      'grade',
      'gradecounter',
      'theme',
    ]);

    const updatedRoutes = tours.map((tour) => {
      if (tour.description == 'Private Route') {
        tour.type = 'Producer';
      } else {
        tour.type = 'Consumer';
      }
      return tour;
    });

    res.json(updatedRoutes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  api/tours/:email
// @desc  get tours by email

router.get('/:email', async (req, res) => {
  try {
    const tours = await Tour.find({ email: req.params.email }).populate(
      'pois',
      [
        'poiid',
        'name',
        'description',
        'address',
        'coordinates',
        'arid',
        'grade',
        'gradecounter',
        'theme',
      ]
    );
    res.json(tours);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/tours
// @desc  Create new tour

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
    check('pois', 'Please include a valid theme').not().isEmpty(),
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
      pois,
      experience_level,
      duration,
      evaluation_grade,
    } = req.body;

    try {
      let poiarray = [];
      let newpoi = await POI.find({ poiid: { $in: pois } });
      newpoi.forEach(function (poi) {
        poiarray.push(poi._id.valueOf());
      });

      let tour = new Tour({
        email: email,
        routeid: routeid,
        description: description,
        theme: theme,
        experience_level: experience_level,
        pois: poiarray,
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
