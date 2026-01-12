const express = require('express');
const app = express();

//frontend files ko allow karne ke liye
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});