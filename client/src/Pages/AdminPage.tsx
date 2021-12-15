import React, { useContext } from 'react'
import { myContext } from '../Pages/Context';
import Axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { PostInterface, UserInterface } from '../Interfaces/Interfaces';
import {API} from '../config'
import { PostResponse, UserResponse } from '../definitionfile';
import { display } from '../Components/DisplayPosts';

export default function AdminPage() {
    const ctx = useContext(myContext);

    const [users, setUsers] = useState<UserInterface[]>();
    const [selectedUser, setSelectedUser] = useState<string>();
    const [posts, setPosts] = useState<PostInterface[]>();

    useEffect(() => {

        Axios.get(API + "/getallusers", {
            withCredentials: true
        }).then((res: UserResponse) => {
            setUsers(res.data.filter((item) => {
                return (item.username !== ctx.username)
            }))
        })

        Axios.get(API + "/adminmeals", {
            withCredentials: true
        }).then((res: PostResponse) => {
            setPosts(res.data);
        })        

    }, [ctx.username]);

    if (!users || !posts) {
        return null;
    }

    const deleteUser = () => {
        let userid: object;
        users.forEach((item) => {

            if (item.username === selectedUser) {
                userid = item._id;
            }
        })

        Axios.post(API + "/deleteuser", {
            _id: userid!  //! tells ts that we know there will be a userid as a string since it will be defined in the if statement. Ts worries that it might not get defined and then not have the chance to be a string
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data === "user deleted") {
                window.location.href = "/adminpage"
                setSelectedUser('');
            }
        })
    }

    const displayUsers = (users) => {
        return (
            <>
                <select onChange={e => setSelectedUser(e.target.value)} name="deleteuser" id="deleteuser">
                    <option id="Select a user">Select a user</option>
                    {
                        users.map((item: any) => {
                            return (
                                <option key={item._id} id={item.username}>{item.username}</option>
                            )
                        })
                    }
                </select>
            </>
        )
    }

    const sendEmail = () => {
        Axios.post(API + '/email', {}, {withCredentials: true})
        .then((res) => {
            if (res.data === 'ok') {
                console.log('ok');
                
            } 
        })
    }


    return (
        <div>
            <h1>Admin page</h1>
            <div className='myMeals'>
                {displayUsers(users)}
                <button value={selectedUser} onClick={deleteUser}>Delete</button>
                <button onClick={sendEmail}>Send email</button>
            </div>
            <div className='container'>
                <div className="row justify-content-center">
                    {display(posts, false, true)}
                </div>
            </div>
        </div>
    )
}
