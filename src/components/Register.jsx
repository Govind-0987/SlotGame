import { Button, Input, FormControl, FormLabel, useToast, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleClick = () => setShow(!show);

    const handleUsernameChange = (e) => {
        // Allow only alphabetic characters and spaces
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setUsername(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
            toast({
                title: 'Registration failed.',
                description: 'All fields are required.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const userData = {
            fullName: trimmedUsername,
            email: trimmedEmail,
            password: trimmedPassword,
        };

        console.log("Submitting the following user data:", userData);

        try {
            const response = await fetch('http://localhost:5000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                toast({
                    title: 'Registration successful!',
                    description: `Welcome, ${username}!`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                navigate('/Login');
            } else if (response.status === 409) {
                const errorData = await response.json();
                toast({
                    title: 'Registration failed.',
                    description: 'A user already exists with this email address.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                const errorData = await response.json();
                console.error("Server responded with an error:", errorData.message);

                toast({
                    title: 'Registration failed.',
                    description: errorData.message || 'Something went wrong.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Network error or something went wrong:", error);

            toast({
                title: 'Error.',
                description: 'Network error or something went wrong.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <section>
            <div className="login-wp">
                <div className="grdyntbg">
                    <div className="container-fluid">
                        <div className="login-sec mt-5 mb-5">
                            <h4>Register with Game</h4>
                            <form className="mt-5" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <FormControl isRequired>
                                        <FormLabel>Full Name</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="User Name"
                                            value={username}
                                            onChange={handleUsernameChange}
                                        />
                                    </FormControl>
                                </div>
                                <div className="mb-4">
                                    <FormControl isRequired>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </FormControl>
                                </div>
                                <div className="mb-4">
                                    <FormControl isRequired>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup size='md'>
                                            <Input
                                                pr='4.5rem'
                                                type={show ? 'text' : 'password'}
                                                placeholder='Password'
                                                value={password}
                                                onChange={handlePasswordChange}
                                                required
                                            />
                                            <InputRightElement width='4.5rem'>
                                                <span onClick={handleClick} style={{ cursor: 'pointer' }}>
                                                    {show ? 'Hide' : 'Show'}
                                                </span>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                </div>
                                <div className="login-btmcmn">
                                    <Button type="submit">Submit</Button>
                                    <Link to="/Login">Login</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;
