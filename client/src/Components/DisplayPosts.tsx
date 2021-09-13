import { PostInterface } from "../Interfaces/Interfaces";
import Meal from "./Meal";


export function display(posts: PostInterface[], myMeal: boolean, adminMeal: boolean) {
    return (
        <>
            {posts.map((post) => {

                const { city, description, meal, restaurant, _id, picture, isApproved } = post;

                return (
                    <Meal
                        key={_id}
                        _id={_id}
                        city={city}
                        description={description}
                        meal={meal}
                        restaurant={restaurant}
                        picture={picture}
                        myMeal={myMeal}
                        isApproved={isApproved}
                        adminMeal={adminMeal}
                    />
                )
            })}
        </>
    )
}