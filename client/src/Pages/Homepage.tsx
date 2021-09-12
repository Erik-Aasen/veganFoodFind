import { useState } from 'react';
// import MealCarousel from '../Components/Carousel'
import HomePageSearch from '../Components/HomePageSearch'
import Axios from 'axios';
import Meal from '../Components/Meal';
import API from '../config';
import { PostResponse } from '../definitionfile';
import { PostInterface } from '../Interfaces/Interfaces';

export default function Homepage() {

    const [posts, setPosts] = useState([]) as any;

    const postMeals = (e, city, meal) => {
        Axios.post(API + '/getmeals', {
            city, meal
        }, {
            withCredentials: true
        }).then((res: PostResponse) => {
            setPosts(display(res.data))
        })
        e.preventDefault();
    }

    function display(posts: PostInterface[]) {
        return (
            <>
                {posts.map((post) => {
                    const { city, description, meal, restaurant, _id, picture } = post;

                    return (
                        <Meal
                            key={_id}
                            city={city}
                            description={description}
                            meal={meal}
                            restaurant={restaurant}
                            picture={picture}
                        />
                    )
                })}
            </>
        )
    }

    return (
        <>
            <div className="homepageSearch">
                <h1>Find Vegan Meals By City</h1>
                <HomePageSearch postMeals={postMeals} />
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    {posts}
                </div>
            </div>
        </>
    )
}

