// CounterSection

import React from "react";
const DataLoop = [
  { counting: "15+", txt: "Years of hands on experience" },
  { counting: "100+", txt: "Handpicked industry experts" },
  { counting: "150+", txt: "Clients under financial market category" },
];
function CounterSection() {
  return (
    <>
      <section className="section-wrapper py-5 bg-sectiojn couting-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center  title-section">
              <h2 className="section-title">Industry leaders & experts</h2>
            </div>

            {DataLoop.map((item) => (
              <div className="col-md-4 col-4">
                <div className="couting">
                  <h2>{item.counting}</h2>
                </div>
                <div className="couting-text">
                  <p>{item.txt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default CounterSection;
