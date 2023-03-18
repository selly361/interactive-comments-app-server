const db = require("@db")

 const isUsernameUsed = async (username) => {

    const query = `SELECT * FROM "user"
                    WHERE username = $2;
    `

    const { rows } = await db.query(query, [username])

    return rows.length > 0;
}


module.exports = isUsernameUsed;