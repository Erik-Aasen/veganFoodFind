import { PostInterface } from "../Interfaces/Interfaces";
import Meal from "./Meal";


export function display(posts: PostInterface[], myMeal: boolean, adminMeal: boolean) {
    return (
        <>
            {posts.map((post) => {

                const { city, description, meal, restaurant, _id, pictureKey, picture, isApproved } = post;

                return (
                    <Meal
                        key={_id}
                        _id={_id}
                        city={city}
                        description={description}
                        meal={meal}
                        restaurant={restaurant}
                        pictureKey={pictureKey}
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