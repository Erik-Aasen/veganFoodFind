import React, { useState, useEffect, createContext, PropsWithChildren } from 'react'
import Axios, { AxiosResponse } from "axios";
import { UserInterface } from '../Interfaces/Interfaces';
import API from '../config'
// var API = 'http://localhost:4000'

export const myContext = createContext<Partial<UserInterface>>({})

export default function Context(props: PropsWithChildren<any>) {
    const [user, setUser] = useState<UserInterface>()
    useEffect(() => {
        Axios.get(API + "/user", { withCredentials: true }).then((res: AxiosResponse) => {
        // Axios.get("https://vegan-food-find.herokuapp.com/user", { withCredentials: true }).then((res: AxiosResponse) => {
            setUser(res.data);
            // console.log(res.data);

        })
    }, [])

    return (
        <myContext.Provider value={user!}>{props.children}</myContext.Provider>
    )
}
