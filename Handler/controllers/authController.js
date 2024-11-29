const prisma = require('../config/prismaClient');
const bcrypt = require('bcrypt');
const prisma = require("../config/prismaClient");
require('dotenv').config();
async function checkConnection() {
    try {
        const users = await prisma.User.findMany();
        console.log("database connection is successful. users: ", users);
    }
    catch (e) {
        console.error(e.message);
    }
}
// checkConnection(); //sucecess

//for searching users

//for generate token
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    return jwt.sign({ userId }, secret, { expiresIn });
}

//register new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, location, expertise } = req.body;

        //check for existing user with arrived details
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        //otherwise hash password
        const hashedPass = await bcrypt.hash(password, 10);

        //create user with arriven details
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                location,
                expertise,
            },
        });

        res.status(200).send({
            success: true,
            message: 'user registered successgully'
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            message: 'problem for registering from api',
            error: err.message
        });
    }
}

//for user login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //find user in database
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        //check password is correct or not
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        //at this point user is validated with his hashed password
        // Generate the token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).send({
            success: true,
            message: 'user logined successfully',
            token: token
        });


    }
    catch (err) {
        res.status(500).send({
            success: false,
            message: 'error for log in user form api',
            error: err.message
        });
    }
}


//getting user profile (it works only if user is authenticated by iddlewares)
exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId; // Retrieved from middleware
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, location: true, expertise: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).send({
            success: true,
            message: 'auth success!',
            data: user
        });
    }
    catch (err) {
        return res.status(403).send({
            success: false,
            message: 'cant get prpofile data auth failed',
            err: err.message
        });
    }
}