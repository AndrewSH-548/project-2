const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Enemy.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Enemy.makeEnemy);

  app.get('/getEnemies', mid.requiresLogin, controllers.Enemy.getEnemies);
  app.get('/viewer', mid.requiresLogin, controllers.Enemy.viewerPage);
  app.delete('/viewer', mid.requiresLogin, controllers.Enemy.deleteEnemy);
  app.put('/viewer', mid.requiresLogin, controllers.Enemy.updateEnemy);

  app.get('/settings', mid.requiresLogin, controllers.Account.settingsPage);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);

  app.all('*', controllers.Account.page404);
};

module.exports = router;
