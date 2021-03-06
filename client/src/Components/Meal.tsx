
import axios from "axios";
// import { useState } from "react";
import { Link } from "react-router-dom";
import {API} from '../config'
import piexif from 'piexifjs'
// import streamToBlob from 'stream-to-blob'

export default function Meal(props) {
    const {
        _id, meal, restaurant,
        city, picture, orientation, description,
        myMeal, adminMeal, isApproved } = props;

    // console.log(orientation);
    

    const zeroth = {};
    zeroth[piexif.ImageIFD.Orientation] = orientation;
    const exifObj = { "0th": zeroth }
    const exifbytes = piexif.dump(exifObj);
    const newJpeg = piexif.insert(exifbytes, picture)

    // console.log(picture);


    // const [picture, setPicture] = useState<string>()

    // useEffect(() => {
    //     axios.get(API + '/api/image/' + pictureKey)
    //         .then(async (res) => {
    //             // console.log(res.data);
    //             // const blob = await streamToBlob(res)

    //             const result = res.data
    //             //   const result = await streamToString(stream)

    //             // const reader = new FileReader();
    //             // await reader.readAsDataURL(result)
    //             // reader.onload = function () {
    //             //     const jpegData = reader.result;
    //             //     // Strip EXIF data of compressed image and set orientation
    //             //     const strippedJpeg = piexif.remove(jpegData)
    //             //     const zeroth = {};
    //             //     zeroth[piexif.ImageIFD.Orientation] = orientation;
    //             //     const exifObj = { "0th": zeroth }
    //             //     const exifbytes = piexif.dump(exifObj);
    //             //     const newJpeg = piexif.insert(exifbytes, strippedJpeg)
    //             setPicture(result)
    //             // }
    //         })
    // })

    const editmeal = {
        pathname: "/editmeal",
        _id: _id,
        meal: meal,
        restaurant: restaurant,
        city: city,
        picture: newJpeg,
        orientation: orientation,
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
                    <img className='card-img-top' alt='' src={newJpeg} />
                    <h5 className='card-title'>{meal}</h5>
                    <p className='card-text'>{restaurant}</p>
                    <p className='card-text'>{city}</p>
                    <p className='card-text'>{description}</p>
                </div>
            </div>
        </div>

    )
}
