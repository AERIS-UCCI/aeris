import { useEffect } from 'react';


import Registro from '../pages/Autentication/Registro';

export default function Route(){

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
    <>
        <Registro/>
    </>
    )
}