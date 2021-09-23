module.exports = (req, res) => {
    const { name = 'World' } = req.query;
    const code = req.body.code ? req.body.code : '';
    res.status(200).json({
        eval_result: `${eval(code)}`,
        hello: `${name}`
    });
  };