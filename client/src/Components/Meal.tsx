
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";

export default function Meal(props) {
    const { _id, meal, restaurant, city, picture, description, myMeal } = props;

    const editmeal = {
        pathname: "/editmeal",
        _id: _id,
        meal: meal,
        restaurant: restaurant,
        city: city,
        picture: picture,
        description: description
    }

    const deleteMeal = () => {

        axios.post('http://localhost:4000/deletemeal', {
            _id
        }, { withCredentials: true }
        ).then((res: AxiosResponse) => {
            if (res.data === "meal deleted") {
                // history.push('/mymeals')
                window.location.reload();
            }
        })

    }

    let editDelete
    if (myMeal) {
        editDelete = (
            <>
                <Link className='btn btn-primary btn-sm align-left' to={editmeal}>Edit</Link>
                <Link className='btn btn-danger btn-sm align-right' to="/mymeals" onClick={deleteMeal}>Delete</Link>
            </>
        )
    }

    return (
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-3">
            <div className="card text-center">
                <div className="card-body">
                    {editDelete}
                    <img className='card-img-top' alt='' src={picture} />
                    <h5 className='card-title'>{meal}</h5>
                    <p className='card-text'>{restaurant}</p>
                    <p className='card-text'>{city}</p>
                    <p className='card-text'>{description}</p>
                </div>
            </div>
        </div>

    )
}
