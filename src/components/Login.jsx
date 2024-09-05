// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, InputGroup, InputRightElement, Button, useToast, FormControl, FormLabel } from '@chakra-ui/react';
import { useUser } from './UserContext';
import '../components_css/login.css';

function Login() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleClick = () => setShow(!show);

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value.replace(/\s/g, ''));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })



            if (response.ok) {
                const result = await response.json();
                localStorage.setItem("token", result.token)
                localStorage.setItem("user", result.user)
                toast({
                    title: 'Login successful.',
                    description: "You've logged in successfully.",
                    status: 'success',
                    duration: 2000,
                });


                setUser(result.user);
                localStorage.setItem("balance", result.user.amount)

                navigate('/home');
            } else {
                const error = await response.json();
                toast({
                    title: 'Login failed.',
                    description: error.message || 'An error occurred.',
                    status: 'error',
                    duration: 2000,
                });
            }
        } catch (error) {
            toast({
                title: 'Login failed.',
                description: 'An error occurred while trying to log in.',
                status: 'error',
                duration: 2000,
            });
        }
    };

    return (
        <section>
            <div className="login-wp">
                <div className="grdyntbg">
                    <div className="container-fluid">
                        <div className="login-sec mt-5 mb-5">
                            <h4>Login with Game</h4>
                            <form onSubmit={handleSubmit} className='mt-5'>
                                <div className="mb-4">
                                    <FormControl isRequired>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </div>
                                <div className="mb-4">
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
                                            <span onClick={handleClick}>
                                                {show ? 'Hide' : 'Show'}
                                            </span>
                                        </InputRightElement>
                                    </InputGroup>
                                </div>
                                <div className='login-btmcmn'>
                                    <Button type='submit'>Submit</Button>
                                    <Link to="/Register">Register</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
