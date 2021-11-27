import { useState, useEffect } from 'react';
// import MealCarousel from '../Components/Carousel'
import HomePageSearch from '../Components/HomePageSearch'
import Axios from 'axios';
// import Meal from '../Components/Meal';
import API from '../config';
import { PostResponse } from '../definitionfile';
import { PostInterface } from '../Interfaces/Interfaces';
import { display } from '../Components/DisplayPosts';
// import InfiniteScroll from 'react-infinite-scroll-component';

export default function Homepage() {

    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [buttonEnable, setButtonEnable] = useState<string>('enabled')

    const [skip, setSkip] = useState(0);
    const [city, setCity] = useState();
    const [meal, setMeal] = useState();
    const [apiHit, setApiHit] = useState(false)

    const postMeals = (e, city, meal, skip, reset) => {
        setSkip(skip)
        setCity(city)
        setMeal(meal)
        setApiHit(true)
        setButtonEnable('disabled')
        Axios.post(API + '/getmeals', {
            city, meal, skip
        }, {
            withCredentials: true
        }).then((res: PostResponse) => {
            if (reset) {
                setPosts(res.data)    
            } else {
                setPosts(posts.concat(res.data))
                // console.log(res.data);
            }            
            setButtonEnable('enabled')
        })
        e.preventDefault();
    }

    useEffect(() => {
        if (apiHit) {
            window.onscroll = (e) => {
                if (window.scrollY + window.innerHeight === document.body.scrollHeight) {
                    console.log('bottom')
                    setSkip(skip + 3)
                    postMeals(e, city, meal, skip+3, false)
                }
            }
        }

    });


    return (
        <div>
            <div className="homepageSearch">
                <h1>Find Vegan Meals By City</h1>
                <HomePageSearch
                    postMeals={postMeals}
                    buttonEnable={buttonEnable}
                />
            </div>
            {/* <InfiniteScroll
                dataLength={posts.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
            
            >



            </InfiniteScroll> */}
            <div className="container">
                <div className="row justify-content-center page-bottom">
                    {display(posts, false, false)}
                </div>
            </div>

            {/* </div> */}
        </div>
    )
}

