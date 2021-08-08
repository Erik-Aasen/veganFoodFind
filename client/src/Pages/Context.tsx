import React, { useState, useEffect, createContext, PropsWithChildren } from 'react'
import Axios, {AxiosResponse} from "axios";
import { UserInterface } from '../Interfaces/Interfaces';

export const myContext = createContext<Partial<UserInterface>>({})

export default function Context(props: PropsWithChildren<any>) {
    const [user, setUser] = useState<UserInterface>()
    useEffect(() => {
        Axios.get("https://vegan-food-find.herokuapp.com/user", { withCredentials: true }).then((res: AxiosResponse) => {
            setUser(res.data);
        })
    }, [])

    return (
        <myContext.Provider value={user!}>{props.children}</myContext.Provider>
    )
}
