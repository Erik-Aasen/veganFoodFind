import Axios from 'axios';
import { useState, useEffect } from 'react';
import Meal from '../Components/Meal';
import { useContext } from 'react';
import { myContext } from './Context';
import API from '../config'
import { Button } from 'react-bootstrap'
import { PostInterface } from '../Interfaces/Interfaces';

export default function MyMeals() {
    const ctx = useContext(myContext);

    const [posts, setPosts] = useState<PostInterface[]>();

    useEffect(() => {
        Axios.get(API + "/usermeals", {
            withCredentials: true
        }).then((res) => {
            setPosts(res.data);
        })
    }, []);

    if (!posts) {
        return null
    }
    
    function display(posts) {
        return (
            <>
                {posts.map((post: PostInterface) => {

                    const { city, description, meal, restaurant, _id, picture } = post;

                    return (
                        <Meal
                            key={_id}
                            _id={_id}
                            city={city}
                            description={description}
                            meal={meal}
                            restaurant={restaurant}
                            picture={picture}
                            myMeal={true}
                        />
                    )
                })}
            </>
        )
    }

    let addMeal;
    if (display(posts).props.children.length === 0) {
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
                <div className="row justify-content-center">
                    {display(posts)}
                </div>
            </div>
        </>
    )
}

