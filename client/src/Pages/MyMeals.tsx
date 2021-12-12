import Axios from 'axios';
import { useState, useEffect } from 'react';
// import Meal from '../Components/Meal';
import { useContext } from 'react';
import { myContext } from './Context';
import API from '../config'
import { Button } from 'react-bootstrap'
import { PostInterface } from '../Interfaces/Interfaces';
import { PostResponse } from '../definitionfile';
import { display } from '../Components/DisplayPosts';
import LoadingSpinner from '../Components/Spinner';

export default function MyMeals() {
    const ctx = useContext(myContext);

    const [posts, setPosts] = useState<PostInterface[]>([]);
    // const [buttonEnable, setButtonEnable] = useState<string>('enabled')
    const [skip, setSkip] = useState(0);
    const [allPostsLoaded, setAllPostsLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const initialSkip = 0

    useEffect(() => {
        Axios.post(API + "/api/usermeals", {
            initialSkip
        }, {
            withCredentials: true
        }).then((res: PostResponse) => {
            setPosts(res.data);
            setIsLoading(false)
        })
    }, []);

    const postMeals = (e, skip, reset) => {
        setSkip(skip)
        // setCity(city)
        // setMeal(meal)
        // setApiHit(true)

        if (!allPostsLoaded) {
            // if (reset) {setAllPostsLoaded(false)}
            // setButtonEnable('disabled')
            // console.log('posting');
            setIsLoading(true)

            Axios.post(API + '/api/usermeals', {
                skip
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
                // setButtonEnable('enabled')
            })
        }
        e.preventDefault();
    }

    useEffect(() => {
        // if (apiHit) {
        // if (allPostsLoaded === false) {
        // console.log(allPostsLoaded);
        // console.log(('isMounted'));


        const handleScroll = (e) => {
            if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {

                // setTimeout(() => {
                setIsLoading(true)
                if (allPostsLoaded) { setIsLoading(false) }
                // console.log('bottom')
                setSkip(skip + 3)
                postMeals(e, skip + 3, false)
                // }, 1000);

            }
        }

        if (!isLoading) {
            window.addEventListener('scroll', handleScroll)
        }

        return () => {
            window.removeEventListener('scroll', handleScroll)
            // console.log('unmounted');
        }


        // window.onscroll = (e) => {
        // console.log('ok');
        // console.log(window.scrollY, window.innerHeight, document.body.scrollHeight);


        // }
        // }
        // }
    });

    if (posts === []) {
        return (LoadingSpinner())
        // return()
    }

    let spinner;
    if (isLoading) {
        spinner = LoadingSpinner()
    }

    let addMeal;
    if (!isLoading) {
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
                    {spinner}
                </div>
            </div>
        </>
    )
}

