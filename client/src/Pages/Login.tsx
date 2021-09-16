import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import API from '../config'
import { Form, Button } from 'react-bootstrap';

export default function Login(props) {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginFail, setLoginFail] = useState<boolean>();

    let status;
    if (props.location.state) {
        status = (
            <p className='registered'>
                {props.location.state.registrationStatus}
            </p>
        )
    }

    if (loginFail) {
        status = (
            <p className='login-fail'>
                Either username or password is incorrect.
                <br />
                Please try again.
            </p>
        )
    }

    const usernameFn = (e) => {
		setUsername(e);
		setLoginFail(false);
	}

    const passwordFn = (e) => {
		setPassword(e);
		setLoginFail(false);
	}


    const login = async (e) => {
        e.preventDefault();
        await axios.post(API + '/login', {
            username,
            password
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data === "logged in") {
                window.location.href = "/"
            }
        }, () => {
            setLoginFail(true);
        })
    }

    return (
        <div className='login'>
            <h1>Login</h1>
            {status}
            <Form>
                <Form.Group>
                    <Form.Control
                        type='text'
                        placeholder='Username'
                        onChange={e => usernameFn(e.target.value)}
                        isInvalid={!!loginFail}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Control
                        type='password'
                        placeholder='Password'
                        onChange={e => passwordFn(e.target.value)}
                        isInvalid={!!loginFail}
                    />
                </Form.Group>
                <Button onClick={e => { login(e) }}>Submit</Button>
            </Form>
        </div>
    )
}
