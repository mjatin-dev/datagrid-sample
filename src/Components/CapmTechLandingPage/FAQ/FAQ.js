import React, { useEffect,useRef, useState } from "react";
import "./style.scss";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import axiosInstance from "apiServices";

function FAQ() {
  const [faqData, setFaqData] = useState([]);
  const [searchResultsFaq, setSearchResultFaq] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const content = useRef(null);

  const handleChangeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchFaqData = (abortController) => {
    try {
      axiosInstance
        .get("compliance.api.getFAQDetail", { signal: abortController.signal })
        .then((response) => {
          let filteredData = [];
          if (response?.data?.message?.status) {
            response?.data?.message?.faq?.length > 0 &&
              response?.data?.message?.faq.map((item, index) => {
                filteredData.push({
                  ...item,
                  isExpanded: false,
                  isActive: false,
                });
              });
            setFaqData(filteredData || []);
            setSearchResultFaq(filteredData || []);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onHandleExpandOpen = (e,item, index) => {
    e.stopPropagation();
    let TempFaqData = [...faqData];

    TempFaqData.map((item, Eindex) => {
      if (Eindex === index) {
        TempFaqData[Eindex].isExpanded = true;
      } else {
        TempFaqData[Eindex].isExpanded = false;
      }
    });
    setFaqData(TempFaqData);
  };

  const onHandleExpandClose = (e,item, index) => {
    e.stopPropagation();
    let TempFaqData = [...faqData];
    TempFaqData[index].isExpanded = false;
    setFaqData(TempFaqData);
  };

  const searchResults = () => {
    let tempData = [...faqData];
    if (searchTerm?.length > 0) {
      const filteredFaq = tempData.filter((question) => {
        return question.question
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setSearchResultFaq(filteredFaq);
    } else {
      setFaqData(faqData);
      setSearchResultFaq(faqData);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchFaqData(abortController);
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (searchTerm?.length === 0) {
      setSearchResultFaq(faqData);
    }
  }, [searchTerm]);

  return (
    <>
      <div className="jumbotron faq__page__title__background">
        <h1 className="display-4 faq__page__title mt-3">Help</h1>
        <div className="search_wrap search_wrap">
          <div className="search_box">
            <input
              type="text"
              className="input"
              placeholder="Search here your question"
              onChange={handleChangeSearchTerm}
            />
            <div className="faq__btn" onClick={searchResults}>
              <h1 className="search__bar__btn__text">Search</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container pt-3 pb-3" style={{ minHeight: "100vh" }}>
        <h1 className="faq__frequently__asked__heading">
          Frequently Asked Questions
        </h1>
        {searchResultsFaq?.length > 0 ? (
          searchResultsFaq?.map((item, index) => {
            return (
              <>
                <div className="accordian__main pb-3 pt-3" key={index}>
                  <div className="accordian__div__numbers">
                    <h1
                      className={`${
                        item.isExpanded
                          ? "accordian__number__heading__isActive"
                          : "accordian__number__heading"
                      }`}
                    >
                      {index + 1}.
                    </h1>
                  </div>
                  <div
                    className="accordian__div__main__container"
                    onClick={(e) => {
                      item.isExpanded
                        ? onHandleExpandClose(e,item, index)
                        : onHandleExpandOpen(e,item, index);
                    }}
                  >
                    <h1
                      className={`${
                        item.isExpanded
                          ? "accordian__question__isActive"
                          : "accordian__question"
                      }`}
                    >
                      {item.question}
                    </h1>
                    {item.isExpanded ? (
                      <BsChevronUp
                        style={{
                          color: "black",
                          marginLeft: "auto",
                          width: "50px",
                          height: "25px",
                          cursor: "pointer",
                        }}
                        onClick={(e) => onHandleExpandClose(e,item, index)}
                      />
                    ) : (
                      <BsChevronDown
                        style={{
                          color: "black",
                          marginLeft: "auto",
                          width: "50px",
                          height: "25px",
                          cursor: "pointer",
                        }}
                        onClick={(e) => onHandleExpandOpen(e,item, index)}
                      />
                    )}
                  </div>
                </div>
                <div
                  className="accordian__main"
                  ref={content}
                  style={{
                    ...(!item.isExpanded
                      ? { maxHeight: "0px" }
                      : {
                          maxHeight: `${content.current.scrollHeight + 36}px`,
                        }),
                  }}
                >
                  <div style={{ width: "60px", height: "60px" }}></div>
                  <div className="accordian__div__main__container">
                    <h1 className="accordion__expanded__description">
                      {item.answer}
                    </h1>
                  </div>
                </div>
              </>
            );
          })
        ) : (
          <p className="faq__noResult__found">No Results Found</p>
        )}
        <div className="faq__bottom mt-5 mb-5">
          <h1 className="faq__bottom__heading">Still have a question ?</h1>
          <button className="faq__bottom__btn">
            <a href="mailto:Kaushik@secmark.in">Contact Us</a>
          </button>
        </div>
      </div>
    </>
  );
}

export default FAQ;
