const db = require('@db')

const userDataController = async (req, res) => {
   let query = `
        SELECT username, profile_image FROM users
        WHERE user_id = $1;
        `

   const { rows } = await db.query(query, [req.user_id])

   res.json({ ...rows[0] })
}

module.exports = { userDataController }
