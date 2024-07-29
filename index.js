require("dotenv").config(); // Load environment variables from .env file
const server = require("./server"); // Import the server setup

const PORT = process.env.PORT || 5000; // Set the port

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
