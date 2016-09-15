const dbFileName = "bc-instagram.sqlite";
const sqlCreateTableFileName = "create_tables.sql";

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(dbFileName);

var init = false;

// all DB prepare statements
// READ-ONLY statements
const FIND_USER_PS = "SELECT first_name, middle_name, last_name FROM user WHERE user_name = ?";
const FIND_USER_BY_USERNAME_PWD_PS = "SELECT user_name, first_name, middle_name, last_name FROM user WHERE user_name = ? and password = ?";

// CREATE/INSERT prepare statements
const CREATE_USER_PS = "INSERT INTO user (user_name, password, first_name, middle_name, last_name) VALUES (?, ?, ?, ?, ?)";
const CREATE_USER_FOLLOW_PS = "INSERT INTO user_follow (user_name, following_user_name) VALUES (?, ?)";
const CREATE_POST_PS = "INSERT INTO post (post_date, description, author, image, type) values (?, ?, ?, ?, ?)";
const CREATE_POST_COMMENT_PS = "INSERT INTO post_comment (post_id, username, comment_text, comment_date) values (?, ?, ?, ?)";
const CREATE_POST_LIKE_PS = "INSERT INTO post_like (post_id, username) values (?, ?)";

// UPDATE prepare statements
const UPDATE_USER_PS = "UPDATE user SET first_name = ?, middle_name = ?, last_name = ? WHERE user_name = ?";

// DELETE prepare statements
const DELETE_FOLLOWER_PS = "DELETE FROM user_follow WHERE user_name = ? AND following_user_name = ?";


// Main function
module.exports = function (doRunCreateTables = true) {
    if (doRunCreateTables && !this.init) {
        db.serialize(function () {
            loadSqlFile((data) => {
                db.exec(data, (err) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                });
            });
        });
        this.init = true;
    }

    this.isInit = function () {
        return this.init;
    }

    /*
     * return callback(err, row)
     */
    this.verifyUserAndPassword = function (userName, password, callback) {
        db.get(FIND_USER_PS, userName, password, (err, row) => {
            if (err || row == undefined) {
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    }

    /*
     * return callback(err, isSuccess)
     */
    this.insertUser = function (userName, password, firstName, middleName, lastName, callback) {
        db.serialize(() => {
            var stmt = db.prepare(CREATE_USER_PS);
            stmt.run(userName, password, firstName, middleName, lastName, (err) => {
                if (err) {
                    callback(err, false);
                } else {
                    callback(null, true);
            });
            stmt.finalize();
        });
    }

    return this;
}

loadSqlFile = function (callback) {
    var fs = require("fs");
    fs.readFile(sqlCreateTableFileName, "utf-8", (err, data) => {
        if (err != null) {
            throw err;
        } else {
            callback(data);
        }
    });
}