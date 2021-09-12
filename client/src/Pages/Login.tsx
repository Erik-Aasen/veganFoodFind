import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import API from '../config'

export default function Login(props) {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    let status;
    if (props.location.state) {
        status = (
        <p className='registered'>
            {props.location.state.registrationStatus}
        </p>
        )
    } else {
        status = undefined;
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
            console.log("Failure");
        })
    }

    // const getUser = () => {
    //     axios.get(API + "/user", {
    //         withCredentials: true
    //     }).then(res => {
    //     })
    // }

    return (
        <div className="login">
            <form className='form-signin'>
                <h1>Login</h1>
                {status}
                <input className="form-control" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <br />
                <input className="form-control" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <br />
                <button className="btn btn-login btn-primary" onClick={e => { login(e) }}>Login</button>
                {/* <button onClick={getUser}>Get User that's logged in</button> */}
            </form>
        </div>
    )
}
