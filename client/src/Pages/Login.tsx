import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import API from '../config'
import { Form, Button } from 'react-bootstrap';

export default function Login(props) {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginFail, setLoginFail] = useState<boolean>();
    const [verified, setVerified] = useState<boolean>(true)

    let status;
    if (props.location.state) {
        const email = props.location.state.email
        status = (
            <>
                <h2 className='registered'>
                    {/* {props.location.state.registrationStatus} */}
                    Almost done...
                </h2>
                <p>We've sent an email to {email}. Open it up to activate your account.</p>
                <p className='registered2'>Check your spam folder!</p>
            </>
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

    if (!verified && !loginFail) {
        status = (
            <p className='login-fail'>
                Email is not verified. Please click here to resend verification link.
            </p>
        )
    }

    const usernameFn = (e) => {
        setUsername(e);
        setLoginFail(false);
        setVerified(true)
    }

    const passwordFn = (e) => {
        setPassword(e);
        setLoginFail(false);
    }


    const login = async (e) => {
        e.preventDefault();
        await axios.post(API + '/api/login', {
            username,
            password
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data === 'logged in') {
                window.location.href = "/"
            }
            if (res.data === 'not verified') {
                setVerified(false)
            }
            if (res.data === 'username password incorrect') {
                setLoginFail(true)
            }
        }
            //      () => {
            //     setLoginFail(true);
            // }
        )
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
