import axios from "axios"
import { useEffect, useState } from "react"
import API from "../config"

export default function Test() {
    
    const [picture, setPicture] = useState();

    useEffect(() => {
        axios.get(API + "/test", {
            withCredentials: true
        }).then((res) => {
            setPicture(res.data)
        })
    }, [])
    
    return (
        <div>
            <img src={picture} alt="" />
        </div>
    )
}