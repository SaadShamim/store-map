var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var storeController = require('./controller/stores'); 

/**
 * set the view engine to embedded javascript
 * use /public as the static folder
 */
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

//index page
app.get('/', function(req, res) {
	res.render('index')
})

//grabs all store markers
app.get('/stores', storeController.fetchAll)

//grabs data for one store
app.get('/stores/:_id', storeController.fetchStore)

app.listen(port, function() {
 	console.log("Listening on " + port);
})