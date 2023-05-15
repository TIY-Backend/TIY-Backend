const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

// @route GET api/users
// @desc  Get all users
// @access Public

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/users
// @desc  Register User
// @access Public
router.post(
  '/',
  [
    check('fname', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 1 or more characters'
    ).isLength({ min: 3 }),
    check('age', 'Age is required').not().isEmpty(),
    check('is_accessible', 'Is_accessible is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fname, email, password, age, is_accessible } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        fname,
        email,
        password,
        age,
        is_accessible,
        avatar,
        coins: 50,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // res.status(200).json(user);

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route GET api/arelements/:id
// @desc  Create an AR element
// @access Public

router.put('/', async (req, res) => {
  try {
    const { fname, email, password, age, is_accessible } = req.body;
    const salt = await bcrypt.genSalt(10);
    const password1 = await bcrypt.hash(password, salt);
    await User.updateOne(
      { email: email },
      { fname: fname, password: password1 }
    );
    res.json('User update done');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/users
// @desc  Register User
// @access Public
router.post(
  '/gmailauth',
  [
    check('name', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('picture', 'picture is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, picture } = req.body;
    try {
      let user = await User.findOne({ email });
      const passwordgmail = 'gmail123';

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      if (user) {
        // console.log(user);
      } else {
        user = new User({
          fname: name,
          email: email,
          password: passwordgmail,
          age: 0,
          is_accessible: 'false',
          avatar,
          coins: 50,
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(passwordgmail, salt);

        await user.save();
      }

      // res.status(200).json(user);

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
