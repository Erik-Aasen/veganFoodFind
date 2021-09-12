import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
import { myContext } from '../Pages/Context';
import Axios from "axios";
import { Navbar, Nav, Button } from 'react-bootstrap'
import API from '../config'

export default function NavBar() {
    const ctx = useContext(myContext);

    const logout = () => {
        Axios.get(API + "/logout", {
            withCredentials: true
        }).then((res) => {
            
            if (res.data === "logged out") {
                window.location.href = "/"
                // history.go(0);
                // setTimeout(function () {
                //     window.location.reload();
                // });
            }
        })
    }

    let loginlogout;
    if (ctx) {
        loginlogout = (
            <>
                <Nav.Link href="/adminpage">Admin</Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
                <Nav.Link href="/mymeals">My Meals</Nav.Link>
                {/* <Nav.Link href="/getallusers">Get All Users</Nav.Link> */}
                <Button href="/addmeal" variant="outline-success">Add a Meal</Button>
            </>
        )
    } else {
        loginlogout = (
            <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
                <Button href="/login" variant="outline-success">Login to Add a Meal</Button>
            </>
        )
    }

    return (
        <div>
            <Navbar className='nav' bg="light" expand="lg">
                <Navbar.Brand href="/">Vegan Food Finder</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {loginlogout}
                    </Nav>
                    <br />
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}
