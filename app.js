const express = require("express");
const app = express();
const db = require('./models');
const sequelize = require('./db');
const port = 3001;
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes");

async function initializeDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await db.sequelize.sync({ force: false });
    console.log('All models were synchronized successfully.');
        app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
        });
  } catch (error) {
        console.error('Unable to connect to the database or sync models:', error);
  }
}

initializeDatabase();

sequelize.authenticate()
 .then(async () => {
    console.log('Database connected successfully');

    await sequelize.sync({ alter: true });

    console.log('All models synchronized');

    app.listen(3001, () => {
      console.log('Server running on http://localhost:3001');
    });
  })
    .catch((err) => {
    console.error('Unable to connect to the database:', err.message);
  });

app.use(bodyParser.json());

app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
  const newLocal = `
    <h1>Node.js API Server</h1>
    <p>Server running successfully</p>

    <h2>Available API Endpoints:</h2>
    <!--
    <h3>Designations:</h3>
    <ul>
      <li><strong>GET</strong> <a href="/api/designations">/api/designations</a> - Get all designations</li>
    </ul>
    -->

    <h3>Users:</h3>
    <ul>
      <li><strong>POST</strong> <code>/api/users</code> - Register a new user</li>
    </ul>
    <pre>
  curl 
  -X POST http://localhost:3001/api/users \\
  -H "Content-Type: application/json" \\
  -d '
        {"firstName":"John",
        "lastName":"Doe",
        "email":"john@example.com",
        "gender":"Male",
        "password":"yourpassword"}
      '
    </pre>


  `;
  res.send(newLocal);
});


