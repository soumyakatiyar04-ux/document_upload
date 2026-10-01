const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/db");

const registerUser = async (req, res) => {
    try {
        const { user_id, name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO user
            (user_id, name, email, password)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await connection.execute(query, [
            user_id,
            name,
            email,
            hashedPassword
        ]);
        res.status(201).json({
            message: "User registered successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = `
            SELECT * FROM user
            WHERE email = ?
        `;
        const [rows] = await connection.execute(query, [email]);

        if (rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const user = rows[0];
        const check = await bcrypt.compare(
            password,
            user.password
        );
        if (!check) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
        res.status(200).json({
            message: "Login successful",
            token: token
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
};

module.exports = {registerUser, loginUser};