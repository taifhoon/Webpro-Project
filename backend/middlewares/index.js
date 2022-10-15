async function logger(req, res, next) {
    const timestamp = new Date().toISOString().substring(0, 19)
    console.log(`${timestamp} | ${req.method}: ${req.originalUrl}`)
    next()
}
module.exports = {
    logger,
    isLoggedIn
}
const pool = require("../config");

async function isLoggedIn(req, res, next) {
    let authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).send('You are not logged in')
    }

    let [part1, part2] = authorization.split(' ')
    if (part1 !== 'Bearer' || !part2) {
        return res.status(401).send('You are not logged in')
    }

    // Check token
    const [token1] = await pool.query('SELECT * FROM customer_tokens WHERE token = ?', [part2])
    const [token2] = await pool.query('SELECT * FROM admin_tokens WHERE token = ?', [part2])
    const tokens_user = token1[0]
    const tokens_admin = token2[0]
    if (!tokens_user && !tokens_admin) {
        return res.status(401).send('You are not logged in')
    }
    else if (!tokens_admin) {
        var [users] = await pool.query(
            'SELECT cid, c_name, email_id, phone_no FROM customer WHERE cid = ?', [tokens_user.user_id]
        )
        users[0].role = 'user'
    }
    else if (!tokens_user) {
        var [users] = await pool.query(
            'SELECT admin_id, admin_name FROM project_database.admin WHERE admin_id = ?', [tokens_admin.admin_id]
        )
        users[0].role = 'admin'
        users[0].c_name = users[0].admin_name
        users[0].cid = users[0].admin_id
    }

    // Set user


    req.user = users[0]

    next()
}