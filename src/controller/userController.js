const connection = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  try {
    let query = `SELECT * from user`;
    let result = await connection.execute(query);

    res.status(200).json({
      message: "Data feched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error feching Users",
      error: error.message,
    });
  }
};

module.exports = getUser;