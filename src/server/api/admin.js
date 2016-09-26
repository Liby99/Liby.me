/**
 *
 */

var crypto = require("../module/crypto.js");
var mysql = require("../module/mysql.js");
var util = require("../module/util.js");

module.exports = {
    
    /**
     * Check if the user has logged in
     * @param req, the request object
     * @callback boolean. True for logged in, False for not logged in.
     */
    loggedIn: function (req, callback) {
        if (req.cookies.session) {
            mysql.query("SELECT * FROM `user` WEHRE `session` = ?", [
                req.cookies.session
            ], function (err, result) {
                if (!err) {
                    if (result.length > 0) {
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                }
                else {
                    console.error(err);
                    callback(false);
                }
            });
        }
        else {
            callback(false);
        }
    },
    
    /**
     * Check if the user name matches the password
     * @param username, the login username
     * @param password, the login password
     * @callback an integer. 0 for success, 1 for no such user, 2 for password incorrect, 3 for internal error
     */
    match: function (username, password, callback) {
        mysql.query("SELECT * FROM `user` WHERE ?", {
            "username": username
        }, function (err, result) {
            if (!err) {
                if (result.length > 0) {
                    if (crypto.match(password, result[0]["password"])) {
                        callback(0);
                    }
                    else {
                        callback(2);
                    }
                }
                else {
                    callback(1);
                }
            }
            else {
                console.log(err);
                callback(3);
            }
        }, false);
    },
    
    /**
     *
     * @param  {[type]}   username [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    login: function (username, callback) {
        var session = util.UUID();
        mysql.query("UPDATE `user` SET `session_start` = NOW(), ?", {
            "session": session
        }, function (err, result) {
            if (err) {
                console.error(err);
                callback(undefined);
            }
            else {
                callback(session);
            }
        });
    },
    
    /**
     *
     */
    logout: function () {
        
    }
}
