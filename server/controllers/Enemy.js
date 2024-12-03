const models = require('../models');

const { Enemy } = models;

const makerPage = (req, res) => res.render('app');

const getEnemies = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Enemy.find(query).select('name type color accessories').lean().exec();

    return res.json({ enemies: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving enemies!' });
  }
};

const makeEnemy = async (req, res) => {
  if (!(req.body.name && req.body.type && req.body.color)) { return res.status(400).json({ error: 'Name, type, and color are required!' }); }

  const enemyData = {
    name: req.body.name,
    type: req.body.type,
    color: req.body.color,
    accessories: req.body.accessories,
    owner: req.session.account._id,
  };

  try {
    const newEnemy = new Enemy(enemyData);
    await newEnemy.save();
    return res.status(201).json({
      name: newEnemy.name,
      type: newEnemy.type,
      color: newEnemy.color,
      accessories: newEnemy.accessories
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) { return res.status(400).json({ error: 'Enemy already exists!' }); }
    return res.status(500).json({ error: 'An error occurred making the enemy!' });
  }
};

const deleteEnemy = async (req, res) => {
  if (!req.body.id) return res.status(400).json({ error: 'No ID found! ' });

  try {
    await Enemy.deleteOne({ _id: req.body.id });
    return res.status(200).json({ content: 'Enemy deleted' });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: 'Enemy not found!' });
  }
};

module.exports = {
  makerPage,
  makeEnemy,
  getEnemies,
  deleteEnemy,
};
