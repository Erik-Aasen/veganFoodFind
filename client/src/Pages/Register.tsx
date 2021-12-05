import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import API from '../config'
import { FormError } from '../Interfaces/Interfaces';
import { Form, Button } from 'react-bootstrap';
import { RegisterInterface } from '../Interfaces/Interfaces';

export default function Register() {

	let history = useHistory();

	const [state, setState] = useState<RegisterInterface>(
		{
			email: '',
			username: '',
			password: '',
			emailError: '',
			usernameError: '',
			passwordError: ''
		}
	);

	function looksLikeMail(str: string) {
		const lastAtPos = str.lastIndexOf('@');
		const lastDotPos = str.lastIndexOf('.');
		return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') === -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
	}

	const validate = () => {
		const errors: FormError = {
			email: '',
			username: '',
			password: ''
		};

		if (!state.email) { errors.email = 'Please enter a valid email address' }
		if (!looksLikeMail(state.email)) {errors.email = 'Please enter a valid email address'}
		
		if (!state.username) { errors.username = 'Please enter a username' }
		if (state.username) {
			if (state.username.length > 20) {
				errors.username = 'Username cannot be greater than 20 characters'
			}
		}
		
		if (!state.password) { errors.password = 'Please enter a password' }
		if (state.password) {
			if (state.password.length < 8) { errors.password = 'Password must be greater than 8 characters' }
			if (state.password.length > 20) { errors.password = 'Password must be less than 20 characters' }
		}



		return errors;
	}

	const register = (e) => {
		e.preventDefault()
		const errors = validate();
		if (errors.email.length > 0 || errors.username.length > 0 || errors.password.length > 0) {
			setState(prev => ({
				...prev,
				emailError: errors.email,
				usernameError: errors.username,
				passwordError: errors.password
			}))
		} else {
			axios.post(API + '/api/register', {
				email: state.email,
				username: state.username,
				password: state.password
			}, {
				withCredentials: true
			}).then((res) => {
				console.log(res.data);

				if (res.data === "registered") {
					setState(prev => ({
						...prev,
						username: '',
						password: ''
					}))
					login(e)
				} else if (res.data === 'User already exists') {
					setState(prev => ({
						...prev, usernameError: 'Please choose a different username'
					}))
				} else if (res.data === 'email already registered') {
					setState(prev => ({
						...prev, emailError: 'Email already used for an existing account'
					}))
				}
			})
		}
	}

	const login = (e) => {
		history.push({
			pathname: '/api/login',
			state: { 
				email: state.email }
		})
	}

	return (
		<div className='login'>
			<h1>Register</h1>
			<Form>
				<Form.Group>
					<Form.Control
						type='email'
						placeholder='Email'
						onChange={e => setState(prev => ({
							...prev,
							email: e.target.value,
							emailError: ''
						}))}
						isInvalid={!!state.emailError}
					/>
					<Form.Control.Feedback type='invalid'>
						{state.emailError}
					</Form.Control.Feedback>
				</Form.Group>
				<Form.Group>
					<Form.Control
						type='text'
						placeholder='Username'
						onChange={e => setState(prev => ({
							...prev,
							username: e.target.value,
							usernameError: ''
						}))}
						isInvalid={!!state.usernameError}
					/>
					<Form.Control.Feedback type='invalid'>
						{state.usernameError}
					</Form.Control.Feedback>
				</Form.Group>
				<Form.Group>
					<Form.Control
						type='password'
						placeholder='Password'
						onChange={e => setState(prev => ({
							...prev,
							password: e.target.value,
							passwordError: ''
						}))}
						isInvalid={!!state.passwordError}
					/>
					<Form.Control.Feedback type='invalid'>
						{state.passwordError}
					</Form.Control.Feedback>
				</Form.Group>
				<Button onClick={e => { register(e) }}>Submit</Button>
			</Form>
		</div>
	)
}