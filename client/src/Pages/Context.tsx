import React, { useState, useEffect, createContext, PropsWithChildren } from 'react'
import Axios, {AxiosResponse} from "axios";
import { UserInterface } from '../Interfaces/Interfaces';

var API;

if (process.env.NODE_ENV === "development") {
    API = "http://localhost:4000"
} else if (process.env.NODE_ENV === "production") {
    API = "https://vegan-food-find.herokuapp.com"
}

export const myContext = createContext<Partial<UserInterface>>({})

export default function Context(props: PropsWithChildren<any>) {
    const [user, setUser] = useState<UserInterface>()
    useEffect(() => {
        Axios.get(API + "/user", { withCredentials: true }).then((res: AxiosResponse) => {
            setUser(res.data);
        })
    }, [])

    return (
        <myContext.Provider value={user!}>{props.children}</myContext.Provider>
    )
}
