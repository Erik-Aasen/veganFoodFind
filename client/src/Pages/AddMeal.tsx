import { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import piexif from 'piexifjs';
import { API } from '../config'
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
        // console.log(props.location._id);

        initial = {
            _id: props.location._id,
            restaurant: props.location.restaurant,
            city: props.location.city,
            meal: props.location.meal,
            description: props.location.description,
            picture: props.location.picture,
            orientation: props.location.orientation,
            isEditMeal: props.location.isEditMeal
        }
    }

    const _id = initial._id;
    const [restaurant, setRestaurant] = useState<string>(initial.restaurant);
    const [city, setCity] = useState<string>(initial.city);
    const [meal, setMeal] = useState<string>(initial.meal);
    const [description, setDescription] = useState<string>(initial.description);
    const [picture, setPicture] = useState<string>(initial.picture);
    const [orientation, setOrientation] = useState<number>(initial.orientation);
    const [compressedFile, setCompressedFile] = useState<File>(initial.compressedFile)
    const [newPicture, setNewPicture] = useState<boolean>(false)
    const [exifStripped, setExifStripped] = useState<boolean>(false)
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
        // console.log(orientation);

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
        // console.log(orientation);

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
        setNewPicture(true)
        const options = {
            maxSizeMB: .25, // 0.15 might be the best
            maxIteration: 30
        }
        try {
            // Load event target file
            const imageFile = e.target.files[0];

            // Print unmodified EXIF data
            var readerUncompressed = new FileReader();
            await readerUncompressed.readAsDataURL(imageFile);
            readerUncompressed.onload = function () {
                const jpegData = readerUncompressed.result;
                var exifObjInitialUncompressed = piexif.load(jpegData)
                // console.log(exifObjInitialUncompressed);
            }

            // Print original file size
            // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

            // Compress file and print compressed file size
            const compressedFile = await imageCompression(imageFile, options);
            setCompressedFile(compressedFile)
            // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
            // console.log(compressedFile);

            // Load compressed file
            var reader = new FileReader();
            await reader.readAsDataURL(compressedFile);
            // await reader.readAsDataURL(imageFile) //test that it won't load
            reader.onload = function () {
                const jpegData = reader.result;
                // console.log(typeof jpegData);


                // Print EXIF data of compressed image



                // Strip EXIF data of compressed image and set orientation
                var strippedJpeg = piexif.remove(jpegData)
                var zeroth = {};
                zeroth[piexif.ImageIFD.Orientation] = orientation;
                // console.log(orientation);

                var exifObj = { "0th": zeroth }
                var exifbytes = piexif.dump(exifObj);
                var newJpeg = piexif.insert(exifbytes, strippedJpeg)

                var exifObjInitial = piexif.load(newJpeg)
                // console.log(exifObjInitial);
                if (Object.keys(exifObjInitial.GPS).length === 0) {
                    setExifStripped(true)
                }

                Object.keys(exifObjInitial).forEach(key => {
                    // console.log(key, exifObjInitial[key]);

                    if (key !== 'thumbnail') {
                        if (key == '0th') {
                            if (Object.keys(exifObjInitial[key]).length > 1) {
                                setExifStripped(false)
                                // console.log(false, exifObjInitial);
                                // console.log(Object.keys(exifObjInitial[key]).length);
                                
                            }
                        } else {
                            if (Object.keys(exifObjInitial[key]).length > 0) {
                                setExifStripped(false)
                                // console.log(false, key, exifObjInitial);
                            }
                        }
                    }
                })

                // Print EXIF data of compressed image
                // var exifObjCompressed = piexif.load(newJpeg)
                // console.log(exifObjCompressed);

                // Set picture state as compressed and EXIF stripped image
                setPicture(newJpeg)
                setErrorState(prev => ({
                    ...prev,
                    pictureError: ''
                }))
            };
            reader.onerror = function (error) {
            };
        } catch (error) {
        }
    }

    const postImage = async (addOrEdit) => {
        const formData = new FormData();
        formData.append('_id', _id)
        formData.append('restaurant', restaurant)
        formData.append('city', city)
        formData.append('meal', meal)
        formData.append('description', description)
        formData.append('image', compressedFile)
        formData.append('orientation', orientation.toString())
        console.log(exifStripped);

        if (exifStripped) {
            console.log(API);

            await axios.post(API + `/api/${addOrEdit}meal`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then((res) => {
                    if (res.data === "meal added") {
                        history.push('/mymeals');
                    }
                })
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
                if (newPicture) {
                    await postImage('edit')
                } else { //not newPicture
                    await axios.put(API + '/api/editmealinfo', {
                        _id, restaurant, city, meal, description, orientation
                    }, {
                        withCredentials: true
                    }).then((res) => {
                        if (res.data === "meal updated") {
                            history.push({ pathname: '/mymeals' });
                        }
                    })
                }
            } else {
                await postImage('add')
                // await axios.post(API + '/api/addmeal', {
                //     restaurant, city, meal, description, picture: compressedFile
                // }, {
                //     withCredentials: true
                // })
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

