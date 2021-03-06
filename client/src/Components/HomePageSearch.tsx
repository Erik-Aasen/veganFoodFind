import Axios from "axios"
import { useEffect, useState } from "react"
import {API} from '../config'
import { CityMealResponse } from "../definitionfile"
import { CityMeal } from "../Interfaces/Interfaces"
import { Button, Spinner } from "react-bootstrap"

export default function HomePageSearch(props) {

    const [city, setCity] = useState("All cities")
    const [meal, setMeal] = useState("All meals")

    const [meals, setMeals] = useState<string[]>()
    const [cities, setCities] = useState<string[]>()

    const [data, setData] = useState<CityMeal[]>()

    const [buttonEnable, setButtonEnable] = useState<string>('enabled')

    const filterMeals = (useEffectData: CityMeal[]) => {
        let unfilteredMeals = useEffectData.map((item) => item.meal)
        let filteredMeals = [...new Set(unfilteredMeals)];
        filteredMeals.sort()
        return (filteredMeals)
    }

    const filterCities = (useEffectData: CityMeal[]) => {
        let unfilteredCities = useEffectData.map((item) => item.city)
        let filteredCities = [...new Set(unfilteredCities)];
        filteredCities.sort();
        return (filteredCities)
    }

    useEffect(() => {
        Axios.get(API + "/getmeals", {
            withCredentials: true
        }).then((res: CityMealResponse) => {
            setData(res.data)
            setMeals(filterMeals(res.data))
            setCities(filterCities(res.data))
        })
    }, []);

    useEffect(() => {
        setButtonEnable(props.buttonEnable)
    }, [props.buttonEnable])

    if (!data || !meals || !cities) {
        return null;
    }

    const selectCity = (e) => {
        setCity(e.target.value);

        let cityForFiltering: string = e.target.value;

        if (cityForFiltering === "All cities") {
            setMeals(filterMeals(data))

        } else {
            let updatedMeals = data.filter(item => {
                return (item.city === cityForFiltering)
            })
            setMeals(filterMeals(updatedMeals))
            setMeal("All meals")

        }
    }

    const selectMeal = (e) => {
        setMeal(e.target.value)
    }

    function listCities(cities: string[]) {
        return (
            <>
                <option>All cities</option>
                {
                    cities.map((item) => {
                        return (
                            <option key={item} id={item}>{item}</option>
                        )
                    })
                }
            </>
        )
    }

    function listMeals(meals: string[]) {
        return (
            <>
                <option>All meals</option>
                {
                    meals.map((item) => {
                        return (
                            <option key={item} id={item}>{item}</option>
                        )
                    })
                }
            </>
        )
    }

    let button;
    if (buttonEnable === 'enabled') {
        button = (
            <>
                <Button variant='success'
                    onClick={e => {
                        props.postMeals(e, city, meal, 0, true)
                    }}
                >Search
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
                    /> Searching...
                </Button>
            </>
        )
    }

    return (
        <div>
            <form>
                <div className="form-group">
                    <select value={city} onChange={selectCity} className="form-control" id="exampleFormControlSelect1">
                        {listCities(cities)}
                    </select>
                </div>
                <div className="form-group">
                    <select value={meal} onChange={selectMeal} className="form-control" id="exampleFormControlSelect1">
                        {listMeals(meals)}
                    </select>
                </div>
                {button}
            </form>

        </div>
    )
}

