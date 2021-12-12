
import axios from "axios";
import { Link } from "react-router-dom";
import API from '../config'

export default function Meal(props) {
    const {
        _id, meal, restaurant,
        city, pictureKey, description,
        myMeal, adminMeal, isApproved } = props;

    const editmeal = {
        pathname: "/api/editmeal",
        _id: _id,
        meal: meal,
        restaurant: restaurant,
        city: city,
        pictureKey: pictureKey,
        description: description,
        isEditMeal: true
    }

    const deleteMeal = () => {
        axios.put(API + '/api/deletemeal', {
            _id
        }, { withCredentials: true }
        ).then((res) => {
            if (res.data === "meal deleted") {
                window.location.reload();
            }
        })
    }

    const approveMeal = () => {
        axios.put(API + '/adminmeals', {
            _id
        }, {
            withCredentials: true
        }).then((res) => {
            if (res.data === "meal approved") {
                window.location.reload()
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

    let approvalNotice;
    if (!isApproved) {
        approvalNotice = (
            <>
                <h5 className="card-subtitle mb-2 text-muted">
                    This meal is waiting to be approved by a moderator.
                </h5>
            </>
        )
    }

    let approveDelete
    if (adminMeal) {
        approveDelete = (
            <>
                <Link className='btn btn-success btn-sm align-left' to="/adminpage" onClick={approveMeal}>Approve</Link>
                <Link className='btn btn-danger btn-sm align-right' to="/adminpage" onClick={deleteMeal}>Delete</Link>
            </>
        )
    }

    return (
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-xs-3">
            <div className="card text-center">
                <div className="card-body">
                    {approvalNotice}
                    {editDelete}
                    {approveDelete}
                    <img className='card-img-top' alt='' src={API + '/api/image/' + pictureKey} />
                    <h5 className='card-title'>{meal}</h5>
                    <p className='card-text'>{restaurant}</p>
                    <p className='card-text'>{city}</p>
                    <p className='card-text'>{description}</p>
                </div>
            </div>
        </div>

    )
}
