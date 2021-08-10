import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import API from '../config'

export default function Register() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    let history = useHistory();
    
    const register = (e) => {
        e.preventDefault();
        axios.post(API + '/register', {
            username,
            password
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            // console.log(res.data);
            if (res.data === "registered") {
                setUsername("");
                setPassword("");
                // window.location.href = "/login"
                
                history.push('/login');
        }
        })
    }
    
    return (
        <div className="login">
            <form className='form-signin'>
                <h1>Register</h1>
                <input className="form-control" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <br />
                <input className="form-control" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <br />
                <button className="btn btn-login btn-primary" onClick={e => {register(e)}}>Register</button>
                {/* <button onClick={getUser}>Get User that's logged in</button> */}
            </form>
        </div>
    )
}