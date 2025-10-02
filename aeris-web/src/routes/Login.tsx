import { useEffect } from 'react';


import Login from '../pages/Autentication/Login';

export default function Route(){

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
    <>
        <Login/>
    </>
    )
}