import React from 'react'
import './Home.scss';
import NewNavbar from 'CommonModules/NavBar/NewNavbar';
import Banner from './HomeComp/Banner';
import ComplineceProcess from './HomeComp/ComplineceProcess';
import CounterSection from './HomeComp/CounterSection';
import TaskSection from './HomeComp/TaskSection';
import WhyChoose from './HomeComp/WhyChoose';
import Footer from './HomeComp/Footer';
import ExpertSection from './HomeComp/ExpertSection';



function Home() {
  return (
    <>  

    <NewNavbar/>
    <Banner/>
    
    <TaskSection/>
    <ComplineceProcess/>
    <CounterSection/>
    {/* <WhyChoose/> */}
    <Footer/>

    </>
  )
}

export default Home;