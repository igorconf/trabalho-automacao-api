const express = require('express');
const userController = require('./controller/userController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(express.json());


app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/users', userController.authMiddleware, userController.getUsers);
app.post('/rate', userController.authMiddleware, userController.rateUser);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
