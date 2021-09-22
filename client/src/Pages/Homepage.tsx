import { useState } from 'react';
// import MealCarousel from '../Components/Carousel'
import HomePageSearch from '../Components/HomePageSearch'
import Axios from 'axios';
// import Meal from '../Components/Meal';
import API from '../config';
import { PostResponse } from '../definitionfile';
import { PostInterface } from '../Interfaces/Interfaces';
import { display } from '../Components/DisplayPosts';

export default function Homepage() {

    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [buttonEnable, setButtonEnable] = useState<string>('enabled')

    const postMeals = (e, city, meal) => {
        setButtonEnable('disabled')
        Axios.post(API + '/getmeals', {
            city, meal
        }, {
            withCredentials: true
        }).then((res: PostResponse) => {
            setPosts(res.data)
            setButtonEnable('enabled')    
        })
        e.preventDefault();        
    }

    return (
        <>
            <div className="homepageSearch">
                <h1>Find Vegan Meals By City</h1>
                <HomePageSearch
                postMeals={postMeals} 
                buttonEnable={buttonEnable}
                />
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    {display(posts, false, false)}
                </div>
            </div>
        </>
    )
}

