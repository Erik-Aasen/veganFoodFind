import { Spinner } from 'react-bootstrap'

export default function LoadingSpinner() {
    // const spinner = (
    return (
        <>
            <div className='myMeals-loading'>
                <Spinner
                    as='span'
                    animation='border'
                    role='status'
                />
                <br />
                Loading Meals...
            </div>
        </>
        // )
    )
}