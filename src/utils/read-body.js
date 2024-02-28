function readBody(req) {
    return new Promise((resolve) => {
        let data = '';
        req.on('data', newData => {
            data += newData;
        });

        req.on('end', () => {
            resolve(JSON.parse(data));
        });
    });
}

module.exports = {
    readBody,
}
