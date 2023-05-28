const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Grade = require('../../models/Grade');
const POI = require('../../models/POI');
const User = require('../../models/User');

// @route GET api/arelements
// @desc  Create an AR element
// @access Public

router.get('/', async (req, res) => {
  try {
    const grade = await Grade.find()
      .populate('poiid', [
        'poiid',
        'name',
        'description',
        'address',
        'coordinates',
        'arid',
        'grade',
        'gradecounter',
        'theme',
      ])
      .populate('user', ['fname', 'email', 'age', 'is_accessible', 'avatar']);
    res.json(grade);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/arelements
// @desc  Create an AR element
// @access Public

router.get('/:id', async (req, res) => {
  try {
    const poi = await POI.findOne({ poiid: req.params.id });
    const grade = await Grade.find({ poiid: poi._id })
      .populate('poiid', [
        'poiid',
        'name',
        'description',
        'address',
        'coordinates',
        'arid',
        'grade',
        'gradecounter',
        'theme',
      ])
      .populate('user', ['fname', 'email', 'age', 'is_accessible', 'avatar']);
    res.json(grade);
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
    check('poiid', 'Please include a valid poiid').not().isEmpty(),
    check('email', 'Please include the user email').not().isEmpty(),
    check('grade', 'Please include a grade').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { poiid, email, grade } = req.body;

    try {
      let poi = await POI.findOne({ poiid: poiid });
      let user = await User.findOne({ email: email });

      let newgrade = new Grade({
        poiid: poi._id.valueOf(),
        user: user._id.valueOf(),
        grade: grade,
      });

      await newgrade.save();

      res.status(200).json(newgrade);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
