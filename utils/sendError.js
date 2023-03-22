module.exports = function(res, status, message, code) {
    return res.status(status).json({ error: message, code: code });
}
  