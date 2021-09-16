import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import API from '../config'
import { FormError } from '../Interfaces/Interfaces';
import { Form, Button } from 'react-bootstrap';

export default function Register() {
	// const [username, setUsername] = useState<string>("");
	// const [password, setPassword] = useState<string>("");

	// const [usernameError, setUsernameError] = useState<Error>({
	// 	// error1: 'Set username',
	// 	error1: undefined,
	// 	error2: undefined
	// });

	// const [passwordError, setPasswordError] = useState<Error>({
	// 	// error1: 'Password must be greater than 8 characters',
	// 	error1: undefined,
	// 	error2: undefined
	// });




	let history = useHistory();

	// const register = (e) => {

	// 	e.preventDefault();

		// axios.post(API + '/register', {
		// 	username,
		// 	password
		// }, {
		// 	withCredentials: true
		// }).then((res) => {
		// 	if (res.data === "registered") {
		// 		setUsername("");
		// 		setPassword("");
		// 		login(e)
		// 	} else if (res.data === 'User already exists') {
		// 		setUsernameError(prev => ({
		// 			...prev,
		// 			error2: 'Username already exists'
		// 		}))
		// 	}
		// })
	// }


	const login = (e) => {
		history.push({
			pathname: '/login',
			state: { registrationStatus: 'Successfully registered. Please log in.' }
		})
	}

	// const [form, setForm] = useState({
	// 	username: undefined,
	// 	password: undefined
	// })
	// const [errors, setErrors] = useState({
	// 	// username: undefined,
	// 	// password: undefined
	// })

	const [username, setUsername] = useState<string>();
	const [password, setPassword] = useState<string>();

	const [usernameError, setUsernameError] = useState<string>();
	const [passwordError, setPasswordError] = useState<string>();

	// const setField = (field, value) => {
	// 	setForm({
	// 		...form,
	// 		[field]: value
	// 	})
	// }

	const usernameFn = (e) => {
		setUsername(e);
		setUsernameError(undefined);
	}

	const passwordFn = (e) => {
		setPassword(e);
		setPasswordError(undefined);
	}

	const validate = () => {
		const errors: FormError = {};

		if (!username) { errors.username = 'Please enter a username' }
		if (username) {
			if (username.length > 20) {
				errors.username = 'Username cannot be greater than 20 characters'
			}
		}
		if (!password) { errors.password = 'Please enter a password'}
		if (password) {
			if (password!.length < 8) { errors.password = 'Password must be greater than 8 characters'}
			if (password!.length > 16) { errors.password = 'Password must be less than 16 characters'}
		}

		return errors;
	}

	const register = (e) => {
		e.preventDefault()
		const errors = validate();
		if (Object.keys(errors).length > 0) {
			setUsernameError(errors.username);
			setPasswordError(errors.password);
		} else {
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
					// setUsernameError(prev => ({
					// 	...prev,
					// 	error2: 'Username already exists'
					// }))
					setUsernameError('User already exists');
				}
			})
		}
	}

	return (
		<div className='login'>
			<h1>Register</h1>
			<Form>
				<Form.Group>
					<Form.Label>Username</Form.Label>
					<Form.Control
						type='text'
						onChange={e => usernameFn(e.target.value)}
						isInvalid={!!usernameError}
					/>
					<Form.Control.Feedback type='invalid'>
						{usernameError}
					</Form.Control.Feedback>
				</Form.Group>
				<Form.Group>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='text'
						onChange={e => passwordFn(e.target.value)}
						isInvalid={!!passwordError}
					/>
					<Form.Control.Feedback type='invalid'>
						{passwordError}
					</Form.Control.Feedback>
				</Form.Group>
				<Button onClick={e => { register(e)}}>Submit</Button>
			</Form>
		</div>
	)
}