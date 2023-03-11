const db = require("@db")

/**
 * Checks if a user is already in the database
 * 
 * @param {String} username 
 * @param {String} email 
 * 
 * 
 * @returns {Boolean} True if user exists, otherwise false.
 */



 const isExistingUser = async (username, email) => {

    const query = `SELECT * FROM "user"
                    WHERE username = $1 AND email = $2;
    
    `

    const { rows } = await db.query(query, [username, email])

    return rows.length > 0;
}


module.exports = isExistingUser;