var Admin = require("../api/admin.js");
var Article = require("../api/article.js");

module.exports = {
    login: function (req, res) {
        Admin.match(req.body["username"], req.body["password"], function (result) {
            if (result == 0) {
                Admin.login(req.body["username"], res, function (logged) {
                    if (logged) {
                        res.success({});
                    }
                    else {
                        res.error(4, "Session Log Error");
                    }
                });
            }
            else if (result == 1) {
                res.error(1, "No Such User");
            }
            else if (result == 2) {
                res.error(2, "Incorrect Password");
            }
            else {
                res.error(3, "System Error");
            }
        });
    },
    logout: function (req, res) {
        Admin.logout(res);
        res.success({});
    },
    change_password: function (req, res) {
        if (Admin.isPassword(req.body["new"])) {
            Admin.loggedIn(req, function (logged) {
                if (logged) {
                    Admin.checkPasswordWithSession(req.cookies["session"], req.body["original"], function (correct) {
                        if (correct) {
                            Admin.changePassword(req.cookies["session"], req.body["new"], function (result) {
                                if (result) {
                                    res.success({});
                                }
                                else {
                                    res.error(4, "Database Error");
                                }
                            });
                        }
                        else {
                            res.error(3, "Your Password Is Incorrect");
                        }
                    });
                }
                else {
                    res.error(2, "You Have Not Logged In Yet!");
                }
            });
        }
        else {
            res.error(1, "The Password Does Not Satisfy the Requirement");
        }
    },
    get_article: function (req, res) {
        Admin.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["article"] && req.body["article"] != "") {
                    Article.getAdminArticle(req.body["article"], function (result) {
                        if (result) {
                            res.success(result[0]);
                        }
                        else {
                            res.error(2, "Database Error");
                        }
                    });
                }
                else {
                    res.error(1, "Article Id Required");
                }
            }
            else {
                res.error(1000, "Please Login First");
            }
        });
    },
    change_article_status: function (req, res) {
        Admin.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["article"] && req.body["article"] != "") {
                    Article.exists(req.body["article"], function (exists) {
                        if (exists) {
                            switch (req.body["status"]) {
                                case "0": case "1": case "2":
                                    Article.changeStatus(req.body["article"], parseInt(req.body["status"]), function (success) {
                                        if (success) {
                                            res.success({});
                                        }
                                        else {
                                            res.error(3, "Database Error");
                                        }
                                    });
                                    break;
                                default:
                                    res.error(2, "The Status Is Not Valid");
                                    break;
                            }
                        }
                        else {
                            res.error(1, "This Article Does Not Exist");
                        }
                    });
                }
            }
        });
    },
    submit_article: function (req, res) {
        Admin.loggedIn(req, function (logged) {
            if (logged) {
                if (req.body["AUID"] == "") {
                    Article.newArticle(req.body["title"], req.body["subtitle"], req.body["tags"], req.body["status"], req.body["cover"], req.body["content"], function (success) {
                        if (success) {
                            res.success({});
                        }
                        else {
                            res.error(1, "Database Error");
                        }
                    });
                }
                else {
                    Article.exists(req.body["AUID"], function (exists) {
                        if (exists != undefined) {
                            if (exists) {
                                Article.updateArticle(req.body["AUID"], req.body["title"], req.body["subtitle"], req.body["tags"], req.body["status"], req.body["cover"], req.body["content"], function (success) {
                                    if (success) {
                                        res.success({});
                                    }
                                    else {
                                        res.error(1, "Database Error");
                                    }
                                });
                            }
                            else {
                                res.error(2, "No Such Article Exists");
                            }
                        }
                        else {
                            res.error(1, "Database Error");
                        }
                    });
                }
            }
            else {
                res.error(1000, "please Login First");
            }
        });
    }
}
