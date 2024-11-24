const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age eyeColor').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const makeDomo = async (req, res) => {
  if (!(req.body.name && req.body.age && req.body.eyeColor)) { return res.status(400).json({ error: 'Both name and age are required! ' }); }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    eyeColor: req.body.eyeColor,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({
      name: newDomo.name,
      age: newDomo.age,
      eyeColor: newDomo.eyeColor,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) { return res.status(400).json({ error: 'Domo already exists!' }); }
    return res.status(500).json({ error: 'An error occurred making domo!' });
  }
};

const deleteDomo = async (req, res) => {
  if (!req.body.id) return res.status(400).json({ error: 'No ID found! ' });

  try {
    await Domo.deleteOne({ _id: req.body.id });
    return res.status(200).json({ content: 'Domo deleted' });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: 'Domo not found!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
