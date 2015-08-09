/**
 * This module interacts with the database table mapmarkers to grab all values related to stores
 */

var db = require('../db')

/**
 * Grabs all the markers from the database
 * @param  {Array[]} parameters to search db with
 * @param  {Function} cb callback function to handle returned data
 */
exports.fetchAll = function(parameters, cb){
	db.query('SELECT storeId, latitude, longitude, total_visitors from mapmarkers', parameters, cb);
}

/**
 * Grab data for one specific store
 * @param  {Array[id]} parameters to search db with speicifc id
 * @param  {Function} cb callback function to handle returned data
 */
exports.fetchStore = function(parameters, cb){
	db.findOne("SELECT * FROM mapmarkers WHERE storeId = $1;", parameters, cb);
}