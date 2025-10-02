import { useEffect } from 'react';


import Rutas from '../pages/HealthTech/PlanificadorRutas';

export default function Route(){

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
    <>
        <Rutas/>
    </>
    )
}