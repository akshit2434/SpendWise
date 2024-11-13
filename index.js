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
  const { userId, amount, title, description, pay_type } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.todaySpendings -= amount;
    if (pay_type == "UPI") user.upiSpendings -= amount; else user.cashSpendings -= amount;
    user.transactions.push({ amount, title, description, pay_type });
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.post('/api/update-dues', async (req, res) => {
  console.log(req.body);
  const { userId, amount, title, description, pay_type } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // amount *= -1;

    // user.currentBalance += amount;

    // if (pay_type == "UPI") user.upiBalance += amount; else user.cashBalance += amount;
    user.transactions.push({ amount, title, description, pay_type });

    var flag = 0;
    for (var person of user.dues) {
      if (person.name.toLowerCase() == title.toLowerCase()) {
        flag = 1;
        person.balance += amount;
        person.transactions.push({ amount, description, pay_type });
        break;
      }
    }
    if (flag == 0) {
      user.dues.push({ name: title, balance: amount, transactions: { amount, description, pay_type } });
    }
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});








app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//spendwise//spendwise2434

const mongoURI = 'mongodb+srv://spendwise:spendwise2434@cluster0.wepia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(main)
  .catch(err => console.error(err));

// Define a simple schema
const UserSchema = new mongoose.Schema({

  name: String,
  email: String,
  age: Number,
  // ... other user details
  todaySpendings: Number,
  upiSpendings: Number,
  cashSpendings: Number,
  budgetPerMonth: Number,
  weekdayBudget: Number,
  weekendBudget: Number,
  dailyavg: Number,
  transactions: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
      title: { type: String, default: "Daily Payments" },
      description: String,
      pay_type: String,
    }],
  dues: [
    {
      name: String,
      balance: Number,
      transactions: [
        {
          amount: Number,
          date: { type: Date, default: Date.now },
          title: { type: String, default: "Person1" },
          description: { type: String, default: "" },
          pay_type: String,
        }],
    }
  ]


});

const User = mongoose.model('User', UserSchema);

// Create a new user document
const newUser = new User({
  name: 'Akshit',
  age: 23,
  email: 'test123@gmail.com',
  todaySpendings: 0,
  upiSpendings: 0,
  cashSpendings: 0,
  budgetPerMonth: 10000,
  weekdayBudget: 150,
  weekendBudget: 80
});

async function main() {
  console.log("Mongo DB Connected");
  await User.deleteMany({});
  newUser.save()
    .then(user => console.log('User created:', user))
    .catch(err => console.error(err));
}