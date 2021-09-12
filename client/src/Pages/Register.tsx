import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import API from '../config'
import { Error } from '../Interfaces/Interfaces';

export default function Register() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [usernameError, setUsernameError] = useState<Error>({
        error1: 'Set username',
        error2: undefined
    });

    const [passwordError, setPasswordError] = useState<Error>({
        error1: 'Password must be greater than 8 characters',
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

    const usernameFn = (e) => {
        e.preventDefault();
        setUsername(e.target.value)
        if (e.target.value.length >= 1) {
            setUsernameError(prev => ({
                ...prev,
                error1: undefined
            }))
        } else if (e.target.value.length < 1) {
            setUsernameError(prev => ({
                ...prev,
                error1: 'Set username'
            }))
        }
        if (e.target.value.length > 20) {
            setUsernameError(prev => ({
                ...prev,
                error2: 'Username must be less than 20 characters'
            }))
        } else if (e.target.value.length <= 20) {
            setUsernameError(prev => ({
                ...prev,
                error2: undefined
            }))
        }
    }

    const passwordFn = (e) => {
        e.preventDefault();
        setPassword(e.target.value)
        if (e.target.value.length < 8) {
            setPasswordError(prev => ({
                ...prev,
                error1: 'Password must be greater than 8 characters'
            }))
        } else if (e.target.value.length >= 8) {
            setPasswordError(prev => ({
                ...prev,
                error1: undefined
            }))
        }
        if (e.target.value.length > 20) {
            setPasswordError(prev => ({
                ...prev,
                error2: 'Password must be less than 20 characters'
            }))
        } else if (e.target.value.length <= 20) {
            setPasswordError(prev => ({
                ...prev,
                error2: undefined
            }))
        }
    }

    const login = (e) => {
        history.push({
            pathname: '/login',
            state: { registrationStatus: 'Successfully registered. Please log in.' }
        })
    }

    return (
        <div className="login">
            <form className='form-signin'>
                <h1>Register</h1>
                <p className='form-feedback'>{usernameError.error1}</p>
                <p className='form-feedback'>{usernameError.error2}</p>
                <input className="form-control" type="text" placeholder="Username"
                    value={username}
                    onChange={e =>
                        usernameFn(e)
                    } />
                <br />
                <p className='form-feedback'>{passwordError.error1}</p>
                <p className='form-feedback'>{passwordError.error2}</p>
                <input className="form-control" type="password" placeholder="Password"
                    value={password}
                    onChange={e =>
                        passwordFn(e)
                    } />
                <br />
                <button className="btn btn-login btn-primary" onClick={e => { register(e) }}>Register</button>
            </form>
        </div>
    )
}