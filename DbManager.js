const dbFileName = "bc-instagram.sqlite";
const sqlCreateTableFileName = "create_tables.sql";

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(dbFileName);

var init = false;

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
        db.get("SELECT * FROM user WHERE user_name = ? and password = ?", userName, password, (err, row) => {
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
            var stmt = db.prepare("INSERT INTO user (user_name, password, first_name, middle_name, last_name) VALUES (?, ?, ?, ?, ?)");
            stmt.run(userName, password, firstName, middleName, lastName, (err) => {
                if (err) {
                    callback(err, false);
                } else {
                    callback(null, true);
                }
            });
            stmt.finalize();
        });
    }

    /*
     * return callback(err, isSuccess)
     */
    this.insertPost = function (authorUserName, binaryImage, imageType, description, callback) {
        db.serialize(() => {
            var stmt = db.prepare("INSERT INTO post (author, image, type, description, post_date) VALUES (?, ?, ?, ?, ?)");
            stmt.run(authorUserName, binaryImage, imageType, description, Date.now(), (err) => {
                if (err) {
                    callback(err, false);
                } else {
                    callback(null, true);
                }
            });
            stmt.finalize();
        });
    }

    /*
     * return callback(err, rows)
     */
    this.getPostsByUserName = function (userName, callback) {
        db.all("SELECT * FROM post WHERE author = ?", userName, (err, rows) => {
            if (err || rows == undefined) {
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    /*
     * return callback(err, row)
     */
    this.getPostById = function (id, callback) {
        db.get("SELECT * FROM post WHERE post_id = ?", id, (err, row) => {
            if (err || row == undefined) {
                callback(err, null);
            } else {
                callback(null, row);
            }
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