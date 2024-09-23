import "./help.scss";
import NewNavbar from 'CommonModules/NavBar/NewNavbar';
import React from 'react';
import Footer from '../HomeComp/Footer';


function HelpPage() {

    const AccordianData = [
        {title: 'How can i manange my task ?',desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit tellus consequat sit mattis. Quis maecenas condimentum elit, vitae. Elementum urna nunc et mi, auctor in. A, vel congue venenatis nam sit.' },
        {title: 'How can i manange my task ?',desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit tellus consequat sit mattis. Quis maecenas condimentum elit, vitae. Elementum urna nunc et mi, auctor in. A, vel congue venenatis nam sit.' },
        {title: 'How can i manange my task ?',desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit tellus consequat sit mattis. Quis maecenas condimentum elit, vitae. Elementum urna nunc et mi, auctor in. A, vel congue venenatis nam sit.' },
        {title: 'How can i manange my task ?',desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit tellus consequat sit mattis. Quis maecenas condimentum elit, vitae. Elementum urna nunc et mi, auctor in. A, vel congue venenatis nam sit.' },
        {title: 'How can i manange my task ?',desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit tellus consequat sit mattis. Quis maecenas condimentum elit, vitae. Elementum urna nunc et mi, auctor in. A, vel congue venenatis nam sit.' },
        {title: 'How can i manange my task ?',desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit tellus consequat sit mattis. Quis maecenas condimentum elit, vitae. Elementum urna nunc et mi, auctor in. A, vel congue venenatis nam sit.' },
        {title: 'How can i manange my task ?',desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit tellus consequat sit mattis. Quis maecenas condimentum elit, vitae. Elementum urna nunc et mi, auctor in. A, vel congue venenatis nam sit.' },
        {title: 'How can i manange my task ?',desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit tellus consequat sit mattis. Quis maecenas condimentum elit, vitae. Elementum urna nunc et mi, auctor in. A, vel congue venenatis nam sit.' },
        {title: 'How can i manange my task ?',desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit tellus consequat sit mattis. Quis maecenas condimentum elit, vitae. Elementum urna nunc et mi, auctor in. A, vel congue venenatis nam sit.' },
    ]
  return (
    <>
        <NewNavbar/>

        <div className="help-center-page" >


        <div className="bg-gradient mb-4"  >
            <h1 className="headingPricing">Help</h1>
            <div className='mx-auto' >

            <div className="input-group mb-3 search-box">
            <input
                type="text"
                className="form-control"
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
            />
            <div className="input-group-append ">
                <button className="input-group-text search-btn" id="basic-addon2"> Search </button>
            </div>
            </div>

            </div>
        </div>
    
        <div className="container" style={{minHeight: '100vh'}} >
            <h2 className="section-title">Frequently Asked Questions</h2>



            <div id="accordion"  >

                {AccordianData.map((item,index)=>(

                <div className="card accordion-card" >
                    <div className="card-header" id={"headingOne_"+index}>
                        <div className="d-flex" data-toggle="collapse"
                                data-target={"#collapseOne_"+index}
                                aria-expanded="true"
                                aria-controls="collapseOne" >

                            <span className="counts"> {index+1} </span>
                            <h5 className="mb-0 pointer card-title"   > {item.title} </h5>


                        </div>
                    
                    </div>
                    <div  id={"collapseOne_"+index} className="collapse show" aria-labelledby={"headingOne_"+index} data-parent="#accordion" >
                        <div className="card-body">
                            <p>{item.desc}</p>
                        </div>
                    </div>
                </div>
                ))}
            </div>


            <div className="footer-section" >
                <h3 className="footer-title">Still have question ?</h3>
                <p className="footer-desc">If you can not find answer to your question in our FAQ, you can always contact us , We will answer to you shortly !</p>
            </div>
        </div>


        </div>
        <Footer/>

    </>
  )
}

export default HelpPage