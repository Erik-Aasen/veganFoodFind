import { useState } from "react"
import { Form, Button } from 'react-bootstrap'

export default function ResetPassword() {

    const [usernameEmail, setUsernameEmail] = useState<string>('')

    const changePassword = async (e) => {
        console.log(usernameEmail);
    }

    return (
        <div className='login'>
            <h1>Reset Password</h1>
            <p className='verification-fail text-primary'>Enter your username or email to receive a link in your inbox to reset your password.</p>
            <Form>
                <Form.Group>
                    <Form.Control
                        type='text'
                        placeholder='Username or email'
                        onChange={e => setUsernameEmail(e.target.value)}
                    />
                </Form.Group>
            </Form>
            <br />
            <Button onClick={e => { changePassword(e) }}>Submit</Button>
        </div>
    )



}