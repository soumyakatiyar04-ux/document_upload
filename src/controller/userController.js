const connection = require("../config/db");

const getUser = async (req, res) => {
  try {
    const query = `SELECT user_id, name, email FROM user`;

    const [rows] = await connection.execute(query);

    res.status(200).json({
      message: "Data fetched successfully",
      data: rows
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message
    });
  }
};

module.exports = getUser;