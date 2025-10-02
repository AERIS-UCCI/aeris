import { useEffect } from 'react';


import Perfil from '../pages/HealthTech/Perfilsalud';

export default function Route(){

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
    <>
        <Perfil/>
    </>
    )
}