import React, { useEffect } from 'react'
import List1 from '../Components/List1'
import { useParams } from 'react-router-dom'
import API from '../utils/api';

const FindShops = () => {

    const [laundries  , setLaundries] = React.useState([]);
    

    useEffect( ()=>{
        const getLaundries = async ()=>{
            try {
                const res = await API.get("/laundries");
                setLaundries(res.data);
            }
                catch (error) {
                console.error("Error fetching laundries:", error);
                }
        }
        //getLaundries(); 
    }, [])

    
    return (
        <main>
            <div className='container mx-auto'>
                <List1 laundries={laundries} />
            </div>
        </main>
    )
}

export default FindShops
