var restify = require('restify');
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;

var db = mongojs('test1', ['groups', 'students']);

// Server
var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

//server.use(restify.fullResponse());
//server.use(restify.CORS({origins: ['127.0.0.1:8080']}));

server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'accept, origin, X-Requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Allow', 'DELETE, PUT, POST, OPTIONS, GET');

    next();
    }
 );

server.listen(3000, function () {
    console.log("Server started @ 3000");
});


server.opts('/student', function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'OPTIONS, DELETE, POST, PUT, GET');
    res.send(204);
    return next();
})

server.get("/groups", function (req, res, next) {
    db.groups.find(function (err, groups) {
        
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(err));
        }
        else {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(groups));    
        }
    });
    return next();
});

server.post('/group', function (req, res, next) {
    var group = req.params;
    db.groups.save(group,
        function (err, data) {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(err));
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));    
            }
        });
    return next();
});


server.get("/students", function (req, res, next) {
    db.students.find({ group: req.params.id },{}, {limit: req.params.count}, function (err, students) {
        
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(err));
        }
        else {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(students));    
        }
    });
    return next();
});


server.post('/student', function (req, res, next) {
    var student = req.params;
    db.students.save(student,
        function (err, data) {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(err));
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));    
            }
        });
    return next();
});

server.put('/student', function (req, res, next) {
    db.students.update(
        {_id: ObjectId(req.params.id)},
        {$set: {fullname: req.params.fullname}},
        function (err, data) {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(err));
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));    
            }
        }
    );
    return next();
});

server.del('/student', function (req, res, next) {
    db.students.remove({
        _id: ObjectId(req.params.id)
    }, function (err, data) {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(err));
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(true));    
            }
    });
    return next();
});
