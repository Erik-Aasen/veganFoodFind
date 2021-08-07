import React, { useContext } from 'react'
import { myContext } from '../Pages/Context';
import Axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { UserInterface } from '../Interfaces/Interfaces';

export default function AdminPage() {
    const ctx = useContext(myContext);

    const [data, setData] = useState<UserInterface[]>();
    const [selectedUser, setSelectedUser] = useState<any>();

    useEffect(() => {
        
        Axios.get("http://localhost:4000/getallusers", {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setData(res.data.filter((item: any) => {
                return (item.username !== ctx.username)
            }))
            // setData(res.data)
            // console.log(data);
            
            
        })
    }, [ctx.username]); //ADDED CALLBACK TO CLEAR A MEMORY LEAK ERROR UPON HITTING HOME FROM ADMIN PAGE, MIGHT NEED TO DELETE FOR PRODUCTION?

    if (!data) {
        return null;
        
    } else {
        console.log(data);
    }

    const deleteUser = () => {
        let userid: string;
        data.forEach((item: any) => {

            if (item.username === selectedUser) {
                userid = item._id;
            }
        })
        // console.log(userid);

        Axios.post("http://localhost:4000/deleteuser", {
            id: userid!  //! tells react that we know there will be a userid as a string since it will be defined in the if statement. React worries that it might not get defined and then not have the chance to be a string
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data === "user deleted") {
                window.location.href = "/getallusers"
                setSelectedUser('');
                // window.location.href = window.location.href;
                // setTimeout(function(){
                //     window.location.reload();
                //   });
                // history.go(0);
            }
        })       
    }


    return (
        <div>
            <h1>Admin page, only admins can see this.</h1>
            <select onChange={e => setSelectedUser(e.target.value)} name="deleteuser" id="deleteuser">
                <option id="Select a user">Select a user</option>
                {
                    data.map((item: any) => {
                        return (
                            <option key={item._id}id={item.username}>{item.username}</option>
                        )
                    })
                }
            </select>
            <button value={selectedUser} onClick={deleteUser}>Delete</button>
        </div>
    )
}
