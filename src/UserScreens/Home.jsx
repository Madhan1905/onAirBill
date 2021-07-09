import React from 'react';

//images
import background from '../Images/BG_1.jpg';

// components
import Header from '../UserComponents/Header';
//scss
import '../Styles/home.scss'

const Home = () => {
    return (
        <>
        <Header />
        <div id="homeContainer">
            <div className="main-content">
                <div className="home-content">
                    {/* <img src={background} className="background" width="100%" /> */}
                    <h2>GST Billing Software For</h2>
                    <h2>Every Bussiness</h2>
                    <button className="button-style mt-4">GET STARTED</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Home;