import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/auth'; // Make sure your server is running on this port

const testAuthService = async () => {
    try {
        // Test user registration
        console.log('Testing user registration...');
        const registerResponse = await axios.post(`${baseUrl}/register`, {
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Register Response:', registerResponse.data);

        // Test user login
        console.log('Testing user login...');
        const loginResponse = await axios.post(`${baseUrl}/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Login Response:', loginResponse.data);

        // Test invalid login
        console.log('Testing invalid login...');
        try {
            await axios.post(`${baseUrl}/login`, {
                email: 'test@example.com',
                password: 'wrongpassword'
            });
        } catch (error) {
            console.log('Invalid Login Response:', error.response.data);
        }

        // Test accessing a protected route (you might need to create this route)
        console.log('Testing protected route...');
        const token = loginResponse.data.token; // Assuming token is returned on successful login
        const protectedResponse = await axios.get(`${baseUrl}/protected`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Protected Route Response:', protectedResponse.data);
        
    } catch (error) {
        console.error('Error testing auth service:', error);
    }
};

testAuthService();