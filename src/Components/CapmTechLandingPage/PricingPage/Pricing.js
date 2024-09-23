import React from "react";
import "./style.scss";
import rightTick from "../../../assets/Icons/rightTick.svg";
import { cardData } from "./data";

function Pricing() {
  return (
    <div style={{ height: "100%" }}>

      <div className="bg-gradient"  >
        <h1 className="headingPricing">Pricing</h1>
      </div>

      
      <div className="cards">
        {cardData.map((item, index) => (
          <div className="card" key={index}>
            <div className="cardTopBorder"></div>
            <h2 className="cardHeadingTitle">
              {item.title}
              <hr className="headingUnderLine" />
            </h2>

            <h1 className="priceTag">{item.price}</h1>
            <p className="annualCategory">{item.term}</p>
            <ul className="features">
              <li>
                <img src={rightTick} alt="rightTick" />
                <p>{item.feature1}</p>
              </li>
              <li>
                <img src={rightTick} alt="rightTick" />
                <p>{item.feature2}</p>
              </li>
              <li>
                <img src={rightTick} alt="rightTick" />
                <p>{item.feature3}</p>
              </li>
              <li>
                <img src={rightTick} alt="rightTick" />
                <p>{item.feature4}</p>
              </li>
              <hr className="tagsBorderBottom" />
              <h3 className="addMoreUser">Add more User</h3>
              <li>
                <img src={rightTick} alt="rightTick" />
                <p>
                  <span>{item.feature5price}</span>
                  {item.feature5}
                </p>
              </li>
              <li>
                <img src={rightTick} alt="rightTick" />
                <p>
                  <span>{item.feature6price}</span>
                  {item.feature6}
                </p>
              </li>
              {item.id === 5 && <br></br>}
              {item.id === 6 && <br></br>}
            </ul>
          </div>
        ))}
      </div>


    </div>
  );
}

export default Pricing;
