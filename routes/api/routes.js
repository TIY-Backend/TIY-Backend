const express = require('express');
const mongoose = require('mongoose');
const { Types } = mongoose;
const router = express.Router();
const { check, validationResult } = require('express-validator');
const POI = require('../../models/POI');
const Theme = require('../../models/Theme');
const ARelement = require('../../models/ARelement');

const Route = require('../../models/Route');

// @route GET api/arelements
// @desc  Create an AR element
// @access Public

router.get('/', async (req, res) => {
  try {
    const routes = await Route.find()
      .populate('theme', ['themeid', 'theme'])
      .populate('pois', [
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

    for (let i = 0; i < routes.length; i++) {
      const pois = routes[i].pois;
      const grades = pois.map((poi) => poi.grade);
      const sum = grades.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      const mean = sum / grades.length;
      routes[i].evaluation_grade = mean;
    }

    res.json(routes);
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
    const routes = await Route.find({ routeid: req.params.id })
      .populate('theme', ['themeid', 'theme'])
      .populate('pois', [
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
    const pois = routes[0].pois;
    const grades = pois.map((poi) => poi.grade);
    const sum = grades.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const mean = sum / grades.length;
    console.log(grades);
    console.log(sum);
    console.log(mean);
    routes[0].evaluation_grade = mean;

    res.json(routes);
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
    check('routeid', 'Please add unique ID').not().isEmpty(),
    check('description', 'Please include a description').not().isEmpty(),
    check('pois', 'Please include a POIs').not().isEmpty(),
    check('experience_level', 'Please include a experience level')
      .not()
      .isEmpty(),
    check('theme', 'Please add theme ID').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { routeid, description, pois, experience_level, theme, imgurl } =
      req.body;

    try {
      let route = await Route.findOne({ routeid });

      if (route) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Route already exists' }] });
      }

      let theme1 = await Theme.findOne({ theme: theme });

      let poiarray = [];
      let newpoi = await POI.find({ poiid: { $in: pois } });
      newpoi.forEach(function (poi) {
        poiarray.push(poi._id.valueOf());
      });

      let newimg = '';
      if (imgurl == '') {
        newimg =
          'https://cdn.glitch.global/e974619b-5809-4dcb-bd75-55d296fd7ad8/default.jpeg?v=1681409747893';
      } else newimg = imgurl;

      route = new Route({
        routeid,
        description,
        pois: poiarray,
        evaluation_grade: 0,
        experience_level,
        theme: theme1._id.valueOf(),
        imgurl: newimg,
      });

      await route.save();

      res.status(200).json(route);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route GET api/arelements
// @desc  Create an AR element
// @access Public

router.delete('/', async (req, res) => {
  try {
    const { routeid } = req.body;
    const routes = await Route.findOneAndRemove({ routeid: routeid });

    res.json('Route deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
