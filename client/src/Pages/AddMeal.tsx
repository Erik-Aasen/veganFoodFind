import { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
// import ImageUploader from 'react-images-upload';
// import {compress, compressAccurately} from 'image-conversion';
// import * as imageConversion from 'image-conversion';
import piexif from 'piexifjs';
import API from '../config'

export default function AddMeal() {

    const [restaurant, setRestaurant] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [meal, setMeal] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [picture, setPicture] = useState<string>();

    const [orientation, setOrientation] = useState<number>(8);

    let history = useHistory();

    // THIS WORKS
    // const onDrop = async (e) => {
    //     var reader = new FileReader();
    //     await reader.readAsDataURL(e.target.files[0]);
    //     reader.onload = function () {
    //         setPicture(reader.result)
    //     };
    //     reader.onerror = function (error) {
    //     };
    // }

    const rotateMinus = (e) => {
        e.preventDefault();
        if (orientation > 1) {
            setOrientation(orientation - 1)
            var zeroth = {};
            zeroth[piexif.ImageIFD.Orientation] = orientation - 1;
            var exifObj = { "0th": zeroth }
            var exifbytes = piexif.dump(exifObj);
            var newJpeg = piexif.insert(exifbytes, picture)
            setPicture(newJpeg)
        } else if (orientation === 1) {
            setOrientation(8)
            zeroth = {};
            zeroth[piexif.ImageIFD.Orientation] = 8;
            exifObj = { "0th": zeroth }
            exifbytes = piexif.dump(exifObj);
            newJpeg = piexif.insert(exifbytes, picture)
            setPicture(newJpeg)
        }
    }

    const rotatePlus = (e) => {
        e.preventDefault();
        if (orientation < 8) {
            setOrientation(orientation + 1)
            var zeroth = {};
            zeroth[piexif.ImageIFD.Orientation] = orientation + 1;
            var exifObj = { "0th": zeroth }
            var exifbytes = piexif.dump(exifObj);
            var newJpeg = piexif.insert(exifbytes, picture)
            setPicture(newJpeg)
        } else if (orientation === 8) {
            setOrientation(1)
            zeroth = {};
            zeroth[piexif.ImageIFD.Orientation] = 1;
            exifObj = { "0th": zeroth }
            exifbytes = piexif.dump(exifObj);
            newJpeg = piexif.insert(exifbytes, picture)
            setPicture(newJpeg)
        }
    }

    const onDrop = async (e) => {
        var reader = new FileReader();
        await reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
            const jpegData = reader.result;
            var strippedJpeg = piexif.remove(jpegData)
            var zeroth = {};
            zeroth[piexif.ImageIFD.Orientation] = orientation;
            var exifObj = { "0th": zeroth }
            var exifbytes = piexif.dump(exifObj);
            var newJpeg = piexif.insert(exifbytes, strippedJpeg)
            setPicture(newJpeg)
        };
        reader.onerror = function (error) {
        };
    }

    const submitMeal = (e) => {

        e.preventDefault();
        axios.post(API + '/addmeal', {
            restaurant, city, meal, description, picture
        }, {
            withCredentials: true
        }).then((res) => {
            if (res.data === "meal added") {
                history.push('/mymeals');
            }
        })
    }

    return (
        <>
            <div className='add-meal'>
                <h3>Enter a Meal</h3>
                <form>
                    <div className="form-group">
                        <input className="form-control"
                            type="text"
                            placeholder="Restaurant Name"
                            value={restaurant}
                            onChange={e => setRestaurant(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input className="form-control"
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input className="form-control"
                            type="text"
                            placeholder="Meal Name"
                            value={meal}
                            onChange={e => setMeal(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="img">Upload Image!</label>
                        <br />
                        <input onChange={onDrop} type="file" name="img" id="img"></input>

                        {/* <ImageUploader
                        withIcon={true}
                        buttonText='Choose image'
                        onChange={onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                        singleImage={true}
                    /> */}
                        <br />
                        <br />
                        <button className='btn btn-secondary' onClick={e => { rotateMinus(e) }}>Orientation -</button>
                        <button className='btn btn-secondary' onClick={e => { rotatePlus(e) }}>Orientation +</button>
                        <br />
                        <br />
                        <button className="btn btn-success" type="submit" onClick={e => { submitMeal(e) }}>Upload Meal</button>
                        <br />
                        <img className='photo' alt='' src={picture} />
                        <br />
                    </div>
                </form>
            </div>
        </>
    )
}

