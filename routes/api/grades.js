const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Grade = require('../../models/Grade');
const POI = require('../../models/POI');
const User = require('../../models/User');

// @route GET api/grades
// @desc  Get all Grades

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

// @route GET api/grades
// @desc  Get grades by poi

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

// @route POST api/grades
// @desc  Create new grade

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
    const newGrade = parseInt(grade);

    try {
      let poi = await POI.findOne({ poiid: poiid });
      let user = await User.findOne({ email: email });
      let checkgrade = await Grade.findOne({ poiid: poi._id, user: user._id });
      if (checkgrade) {
        return res.status(400).send('You already ranked this POI');
      }

      let newgrade = new Grade({
        poiid: poi._id.valueOf(),
        user: user._id.valueOf(),
        grade: newGrade,
      });

      await newgrade.save();

      // update POI rank

      const poi2 = await POI.findOne({ poiid: poiid });
      let newgradesum = poi.gradesum + newGrade;
      let newgradecounter = poi.gradecounter + 1;
      let grade = newgradesum / newgradecounter;
      console.log(newgradesum);
      console.log(newgradecounter);
      console.log(poi);
      await POI.updateOne(
        { poiid: poiid },
        { grade: grade, gradesum: newgradesum, gradecounter: newgradecounter }
      );

      res.status(200).send('Rank Submitted');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
