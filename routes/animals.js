const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Client = require('../models/Client');
const Animal = require('../models/Animal');

// @route POST api/clients
// @desc Get all clients
// @access Public

router.get('/', auth, async (req, res) => {
  try {
    const animals = await Animal.find({ owner: req.body.owner }).sort({
      date: -1
    });
    res.json(animals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error!');
  }
});

// @route POST api/clients
// @desc Add a client
// @access Private

router.post(
  '/',
  auth,
  [
    check('owner', 'Vlasnik je obavezan!')
      .not()
      .isEmpty(),
    check('name', 'Ime je obavezno!')
      .not()
      .isEmpty(),
    check('type', 'Vrsta je obavezna!')
      .not()
      .isEmpty(),
    check('race', 'Rasa je obavezna!')
      .not()
      .isEmpty(),
    check('color', 'Boja je obavezna!')
      .not()
      .isEmpty(),
    check('dateOfBirth', 'Datum rodjenja je obavezan!')
      .not()
      .isEmpty(),
    check('sex', 'Pol je obavezan!')
      .not()
      .isEmpty(),
    check('microChipId', 'Cip je obavezan!')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      owner,
      name,
      type,
      race,
      color,
      dateOfBirth,
      sex,
      microChipId
    } = req.body;

    try {
      let animal = await Animal.findOne({
        owner,
        name,
        type,
        race,
        color,
        dateOfBirth,
        sex,
        microChipId
      });

      if (animal) {
        return res
          .status(400)
          .json({ msg: 'Zivotinja vec postoji u bazi podataka!' });
      }

      animal = new Animal({
        owner,
        name,
        type,
        race,
        color,
        dateOfBirth,
        sex,
        microChipId
      });

      const anim = await animal.save();

      res.json(anim);
    } catch (err) {
      console.error(err.message);
      console.log('Server error from animals.js');
    }
  }
);

// @route UPDATE api/clients/:id
// @desc Update client info
// @access Private

router.put('/:id', auth, async (req, res) => {
  const { name, type, race, color, dateOfBirth, sex, microChipId } = req.body;

  const animalFields = {};
  if (name) animalFields.name = name;
  if (type) animalFields.type = type;
  if (race) animalFields.race = race;
  if (color) animalFields.color = color;
  if (dateOfBirth) animalFields.dateOfBirth = dateOfBirth;
  if (sex) animalFields.sex = sex;
  if (microChipId) animalFields.microChipId = microChipId;

  try {
    let animal = await Animal.findById(req.params.id);

    if (!animal)
      return res.status(404).json({ msg: 'Zivotinja nije pronadjena' });

    animal = await Animal.findByIdAndUpdate(
      req.params.id,
      { $set: animalFields },
      { new: true }
    );

    res.json(animal);
  } catch (err) {
    console.error(err.message);
    console.log('Server error from clients.js');
  }
});

// @route DELETE api/clients/:id
// @desc Delete client
// @access Private

router.delete('/:id', auth, async (req, res) => {
  try {
    let animal = await Animal.findById(req.params.id);

    if (!animal)
      return res.status(404).json({ msg: 'Zivotinja nije pronadjena' });

    await Animal.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Zivotinja je obrisana iz baze podataka' });
  } catch (err) {
    console.error(err.message);
    console.log('Server error from clients.js');
  }
});

module.exports = router;
