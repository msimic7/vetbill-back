const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');

const Client = require('../models/Client');

// @route POST api/clients
// @desc Get all clients
// @access Public

router.get('/', auth, async (req, res) => {
  const clients = await Client.find({});

  res.send(clients);
});

// @route POST api/clients
// @desc Add a client
// @access Private

router.post(
  '/',
  [
    check('name', 'Ime je obavezno!')
      .not()
      .isEmpty(),
    check('surname', 'Prezime je obavezno!')
      .not()
      .isEmpty(),
    check('address', 'Adresa je obavezna!')
      .not()
      .isEmpty(),
    check('city', 'Mesto je obavezno!')
      .not()
      .isEmpty(),
    check('phoneNumber', 'Broj je obavezan!')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, surname, address, city, phoneNumber } = req.body;

    try {
      let client = await Client.findOne({
        name,
        surname,
        address,
        city,
        phoneNumber
      });

      if (client) {
        return res
          .status(400)
          .json({ msg: 'Klijent vec postoji u bazi podataka!' });
      }

      client = new Client({
        name,
        surname,
        address,
        city,
        phoneNumber
      });

      await client.save();

      res.json({ msg: 'Klijent je sacuvan u bazu podataka!' });
    } catch (err) {
      console.error(err.message);
      console.log('Server error from clients.js');
    }
  }
);

// @route UPDATE api/clients/:id
// @desc Update client info
// @access Private

router.put('/:id', auth, async (req, res) => {
  const { name, surname, address, city, phoneNumber } = req.body;

  const clientFields = {};
  if (name) clientFields.name = name;
  if (surname) clientFields.surname = surname;
  if (address) clientFields.address = address;
  if (city) clientFields.city = city;
  if (phoneNumber) clientFields.phoneNumber = phoneNumber;

  try {
    let client = await Client.findById(req.params.id);

    if (!client) return res.status(404).json({ msg: 'Klijent nije pronadjen' });

    client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: clientFields },
      { new: true }
    );

    res.json(client);
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
    let client = await Client.findById(req.params.id);

    if (!client) return res.status(404).json({ msg: 'Klijent nije pronadjen' });

    await Client.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Klijent je obrisan iz baze podataka' });
  } catch (err) {
    console.error(err.message);
    console.log('Server error from clients.js');
  }
});

module.exports = router;
