// authController.ts
import { Request, Response } from 'express';
import User, { IUserWithId } from './userModel'; // Ensure IUserWithId is imported here
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Register a new user.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        // Hash the password and save the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user: IUserWithId = { email, password: hashedPassword, _id: 0 }; // Initialize _id to 0 temporarily
        await User.save(user);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
};

/**
 * Log in a user and return a JWT token.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        // Find the user by email
        const user = await User.findOne({ email }) as IUserWithId | null;
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id }, // Access the _id
            process.env.JWT_SECRET as string, // Ensure `JWT_SECRET` is properly typed
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};