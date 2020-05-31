const express = require('express');
const app = express();


// Settings
app.set('port', process.env.PORT || 8000);

// Middlewares
app.use(express.json());

// Routes
app.use(require('./routes/router'));

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Started server at http://localhost:`+app.get('port'));
});