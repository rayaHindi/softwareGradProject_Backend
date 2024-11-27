// index.js
const app = require('./app');  // Import the Express app
const db = require('./config/db'); // Import database connection
const PORT = 3000;
//const UserModel = require('./model/user.model')

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// index.js -> app.js -> router -> controller -> service

