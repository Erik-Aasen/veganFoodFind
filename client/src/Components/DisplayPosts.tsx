import { PostInterface } from "../Interfaces/Interfaces";
import Meal from "./Meal";


export function display(posts: PostInterface[], myMeal: boolean, adminMeal: boolean) {
    return (
        <>
            {posts.map((post) => {

                const { city, description, meal, restaurant, _id, pictureString, isApproved } = post;

                return (
                    <Meal
                        key={_id}
                        _id={_id}
                        city={city}
                        description={description}
                        meal={meal}
                        restaurant={restaurant}
                        pictureString={pictureString}
                        myMeal={myMeal}
                        isApproved={isApproved}
                        adminMeal={adminMeal}
                    />
                )
            })}
        </>
    )
}