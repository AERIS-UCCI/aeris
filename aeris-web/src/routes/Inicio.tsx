import { useEffect } from 'react';

import Header from '../components/Header/PrimaryHeader';
import Footer from '../components/Footer/Footer';
import Inicio from '../pages/Landing/Inicio';

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