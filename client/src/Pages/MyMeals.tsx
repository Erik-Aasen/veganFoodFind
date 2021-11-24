import Axios from 'axios';
import { useState, useEffect } from 'react';
// import Meal from '../Components/Meal';
import { useContext } from 'react';
import { myContext } from './Context';
import API from '../config'
import { Button, Spinner } from 'react-bootstrap'
import { PostInterface } from '../Interfaces/Interfaces';
import { PostResponse } from '../definitionfile';
import { display } from '../Components/DisplayPosts';

export default function MyMeals() {
    const ctx = useContext(myContext);

    const [posts, setPosts] = useState<PostInterface[]>();

    useEffect(() => {
        Axios.get(API + "/usermeals", {
            withCredentials: true
        }).then((res: PostResponse) => {
            setPosts(res.data);
        })
    }, []);

    const spinner = (
        <>
        <div className='myMeals-loading'>
        <Spinner
                as='span'
                animation='border'
                role='status'
            />
            <br />
            Loading Meals...
        </div>
        </>
    )

    if (!posts) {
        return spinner
    }

    let addMeal;
    if (display(posts, true, false).props.children.length === 0) {
        addMeal = (
            <>
                <div className='add-meal-prompt'>
                    <h5>You haven't added any meals yet!</h5>
                    <Button href="/addmeal" variant="outline-success">Add a Meal</Button>
                </div>
            </>
        )
    }

    return (
        <>
            <div className='myMeals'>
                <h1>{ctx.username}'s Meals</h1>
            </div>
            {addMeal}
            <div className='container'>
                <div className="row justify-content-center page-bottom">
                    {display(posts, true, false)}
                </div>
            </div>
        </>
    )
}

