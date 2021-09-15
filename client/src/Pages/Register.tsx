import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import API from '../config'
import { Error } from '../Interfaces/Interfaces';
import { Form, Button } from 'react-bootstrap';

export default function Register() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [usernameError, setUsernameError] = useState<Error>({
		// error1: 'Set username',
		error1: undefined,
		error2: undefined
	});

	const [passwordError, setPasswordError] = useState<Error>({
		// error1: 'Password must be greater than 8 characters',
		error1: undefined,
		error2: undefined
	});

	let history = useHistory();

	const register = (e) => {

		e.preventDefault();

		axios.post(API + '/register', {
			username,
			password
		}, {
			withCredentials: true
		}).then((res) => {
			if (res.data === "registered") {
				setUsername("");
				setPassword("");
				login(e)
			} else if (res.data === 'User already exists') {
				setUsernameError(prev => ({
					...prev,
					error2: 'Username already exists'
				}))
			}
		})
	}


	const login = (e) => {
		history.push({
			pathname: '/login',
			state: { registrationStatus: 'Successfully registered. Please log in.' }
		})
	}

	return (
		<div 
		className= 'd-flex flex-column align-items-center'
		>
			<h1>Register</h1>
			<Form style={{ width: '350px' }}>
				<Form.Group>
					<Form.Label>Name</Form.Label>
					<Form.Control type='text' />
				</Form.Group>
				<Form.Group>
					<Form.Label>Password</Form.Label>
					<Form.Control type='text' />
				</Form.Group>
				<Button type='submit'>Submit</Button>
			</Form>
		</div>
	)
}