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

// @route GET api/arelements/:id
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
    check('poiid', 'Please add unique ID').not().isEmpty(),
    check('name', 'Please include a valid name').not().isEmpty(),
    check('description', 'Please include a description').not().isEmpty(),
    check('address', 'Please include a valid address').not().isEmpty(),
    check('arid', 'Please include a valid AR id').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { poiid, name, description, address, coordinates, arid, theme } =
      req.body;

    try {
      let poi = await POI.findOne({ poiid });

      if (poi) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'AR element already exists' }] });
      }

      let ar = await ARelement.findOne({ arid: arid });
      let theme1 = await Theme.findOne({ theme: theme });

      poi = new POI({
        poiid,
        name,
        description,
        address,
        coordinates,
        arid: ar._id.valueOf(),
        grade: 0,
        gradecounter: 0,
        theme: theme1._id.valueOf(),
      });

      await poi.save();

      res.status(200).json(poi);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
