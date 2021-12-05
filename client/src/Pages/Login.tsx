import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import API from '../config'
import { Form, Button } from 'react-bootstrap';

export default function Login(props) {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginFail, setLoginFail] = useState<boolean>();
    const [verified, setVerified] = useState<boolean>(true)
    const [emailSent, setEmailSent] = useState<boolean>(false)

    let status;
    if (props.location.state && !emailSent) {
        // setEmailSent(true)
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

    if (emailSent) {
        status = (
            <>
                <h2 className='registered'>
                    {/* {props.location.state.registrationStatus} */}
                    Almost done...
                </h2>
                <p>We've sent an email to the account email. Open it up to activate your account.</p>
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

    const resendConfirmation = () => {
        axios.post(API + '/api/resendConfirmation', {
            username
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data === 'email sent') {
                setEmailSent(true)
                setVerified(true)
                console.log('ok');
                
            }
        })
    }

    if (!verified && !loginFail) {
        status = (
            <p className='verification-fail'>
                Email is not verified. Please check your email for the verification link or click 
                {/* here  */}
                <button onClick={resendConfirmation}>Here</button>
                to resend verification link.
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

        if (username.length < 1 || password.length < 1) {
            setLoginFail(true)
            return
        }

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
