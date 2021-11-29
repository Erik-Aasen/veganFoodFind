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
import LoadingSpinner from '../Components/Spinner';

export default function Homepage() {

    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [buttonEnable, setButtonEnable] = useState<string>('enabled')

    const [skip, setSkip] = useState(0);
    const [city, setCity] = useState();
    const [meal, setMeal] = useState();
    const [apiHit, setApiHit] = useState(false)
    const [allPostsLoaded, setAllPostsLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)



    const postMeals = async (e, city, meal, skip, reset) => {
        setSkip(skip)
        setCity(city)
        setMeal(meal)
        setApiHit(true)

        // wait = true;

        if (reset || !allPostsLoaded) {
            if (reset) { setAllPostsLoaded(false) }
            setButtonEnable('disabled')
            console.log('posting');
            setIsLoading(true)

            await Axios.post(API + '/getmeals', {
                city, meal, skip
            }, {
                withCredentials: true
            }).then((res: PostResponse) => {
                setIsLoading(false)
                if (reset) {
                    setPosts(res.data)
                } else {
                    setPosts(posts.concat(res.data))
                    if (res.data.length < 3) {
                        setAllPostsLoaded(true)
                    }
                    // console.log(res.data);
                }
                setButtonEnable('enabled')
                // wait = false;

            })
        }
        e.preventDefault();
    }

    useEffect(() => {
        if (!apiHit) {
            setIsLoading(false)
        }
    }, [apiHit])

    useEffect(() => {
        // var wait = false;
        // var isMounted = true
        console.log(('isMounted'));

        const handleScroll = (e) => {
            console.log(document.body.scrollHeight - window.innerHeight - window.scrollY);
            if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
                // setIsLoading(true)
                // wait = true
                setIsLoading(true)
                if (allPostsLoaded) { setIsLoading(false) }
                // setTimeout(() => {
                    console.log('bottom')
                    setSkip(skip + 3)
                    postMeals(e, city, meal, skip + 3, false)
                // }, 100);

            }
        }

        if (apiHit && !isLoading) {
            // if (allPostsLoaded === false) {
            // if (isLoading === false) {
            console.log('allPostsLoaded: ' + allPostsLoaded);

            window.addEventListener('scroll', handleScroll)

            // window.onscroll = (e) => {

            // if (wait === false) {

            // }
            // }
            // }
        }

        return () => {
            window.removeEventListener('scroll', handleScroll)
            console.log('unmounted');
        }
    });

    let spinner;
    if (isLoading) {
        spinner = LoadingSpinner()
    }


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
                    {spinner}
                </div>
            </div>

            {/* </div> */}
        </div>
    )
}

