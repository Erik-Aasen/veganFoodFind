import Axios from "axios"
import { useEffect, useState } from "react"
import API from "../config"

export default function Test() {
    
    const [picture, setPicture] = useState();
    // const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        // console.log(isMounted);

        Axios.get(API + "/test", {
            withCredentials: true
        }).then((res) => {
            // console.log(isMounted);
            // console.log(picture);
            // console.log(res.data);
            // const picture2 = res.data      
            if (isMounted) {
                // console.log(res);
                
                setPicture(res.data)
                // setLoading(false)
            }
        })
        
        return () => { 
            isMounted = false }
        
    }, []);

    // const Afunction = () => {}

    // setPicture(picture2)

    // if (!picture) {
    //     return(null)
    // }
    
    // if (isLoading === false) {}

    return (
        <div>
            {/* <button onClick={Afunction}>Button</button> */}
            <img src={picture} alt="" />
        </div>
    )
}