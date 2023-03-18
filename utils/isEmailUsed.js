const db = require("@db")

 const isEmailused = async (email) => {

    const query = `SELECT * FROM "user"
                    WHERE email = $2;
    `

    const { rows } = await db.query(query, [email])

    return rows.length > 0;
}


module.exports = isEmailused;