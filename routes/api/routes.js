const express = require('express');
const mongoose = require('mongoose');
const { Types } = mongoose;
const router = express.Router();
const { check, validationResult } = require('express-validator');
const POI = require('../../models/POI');
const Theme = require('../../models/Theme');
const ARelement = require('../../models/ARelement');

const Route = require('../../models/Route');

// @route  api/routes/getnewid
// @desc  gets the last id number + 1 from database

router.get('/getnewid/', async (req, res) => {
  try {
    const routes = await Route.find().sort({ routeid: -1 }).limit(1);
    newid = Number(routes[0].routeid);
    res.json(newid + 1);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  api/routes
// @desc  get all routes

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

// @route api/routes/:id
// @desc  Get route by id

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
    // console.log(grades);
    // console.log(sum);
    // console.log(mean);
    routes[0].evaluation_grade = mean;

    res.json(routes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/routes
// @desc  Create new route

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

    const {
      routeid,
      description,
      pois,
      experience_level,
      theme,
      imgurl,
      access,
      email,
    } = req.body;

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
        access: access,
        email: email,
      });

      await route.save();

      res.status(200).json(route);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route  api/routes
// @desc  Delete route

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

// @route  api/routes
// @desc  Update Route

router.put('/', async (req, res) => {
  try {
    const {
      routeid,
      pois,
      evaluation_grade,
      description,
      experience_level,
      theme,
      imgurl,
      access,
      email,
    } = req.body;

    const currentRoute = Route.findOne({ routeid: routeid });
    let poiarray = [];
    if (pois) {
      let newpoi = await POI.find({ poiid: { $in: pois } });
      newpoi.forEach(function (poi) {
        poiarray.push(poi._id.valueOf());
      });
    }

    let newtheme;
    let theme1 = await Theme.findOne({ theme: theme });
    if (theme1) {
      newtheme = theme1._id.valueOf();
    }

    if (poiarray.length == 0) {
      await Route.updateOne(
        { routeid: routeid },
        {
          evaluation_grade: evaluation_grade || currentRoute.evaluation_grade,
          description: description || currentRoute.description,
          experience_level: experience_level || currentRoute.experience_level,
          theme: newtheme || currentRoute.theme,
          imgurl: imgurl || currentRoute.imgurl,
          access: access || currentRoute.accesss,
          email: email || currentRoute.email,
        }
      );
    } else {
      await Route.updateOne(
        { routeid: routeid },
        {
          pois: poiarray || currentRoute.pois,
          evaluation_grade: evaluation_grade || currentRoute.evaluation_grade,
          description: description || currentRoute.description,
          experience_level: experience_level || currentRoute.experience_level,
          theme: newtheme || currentRoute.theme,
          imgurl: imgurl || currentRoute.imgurl,
          access: access || currentRoute.accesss,
          email: email || currentRoute.email,
        }
      );
    }

    res.json('Route update done');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  api/routes
// @desc  Get routes by email

router.get('/users/:email', async (req, res) => {
  try {
    const routes = await Route.find({ email: req.params.email })
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

module.exports = router;
