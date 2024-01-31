const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

//serve static files from the current directory
app.use(express.static(__dirname));

//serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});