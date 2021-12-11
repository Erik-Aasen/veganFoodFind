import { useState } from "react"
 import { Form, Button } from 'react-bootstrap'

 export default function ResetPassword() {



     return (
         <div className='login'>
             <h1>Reset Password</h1>
             <Form>
                 <Form.Group>
                     <Form.Control
                         type='text'
                         placeholder='Username or email'
                     />
                 </Form.Group>
             </Form>
         </div>
     )



 } 