const db = require('@db')

const isUsernameUsed = async (username) => {
   const query = `SELECT * FROM users
                    WHERE LOWER(username) = LOWER($1);
    `

   const { rows } = await db.query(query, [username])

   return rows.length > 0
}

module.exports = isUsernameUsed
