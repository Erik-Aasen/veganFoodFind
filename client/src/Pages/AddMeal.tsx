import { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import piexif from 'piexifjs';
import API from '../config'
import { Form, Button, Spinner } from 'react-bootstrap';
import imageCompression from 'browser-image-compression';

export default function AddMeal(props) {

    let initial;
    if (!props.location._id) {
        initial = {
            _id: '',
            restaurant: '',
            city: '',
            meal: '',
            description: '',
            picture: '',
            orientation: 8,
            isEditMeal: false
        }
    } else {
        initial = {
            _id: props.location._id,
            restaurant: props.location.restaurant,
            city: props.location.city,
            meal: props.location.meal,
            description: props.location.description,
            picture: props.location.picture,
            orientation: 8,
            isEditMeal: props.location.isEditMeal
        }
    }

    const _id = initial._id;
    const [restaurant, setRestaurant] = useState<string>(initial.restaurant);
    const [city, setCity] = useState<string>(initial.city);
    const [meal, setMeal] = useState<string>(initial.meal);
    const [description, setDescription] = useState<string>(initial.description);
    const [picture, setPicture] = useState<string>(initial.picture);
    const [orientation, setOrientation] = useState<number>(8);
    const isEditMeal = initial.isEditMeal;

    const [buttonEnable, setButtonEnable] = useState<string>('enabled')

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

    let pictureFeedback;
    if (errorState.pictureError) {
        pictureFeedback = (
            <>
                <label className='form-feedback'>Please upload an image.</label>
            </>
        )
    }

    let buttonLabel = 'Upload Meal';
    let header = 'Enter a Meal';
    let pressedButtonLabel = ' Adding Meal...'

    if (isEditMeal) {
        buttonLabel = 'Submit Changes'
        header = 'Edit Meal'
        pressedButtonLabel = ' Updating Meal...'
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
        const options = {
            maxSizeMB: .1,
            // maxWidthOrHeight: 1920,
            // useWebWorker: true
        }
        const imageFile = e.target.files[0];

        try {
            const compressedFile = await imageCompression(imageFile, options);
            var reader = new FileReader();
            await reader.readAsDataURL(compressedFile);
            reader.onload = function () {
                const jpegData = reader.result;
                var exifObjInitial = piexif.load(jpegData)
                console.log(exifObjInitial);
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
            // await uploadToServer(compressedFile); // write your own logic
        } catch (error) {
            // console.log(error);
        }


    }

    const submitMeal = async (e) => {
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
            setButtonEnable('disabled')
            if (isEditMeal) {
                await axios.put(API + '/addmeal', {
                    _id, restaurant, city, meal, description, picture
                }, {
                    withCredentials: true
                }).then((res) => {
                    if (res.data === "meal updated") {
                        history.push({ pathname: '/mymeals' });
                    }
                })
            } else {
                await axios.post(API + '/addmeal', {
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
    }



    let button;
    if (buttonEnable === 'enabled') {
        button = (
            <>
                <Button variant='success'
                    onClick={e => { submitMeal(e) }}
                >{buttonLabel}
                </Button>
            </>
        )
    } else if (buttonEnable === 'disabled') {
        button = (
            <>
                <Button variant='success' disabled>
                    <Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                    />{pressedButtonLabel}
                </Button>
            </>
        )
    }

    return (
        <>
            <div className='add-meal'>
                <h3>{header}</h3>
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
                        {button}
                        <br />
                        <img className='photo' alt='' src={picture} />
                        <br />
                    </Form.Group>
                </Form>
            </div>
        </>
    )
}

