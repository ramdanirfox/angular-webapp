var os = require('os');

module.exports = (req, res) => {
    const { name = 'World' } = req.query;
    res.status(200).json({
        osinfo: `${os.type()}__${os.release()}__${os.platform()}`,
        query: req.query,
        cookies: req.cookies,
        body: req.body
    });
  };