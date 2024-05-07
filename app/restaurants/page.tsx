import { Suspense } from "react";
import Restaurants from "./_components/restaurant";

const RestaurantsPage = () => {


    return (
        <Suspense>
            <Restaurants />
        </Suspense>
    );
}
 
export default RestaurantsPage;