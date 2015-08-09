/**
 * Module that handles interaction with postgres and error handling
 */

'use strict'
var pg = require('pg')

//all our postgres parameters
var databaseParameters = {
    user: '',
    password: '',
    database: '',
    host: 'localhost',
    port: '5432'
}

module.exports = {

    /**
     * general function that allows you to run any custom query with parameters
     * @param  {String} text is our custom query we want to run against postgres
     * @param  {Array} values are the parameters we want to interpolate with our query
     * @param  {Function} cb callback function handle returned value (usually the Model)
     */
    query: function(text, values, cb) {
        pg.connect(databaseParameters, function(err, client, done) {
            if (err) {
                console.log({
                    message: 'db crash',
                    text: text,
                    values: values
                });
                process.exit(1);
            } else {
                client.query(text, values, function(err, result) {
                    done();
                    if (err) {
                        console.log({
                            message: 'database error',
                            text: text,
                            values: values,
                            err: err
                        });
                        cb(err);
                    } else if (!result || !result.hasOwnProperty('rows')) {
                        var error = {
                            error: 'No rows property',
                            result: result
                        };
                        console.log(error);
                        cb(error);
                    } else {
                        cb(err, result.rows);
                    }
                });
            }
        });
    },

    /**
     * function that allows you to run any custom query but returns only one result
     * @param  {String} text is our custom query we want to run against postgres
     * @param  {Array} values are the parameters we want to interpolate with our query
     * @param  {Function} cb callback function handle returned value (usually the Model)
     */
    findOne: function(text, values, cb) {
        this.query(text, values, function(err, rows) {
            if (err) {
                cb(err);
            } else if (rows.length > 0) {
                cb(err, rows[0]);
            } else {
                cb({
                    noRows: true
                });
            }
        });
    }
};