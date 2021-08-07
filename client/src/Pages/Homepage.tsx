import { useState } from 'react';
// import MealCarousel from '../Components/Carousel'
import HomePageSearch from '../Components/HomePageSearch'
import Axios, { AxiosResponse } from 'axios';
import Meal from '../Components/Meal';


export default function Homepage() {

    const [posts, setPosts] = useState<any>("");

    const postMeals = (e, city, meal) => {
        Axios.post('http://localhost:4000/getmeals', {
            city, meal
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setPosts(display(res.data))
        })
        e.preventDefault();
    }

    function display(posts) {
        return (
            <>
                {posts.map((post: any) => {
                    const { city, description, meal, restaurant, _id, picture } = post

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

