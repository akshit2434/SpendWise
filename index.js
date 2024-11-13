const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Your backend port

app.use(cors()); // Enable CORS for all routes
app.use(express.json());


app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/update-balance', async (req, res) => {
  console.log(req.body);
  const { userId, amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.currentBalance += amount;
    user.upiBalance += amount;
    user.transactions.push({ amount });
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).send(err);
  }
});
;







app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//spendwise//spendwise2434

const mongoURI = 'mongodb+srv://spendwise:spendwise2434@cluster0.wepia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Define a simple schema
const UserSchema = new mongoose.Schema({

  name: String,
  email: String,
  age: Number,
  // ... other user details
  currentBalance: Number,
  upiBalance: Number,
  cashBalance: Number,
  budgetPerMonth: Number,
  transactions: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
      title: { type: String, default: "Daily Payments" }
    }
  ]

});

const User = mongoose.model('User', UserSchema);

// Create a new user document
const newUser = new User({
  name: 'Test123',
  age: 23,
  email: 'test123@gmail.com',
  currentBalance: 0,
  upiBalance: 0,
  cashBalance: 0,
  budgetPerMonth: 10000
});

// newUser.save()
//   .then(user => console.log('User created:', user))
//   .catch(err => console.error(err));