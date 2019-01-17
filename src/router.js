const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data


module.exports = {

	/**
	 * Initializes the layout and all the routes
	 *
	 * @param      {express.Express}  app     The HTTP server
	 * @param      {winston.Logger}  logger  The logger
	 * @param      {controller} controller the controller
	 */
	initilizeRoutes: function (app, controller, logger) {
		logger.info('[Router] Starting');

		app.use(bodyParser.json()); // for parsing application/json
		/**
		 * Get the list of users
		 */
		app.get('/users', (req, res) => {
			logger.debug('[Router] GET on /users');
			controller.getUsers(res).then((users) => {
				res.status(200).send(users);
			});
		});


		/**
		 * Get one user
		 */
		app.get('/users/:userId', (req, res) => {
			logger.debug('[Router] GET on /users/%s', req.params.userId);
			if (!isNaN(parseInt(req.params.userId))) {
				controller.getUserById(parseInt(req.params.userId), res).then((user) => {
					if (user !== null) {
						res.status(200).send(user);
					} else {
						res.sendStatus(404);
					}
				});
			} else {
				res.sendStatus(400);
			}
		});

		/**
		 * Create a user
		 */
		app.post('/users', upload.array(), (req, res) => {
			let user = req.body;
			logger.debug('[Router] POST on /users with body %O', user);
			try {
				controller.createUser(user.lastname, user.firstname, user.username, user.password, res).then((user) => {
					logger.info('[Router] Ok, sending user !');
					res.status(201).send(user);
				}).catch((error) => {
					logger.info('[Router] Bad Request !');
					logger.error(error.message);
					res.status(400).send(error.message);
				});
			} catch (error) {
				logger.info('[Router] Bad Request !');
				res.status(400).send(error.message);
			}
		});

		/**
		 * Update a user
		 */
		app.put('/users/:userId', upload.array(), (req, res) => {
			let user = req.body;
			logger.debug('[Router] PUT on /users/%s with body %O', req.params.userId, req.body);
			if (!isNaN(parseInt(req.params.userId))) {
				try {
					controller.updateUser(parseInt(req.params.userId), user.lastname, user.firstname, user.username, user.password, user.adminPermission, res).then((user) => {
						if (user !== null) {
							logger.info('[Router] Ok, sending user !');
							res.status(201).send(user);
						} else {
							logger.info('[Router] User not found !');
							res.sendStatus(404);
						}
					}).catch((error) => {
						logger.info('[Router] Bad Request !');
						res.status(400).send(error.message);
					});
				} catch (error) {
					logger.debug('[Router] %s', error.message);
					res.status(400).send(error.message);
				}
			} else {
				res.sendStatus(400);
			}
		});

		/**
		 * Delete a user
		 */
		app.delete('/users/:userId', upload.array(), (req, res) => {
			logger.debug('[Router] DELETE on /users/%s', req.params.userId);
			if (!isNaN(parseInt(req.params.userId))) {
				try {
					controller.deleteUser(parseInt(req.params.userId), res).then(() => {
						logger.info('[Router] User deleted !');
						res.sendStatus(200);
					}).catch(() => {
						logger.info('[Router] User not found !');
						res.sendStatus(404);
					});
				} catch (error) {
					logger.debug('[Router] %s', error.message);
					res.status(400).send(error.message);
				}
			} else {
				res.sendStatus(400);
			}
		});

		/**
		 * Post on login
		 */
		app.post('/login', upload.array(), (req, res) => {
			logger.debug('[Router] POST on /login');
			try {
				logger.debug('[Router] %o',req.body);
				controller.login(req.body.username, req.body.password, res).then((user) => {
					if (user !== null) {
						res.status(200).send(user);
					} else {
						res.status(401).send('Wrong username / password');
					}
				});
			} catch (error) {
				res.status(400).send(error.message);
			}

		});

		/**
		 * Post on tryToken
		 */
		app.post('/tryToken', upload.array(), (req, res) => {
			logger.debug('[Router] POST on /tryToken');
			try {
				controller.tryToken(req.body.username, req.body.token, res).then((result) => {
					if (result === true) {
						res.sendStatus(200);
					} else {
						res.sendStatus(401);

					}
				}).catch((error) => {
					res.status(401).send(error.message);
				});
			} catch (error) {
				res.status(400).send(error.message);
			}

		});

		/**
		 * Post on logout
		 */
		app.post('/logout', upload.array(),(req, res) => {
			logger.debug('[Router] POST on /logout');
			try {
				logger.debug('[Router] %O',req.body);
				controller.logout(req.body.username, req.body.token, res).then(() => {
					res.sendStatus(200);
				}).catch((error) => {
					res.status(404).send(error.message);
				});
			} catch (error) {
				res.status(400).send(error.message);
			}

		});

		/**
		 * Get the list of users
		 */
		app.get('/', (req, res) => {
			logger.debug('[Router] GET on /');
			res.sendStatus(200);
		});

		/**
		 * Default route
		 */
		app.use(function (req, res) {
			logger.debug('[Router] 404 : access to %s', req.url);
			res.sendStatus(404);
		});

		logger.info('[Router] Ready');

	}
};