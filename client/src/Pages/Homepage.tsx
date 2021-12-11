import { useState, useEffect } from 'react';
import HomePageSearch from '../Components/HomePageSearch'
import Axios from 'axios';
import API from '../config';
import { PostResponse } from '../definitionfile';
import { PostInterface } from '../Interfaces/Interfaces';
import { display } from '../Components/DisplayPosts';
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

        if (reset || !allPostsLoaded) {
            if (reset) { setAllPostsLoaded(false) }
            setButtonEnable('disabled')
            setIsLoading(true)

            await Axios.post(API + '/api/getmeals', {
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
                }
                setButtonEnable('enabled')
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
        const handleScroll = (e) => {
            if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
                setIsLoading(true)
                if (allPostsLoaded) { setIsLoading(false) }
                setSkip(skip + 3)
                postMeals(e, city, meal, skip + 3, false)
            }
        }

        if (apiHit && !isLoading) {
            window.addEventListener('scroll', handleScroll)
        }

        return () => {
            window.removeEventListener('scroll', handleScroll)
            // console.log('unmounted');
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
            <div className="container">
                <div className="row justify-content-center page-bottom">
                    {display(posts, false, false)}
                    {spinner}
                </div>
            </div>
        </div>
    )
}

