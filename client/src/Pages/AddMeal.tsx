import { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import piexif from 'piexifjs';
import API from '../config'
import { Form } from 'react-bootstrap';

export default function AddMeal() {

    const [restaurant, setRestaurant] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [meal, setMeal] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [picture, setPicture] = useState<string>();
    const [orientation, setOrientation] = useState<number>(8);

    const [errorState, setErrorState] = useState(
        {
            restaurantError: '',
            cityError: '',
            mealError: '',
            descriptionError: '',
            pictureError: ''
        }
    )

    const validate = () => {
        const errors = {
            restaurant: '',
            city: '',
            meal: '',
            description: '',
            picture: ''
        }

        if (!restaurant) { errors.restaurant = 'Please enter a restaurant' }
        if (!city) { errors.city = 'Please enter a city' }
        if (!meal) { errors.meal = 'Please enter a meal' }
        if (!description) { errors.description = 'Please enter a description' }
        if (!picture) { errors.picture = 'Please upload a picture' }


        return errors
    }

    let history = useHistory();

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
            setErrorState(prev => ({
                ...prev,
                pictureError: ''
            }))
        };
        reader.onerror = function (error) {
        };
    }

    const submitMeal = (e) => {

        e.preventDefault();

        const errors = validate();

        if (
            errors.restaurant.length > 0 ||
            errors.city.length > 0 ||
            errors.meal.length > 0 ||
            errors.description.length > 0 ||
            errors.picture.length > 0
        ) {
            setErrorState(prev => ({
                ...prev,
                restaurantError: errors.restaurant,
                cityError: errors.city,
                mealError: errors.meal,
                descriptionError: errors.description,
                pictureError: errors.picture
            }))
        } else {
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
    }

    let pictureFeedback;
    if (errorState.pictureError) {
        pictureFeedback = (
            <>
                <label className='form-feedback'>Please upload an image.</label>
            </>
        )
    }

    return (
        <>
            <div className='add-meal'>
                <h3>Enter a Meal</h3>
                <Form>
                    <Form.Group>
                        <Form.Control
                            type='text'
                            placeholder="Restaurant Name"
                            value={restaurant}
                            onChange={e => {
                                setRestaurant(e.target.value)
                                setErrorState(prev => ({
                                    ...prev,
                                    restaurantError: ''
                                }))
                            }}
                            isInvalid={!!errorState.restaurantError}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {errorState.restaurantError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={e => {
                                setCity(e.target.value)
                                setErrorState(prev => ({
                                    ...prev,
                                    cityError: ''
                                }))
                            }}
                            isInvalid={!!errorState.cityError}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {errorState.cityError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Meal"
                            value={meal}
                            onChange={e => {
                                setMeal(e.target.value)
                                setErrorState(prev => ({
                                    ...prev,
                                    mealError: ''
                                }))
                            }}
                            isInvalid={!!errorState.mealError}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {errorState.mealError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={e => {
                                setDescription(e.target.value)
                                setErrorState(prev => ({
                                    ...prev,
                                    descriptionError: ''
                                }))
                            }}
                            isInvalid={!!errorState.descriptionError}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {errorState.descriptionError}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <input onChange={onDrop} type="file" name="img" id="img"></input>
                        <br />
                        {pictureFeedback}
                        <br />
                        <button className='btn btn-secondary' onClick={e => { rotateMinus(e) }}>Orientation -</button>
                        <button className='btn btn-secondary' onClick={e => { rotatePlus(e) }}>Orientation +</button>
                        <br />
                        <br />
                        <button className="btn btn-success" type="submit" onClick={e => { submitMeal(e) }}>Upload Meal</button>
                        <br />
                        <img className='photo' alt='' src={picture} />
                        <br />
                    </Form.Group>
                </Form>
            </div>
        </>
    )
}

