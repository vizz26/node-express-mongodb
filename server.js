const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Employee = require('./models/employee');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/employeesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Get all employees
app.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('index', { employees });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Add employee form
app.get('/add', (req, res) => {
  res.render('form');
});

// Add a new employee
app.post('/add', async (req, res) => {
  const { name, email, department } = req.body;
  const employee = new Employee({ name, email, department });

  try {
    await employee.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
