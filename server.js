const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect Database
connectDB();

let cors = require('cors');
app.use(cors());

// Init Middleware
app.use(
  express.json({
    exrended: false,
  })
);

app.get('/', (req, res) => res.send('API running'));

//define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/arelements', require('./routes/api/arelements'));
app.use('/api/pois', require('./routes/api/pois'));
app.use('/api/themes', require('./routes/api/themes'));
app.use('/api/routes', require('./routes/api/routes'));
app.use('/api/tours', require('./routes/api/tours'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
