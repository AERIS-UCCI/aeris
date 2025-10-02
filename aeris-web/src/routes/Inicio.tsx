import { useEffect } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Inicio from '../pages/Inicio';

export default function Route(){

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
    <>
        <Header/>
        <Inicio/>
        <Footer/>
    </>
    )
}