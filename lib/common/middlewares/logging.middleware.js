
exports.logResponse = function(req, res, next) {
    var oldWrite = res.write,
    oldEnd = res.end;

    var chunks = [];

    res.write = function (chunk) {
        chunks.push(chunk);

        return oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk) {
            chunks.push(chunk);
        }

        var bodyMsg = '';
        if (chunks.length) {
            try {
                var body = Buffer.concat(chunks).toString('utf8');
                bodyMsg = ` Body: ${body}`;    
    
            } catch (err) {
                bodyMsg = ` Body concat error: ${err}`;
            }
        }
        console.info(`-- Responded: [${req.method}] ${req.path} => [${res.statusCode}]${bodyMsg}`);

        oldEnd.apply(res, arguments);
    };

    next();
};