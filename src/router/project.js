var Project = require("../api/project");

module.exports = function (req, res, callback) {
    Project.getProjects(function (projects) {
        callback({
            "projects": projects
        });
    })
}
