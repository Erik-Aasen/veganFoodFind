import Axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import Meal from '../Components/Meal';
// import { UserInterface } from '../Interfaces/Interfaces'
import { useContext } from 'react';
import { myContext } from './Context';
import API from '../config'
import { Button } from 'react-bootstrap'

export default function MyMeals() {
    const ctx = useContext(myContext);

    const [posts, setPosts] = useState<any>();

    useEffect(() => {

        Axios.get(API + "/usermeals", {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setPosts(display(res.data));
        })
    });

    if (!posts) {
        return null
    }

    function display(posts) {
        return (
            <>
                {posts.map((post: any) => {
                    let city, description, meal, restaurant, _id, picture;
                    ({ city, description, meal, restaurant, _id, picture } = post);

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

    let addMeal
    if (posts.props.children.length === 0) {
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
                    {posts}
                </div>
            </div>
        </>
    )
}

