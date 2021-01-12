const app = require('express')();
const sequelize = require('./utils/database');
const bodyParser = require('body-parser');
const authorization = require('./services/authorizationService');
const usersRoutes = require('./routes/mainRoutes');
const errorsController = require('./controllers/errorsController');

app.use(bodyParser.json());

app.use(authorization.jwtVerifyMiddleware);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(usersRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Page you are looking for does not exist' });
});

app.use((error, req, res,) => {
    console.log(error);
    res.status(500).json({ message: 'Unexpected error occured' });
});

sequelize
    .sync(
        { alter: true }
    )
    .then(() => {
        console.log('Connection has been established successfully.');
        app.listen(3000);
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    })
