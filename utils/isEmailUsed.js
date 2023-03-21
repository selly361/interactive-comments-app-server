const db = require("@db")

 const isEmailused = async (email) => {

    const query = `SELECT * FROM users
                    WHERE email = $1;
    `

    const { rows } = await db.query(query, [email])

    return rows.length > 0;
}


module.exports = isEmailused;