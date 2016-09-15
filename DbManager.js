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
     * return user object if found and null if not
     */
    this.verifyUserAndPassword = function (userName, password, callback) {
        db.get("SELECT * FROM user WHERE user_name = ? and password = ?", userName, password, (err, row) => {
            if (err || row == undefined) {
                callback(null);
            } else {
                callback(row);
            }
        });
    }

    /*
     * return "true" if successfully insert data and "false" if not
     */
    this.insertUser = function (userName, password, firstName, middleName, lastName, callback) {
        db.serialize(function () {
            var stmt = db.prepare("INSERT INTO user (user_name, password, first_name, middle_name, last_name) VALUES (?, ?, ?, ?, ?)");
            stmt.run(userName, password, firstName, middleName, lastName, (err) => {
                if (err) {
                    console.log(err);
                }
                callback(!err ? true : false);
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