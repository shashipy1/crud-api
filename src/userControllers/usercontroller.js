const userModel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";


const signup = async (req, res) => {
    const { username, email, password, phone, confirmPassword } = req.body;

    if (!username || !email || !password || !phone || !confirmPassword) {
        return res.status(400).json({ error: 'Please Fill this all credentials' });
    }

    if (username.length < 5) {
        return res.status(400).json({ error: 'Username should be at least 5 characters long' });
    } else if (!/\d/.test(username)) {
        return res.status(400).json({ error: 'Username should contain at least one digit' });
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        return emailRegex.test(email);
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number. Phone number should have 10 digits.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Password and confirm password do not match' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password should be at least 8 characters long' });
    }

    const isStrongPassword = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]+$/;
        return strongPasswordRegex.test(password);
    };

    if (!isStrongPassword(password)) {
        return res.status(400).json({
            error:
                'Password should contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
        });
    }

    try {
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "User Already Exist" });
        }

        const hashConfirmPassword = await bcrypt.hash(confirmPassword, 10);
        const hashPassword = await bcrypt.hash(password, 10);
        const result = await userModel.create({
            email: email,
            password: hashPassword,
            username: username,
            phone: phone,
            confirmPassword: hashConfirmPassword
        });

        const token = jwt.sign({ email: result.email, id: result.id }, SECRET_KEY);
        res.status(201).json({ user: result, token: token, error: "User Successfully created account"})


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went to wrong" })

    }
}

const signin = async (req, res) => {

    const { email, password } = req.body;

    try {

        const existingUser = await userModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ error: "User Not Found" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({ error: "Invalid Credential" })
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser.id }, SECRET_KEY);
        res.status(200).json({ user: existingUser, token: token, error: "User successfully logged in"})

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went to wrong" })

    }
}

module.exports = { signin, signup }