import React, { Fragment } from 'react';
import user from "../../../../src/assets/Images/home/user.png";
import call from "../../../../src/assets/Images/home/24x7.png";
import person from "../../../../src/assets/Images/home/person.png";

const DataLoop = [
        {title: 'Experienced \n Team',img:person},
        {title: '24/7 \n Service',img:call},
        {title: 'Technology & \n System',img:user},
]

const replaceWithBr = (str) => {
    const lines = str.split(/\n/);
    const withBreaks = lines.flatMap((line, index) =>
      index > 0
        ? [<br key={`br-${index}`} />, <Fragment key={index}>{line}</Fragment>]
        : [line]
    );
    return withBreaks
  };

function WhyChoose() {
  return (
    <>
        <section className="section-wrapper py-5 why-choose-us" >
                <h2 className="section-title text-center">Why choose us</h2>
                <div className="bg-sectiojn" style={{padding:'50px',marginBottom:'-50px',background:'#F4F3FF'}} > </div>
                <div className="container" >
                    <div className="row" >
                        {DataLoop.map((item)=>(
                            <div className='col-md-4 col-4 '>
                                <div className="contact-card shadow p-3 mb-5 bg-body rounded
                                
                                ">
                                    <img src={item.img}  alt="icon"  className="img-rounded icon"/>
                                    <h3 className="contact-text">{replaceWithBr(item.title)}</h3>
                                </div>
                            </div>
                        ))}
                    </div> 
                </div> 
        </section>

    </>
  )
}

export default WhyChoose