import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    InputGroup,
    Stack,
    InputLeftElement,
    useToast
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';

const Sidebar = () => {
    const { user, logout } = useUser();
    const {
        isOpen: isAddMoneyOpen,
        onOpen: onAddMoneyOpen,
        onClose: onAddMoneyClose
    } = useDisclosure();
    const {
        isOpen: isLogoutConfirmOpen,
        onOpen: onLogoutConfirmOpen,
        onClose: onLogoutConfirmClose
    } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();


    const [balance, setBalance] = useState(() => {
        const savedBalance = localStorage.getItem('balance');
        return savedBalance ? parseFloat(savedBalance) : 0;
    });

    useEffect(() => {
        localStorage.setItem('balance', balance);
    }, [balance]);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const handleLogoutConfirm = () => {
        handleLogout();
        onLogoutConfirmClose();
        toast({
            title: 'Logged out.',
            description: "You've successfully logged out.",
            status: 'info',
            duration: 5000,
            isClosable: true,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('money'));
    
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
    
            const response = await fetch('http://localhost:5000/user/addMoney', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({ money: amount, email: user.email })
            });
    
            if (response.ok) {
                const result = await response.json();
    
                
                localStorage.setItem("balance", result.amount);
                setBalance(result.amount);
    
                toast({
                    title: 'Money added.',
                    description: `Successfully added $${amount}.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
    
            } else {
                throw new Error('Network response was not ok');
            }
    
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'Failed to add money.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    
        onAddMoneyClose();
    };
    

    return (
        <div className="sidebar-wp">
            <ul>
                <li>
                    <h4>😎 {user ? user.fullName : 'Guest'}</h4>
                </li>
                <li>
                    💸 ${localStorage.getItem("balance")}
                </li>
                <li>
                    <button onClick={onAddMoneyOpen}>🏦 Add Money</button>

                    <Modal isOpen={isAddMoneyOpen} onClose={onAddMoneyClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>🏦 Add Money</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={4} className='mb-3'>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents='none'>
                                                $
                                            </InputLeftElement>
                                            <Input
                                                name="money"
                                                type="number"
                                                placeholder="Money"
                                                min="0" required
                                                onKeyDown={(e) => {
                                                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </InputGroup>
                                    </Stack>
                                    <Button className='cmnbtn' type='submit'>Submit</Button>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </li>
                <li>
                    <button onClick={onLogoutConfirmOpen}>↪️ Logout</button>

                    <Modal isOpen={isLogoutConfirmOpen} onClose={onLogoutConfirmClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Confirm Logout</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <p>Are you sure you want to log out?</p>
                                <Button colorScheme='blue' mr={3} onClick={handleLogoutConfirm}>
                                    Yes, Logout
                                </Button>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
