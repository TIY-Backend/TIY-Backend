const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Route = require('../../models/Route');

// @route GET api/arelements
// @desc  Create an AR element
// @access Public

router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();

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
    const routes = await Route.find({ routeid: req.params.id });
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
    check('themeid', 'Please add theme ID').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { routeid, description, pois, experience_level, themeid } = req.body;

    try {
      let route = await Route.findOne({ routeid });

      if (route) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Route already exists' }] });
      }

      route = new Route({
        routeid,
        description,
        pois,
        evaluation_grade: 0,
        experience_level,
        themeid,
      });

      await route.save();

      res.status(200).json(route);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
