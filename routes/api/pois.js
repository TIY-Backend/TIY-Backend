const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const POI = require('../../models/POI');
const ARelement = require('../../models/ARelement');
const Theme = require('../../models/Theme');
const Grade = require('../../models/Grade');

// @route GET api/pois
// @desc  Get all POIs

router.get('/', async (req, res) => {
  try {
    const pois = await POI.find()
      .populate('theme', ['themeid', 'theme'])
      .populate('arid', ['arid', 'url', 'level']);
    res.json(pois);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/pois/:id
// @desc  Get POI by id

router.get('/:id', async (req, res) => {
  try {
    const pois = await POI.find({ poiid: req.params.id })
      .populate('theme', ['themeid', 'theme'])
      .populate('arid', ['arid', 'url', 'level']);
    res.json(pois);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/auth
// @desc  Create new POI

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
          .json({ errors: [{ msg: 'POI element already exists' }] });
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
        gradesum: 0,
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

// @route GET api/pois/evaluate
// @desc  update the evaluation of a POI

router.put('/evaluate', async (req, res) => {
  try {
    const { poiid, newgrade } = req.body;
    const poi = await POI.findOne({ poiid: poiid });
    let newgradesum = poi.gradesum + newgrade;
    let newgradecounter = poi.gradecounter + 1;
    let grade = newgradesum / newgradecounter;
    console.log(newgradesum);
    console.log(newgradecounter);
    console.log(poi);
    await POI.updateOne(
      { poiid: poiid },
      { grade: grade, gradesum: newgradesum, gradecounter: newgradecounter }
    );
    res.json('POI update done');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/pois
// @desc  Delete POI

router.delete('/', async (req, res) => {
  try {
    const { poiid } = req.body;
    const poi = await POI.findOne({ poiid: poiid });
    if (!poi) {
      return res.json('POI doesn`t exist');
    }

    const pois = await POI.findOneAndRemove({ poiid: poiid });

    res.json('POI deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/pois
// @desc  Update POI

router.put('/', async (req, res) => {
  try {
    const { poiid, name, description, address, coordinates, theme } = req.body;

    const currentPoi = POI.findOne({ poiid: poiid });

    let newtheme;
    let theme1 = await Theme.findOne({ theme: theme });
    if (theme1) {
      newtheme = theme1._id.valueOf();
    }

    await POI.updateOne(
      { poiid: poiid },
      {
        name: name,
        description: description,
        address: address,
        coordinates: coordinates,
        theme: newtheme,
      }
    );

    res.json('POI update done');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
