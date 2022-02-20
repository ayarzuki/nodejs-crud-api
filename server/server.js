const express = require('express');
const app = express();
const PORT = 3000;
const router = require('./router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(PORT, () => {
	console.log('server running on ' + PORT);
});
