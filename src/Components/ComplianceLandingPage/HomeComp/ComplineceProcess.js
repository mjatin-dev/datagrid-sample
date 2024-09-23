import React, { Fragment } from "react";

import ic1 from "../../../../src/assets/Images/home/icon1.png";
import ic2 from "../../../../src/assets/Images/home/icon2.png";
import ic3 from "../../../../src/assets/Images/home/icon3.png";
import ic4 from "../../../../src/assets/Images/home/icon4.png";

const CardData = [
  {
    title: "Instant \n Setup ",
    desc: "One time set-up to get started in 2 mins",
    img: ic1,
  },
  {
    title: "Task \n Management",
    desc: "Automated Compliance & Audit Management",
    img: ic2,
  },
  {
    title: `Risk \n Management`,
    desc: "Anticipate risks, delay & \n Take action",
    img: ic3,
  },
  {
    title: "Planning & \n Management",
    desc: "Complete control on your fingertips, anywhere.",
    img: ic4,
  },
];

const replaceWithBr = (str) => {
  const lines = str.split(/\n/);
  const withBreaks = lines.flatMap((line, index) =>
    index > 0
      ? [<br key={`br-${index}`} />, <Fragment key={index}>{line}</Fragment>]
      : [line]
  );
  return withBreaks
};

function ComplineceProcess() {
  return (
    <>
      <section className="section-wrapper py-5 comp-proceess">
        <div className="container">
          <div className="row d-flex">
            <div className="col-md-12 text-center">
              <h2 className="section-title">Compliance process</h2>
            </div>

            {CardData.map((item) => (
              <div className="col-md-6 col-lg-3 col-sm-6 col-6">
                <div className="shadow    bg-body rounded text-center shadbox-shadow ">
                  <img
                    src={item.img}
                    className="img-fluid card-img"
                    alt="icon-img "
                  />
                  <h3 className="card-title ">{replaceWithBr(item.title)}</h3>
                  <p className="desc">{replaceWithBr(item.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ComplineceProcess;
