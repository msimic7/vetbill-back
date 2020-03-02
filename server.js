const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect to database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.json({ msg: 'Static placeholder' }));

//Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/animals', require('./routes/animals'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
