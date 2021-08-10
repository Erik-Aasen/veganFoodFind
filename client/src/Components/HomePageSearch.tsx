import Axios, { AxiosResponse } from "axios"
import { useEffect, useState } from "react"

export default function HomePageSearch(props) {

    const [city, setCity] = useState("All cities")
    const [meal, setMeal] = useState("All meals")

    const [meals, setMeals] = useState<any>("")
    const [cities, setCities] = useState<any>("")

    const [data, setData] = useState<any>("")

    const filterMeals = (useEffectData) => {
        let unfilteredMeals = useEffectData.map((item: any) => item.meal)
        return ([...new Set(unfilteredMeals)])
    }

    const filterCities = (useEffectData) => {
        let unfilteredCities = useEffectData.map((item: any) => item.city)
        return ([...new Set(unfilteredCities)])
    }

    useEffect(() => {

        async function getMeals() {
            await Axios.get("https://vegan-food-find.herokuapp.com/getmeals", {
                withCredentials: true
            }).then((res: AxiosResponse) => {
                setData(res.data)
                setMeals(filterMeals(res.data))
                setCities(filterCities(res.data))
            })
        }

        getMeals()
    }, []);

    if (!data || !meals || !cities) {
        return null;
    }

    const selectCity = (e: any) => {
        setCity(e.target.value);
        console.log('city: ' + city + ', evt: ' + e.target.value);

        let cityForFiltering = e.target.value;
        // console.log(city); // returns null
        // console.log(cityForFiltering); // returns value

        if (cityForFiltering === "All cities") {
            setMeals(filterMeals(data))
            // setMeal("All meals")

        } else {
            let updatedMeals = data.filter(item => {
                return (item.city === cityForFiltering)
            })
            setMeals(filterMeals(updatedMeals))
            setMeal("All meals")
            console.log('meals filtered');


        }
    }

    const selectMeal = (e: any) => {
        setMeal(e.target.value)
        console.log(e.target.value);
    }

    return (
        <div>
            <form>
                <div className="form-group">
                    <select value={city} onChange={selectCity} className="form-control" id="exampleFormControlSelect1">
                        <option>All cities</option>
                        {
                            cities.map((item: any) => {
                                return (
                                    <option key={item} id={item}>{item}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <select value={meal} onChange={selectMeal} className="form-control" id="exampleFormControlSelect1">
                        <option>All meals</option>
                        {
                            meals.map((item: any) => {
                                return (
                                    <option key={item} id={item}>{item}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <button type="button" className="btn btn-success" onClick={e => props.postMeals(e, city, meal)}>Search</button>
            </form>
            
        </div>
    )
}

