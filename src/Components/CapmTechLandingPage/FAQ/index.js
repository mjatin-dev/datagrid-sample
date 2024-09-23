import NewNavbar from 'CommonModules/NavBar/NewNavbar'
import React from 'react'
import FooterNew from "Components/ComplianceLandingPage/HomeComp/Footer";
import FAQ from './FAQ';

function index() {
  return (
    <div style={{background:"#f9f9f9"}}>
        <NewNavbar/>
        <FAQ/>
        <FooterNew/>
    </div>
  )
}

export default index