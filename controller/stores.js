/**
 * Store Controller interfaces with store model and handles all calbacks to the view
 */

var Stores = require('../models/stores')

/**
 * Calls the Store model and handles callback to grab all store markers
 * @return {Array[json]} returns a json object with all marker data
 */
exports.fetchAll = function(req, res, next){
	Stores.fetchAll([], function(err, results){
	    if(err){
	    	console.log("error")
	    } else {
	    	res.json(results)
	    }
	})
}

/**
 * Calls the Store model and handles callback to grab specific store data
 * @return {Array[json]} returns a json object with store data
 */
exports.fetchStore = function(req, res, next){
	parameters = [req.params._id]
	Stores.fetchStore(parameters, function(err, results){
	    if(err){
	    	console.log("error")
	    } else {
	    	res.json(results)
	    }
	})
}