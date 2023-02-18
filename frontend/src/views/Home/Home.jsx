import { Link, Outlet, useLocation } from "react-router-dom";
import "./Home.scss";
import HomePreview from "../../components/HomePreview/HomePreview";
import LoginModal from "../LoginModal/LoginModal";
import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Spinner from "../../components/Spinner/Spinner";
import { spinnerContext } from "../../App";

function Home() {
  const [boards, setBoards] = useState(null);
  const { setIsLoading } = useContext(spinnerContext);
  const [isPeriodSelect, setIsPeriodSelect] = useState(false);
  const [select_period, set_select_period] = useState("1달");
  const [select_option, set_select_option] = useState("trend");
  const trend = useRef();
  const recent = useRef();
  const underline = useRef();
  const period_select = useRef();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.private) {
      toast.error("비공개글입니다", { theme: "colored", autoClose: 1500 });
    }
    fetchBoards();
    // document.getElementsByTagName('title')[0].innerText = 'develog'
    // return () => {
    //   window.removeEventListener("click", onClick);
    // };
  }, []);

  useEffect(() => {
    if (isPeriodSelect) {
      setTimeout(
        () => window.addEventListener("click", onClick, { once: true }),
        10
      );
    }
    // else {
    //   window.removeEventListener("click", onClick);
    // }
  }, [isPeriodSelect]);

  useEffect(() => {
    fetchBoards();
  }, [select_period, select_option]);

  const onClick = () => {
    setIsPeriodSelect(false);
  };

  const calPeriod = (select_period) => {
    let date;
    switch (select_period) {
      case "1일":
        date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString();
      case "1주":
        date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString();
      case "1달":
        date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString();
      case "1년":
        date = new Date();
        date.setYear(date.getFullYear() - 1);
        return date.toISOString();
    }
  };

  const fetchBoards = () => {
    if (select_option === "trend") {
      underline.current.className = "underline trend";
      trend.current.classList.add("check");
      recent.current.classList.remove("check");
      setIsLoading(true);
      axios
        .get(
          `${
            process.env.REACT_APP_SERVER_URI
          }/api/board/trend?period=${calPeriod(select_period)}`
        )
        .then((res) => {
          setBoards(res.data.boards);
          setIsLoading(false);
        });
    } else if (select_option === "recent") {
      underline.current.className = "underline recent";
      trend.current.classList.remove("check");
      recent.current.classList.add("check");
      setIsLoading(true);
      axios
        .get(
          `${
            process.env.REACT_APP_SERVER_URI
          }/api/board/recent?period=${calPeriod(select_period)}`
        )
        .then((res) => {
          setBoards(res.data.boards);
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="home">
        <div className="menu">
          <div className="filter">
            <div
              className="trend check"
              ref={trend}
              onClick={() => {
                set_select_option("trend");
              }}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"></path>
              </svg>
              <div className="string">트렌딩</div>
              <div className="underline" ref={underline} />
            </div>
            <div
              className="new"
              ref={recent}
              onClick={() => {
                set_select_option("recent");
              }}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
              </svg>
              <div className="string">최신</div>
            </div>
            <button
              className="period"
              onClick={() => {
                !isPeriodSelect && setIsPeriodSelect(true);
              }}
            >
              {select_period}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                className="bi bi-caret-down-fill"
                viewBox="0 0 16 16"
              >
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </button>
            <div
              className={
                isPeriodSelect ? "period_select visible" : "period_select"
              }
              ref={period_select}
            >
              <div onClick={() => set_select_period("1일")}>1일</div>
              <div onClick={() => set_select_period("1주")}>1주</div>
              <div onClick={() => set_select_period("1달")}>1달</div>
              <div onClick={() => set_select_period("1년")}>1년</div>
            </div>
          </div>
          <div className="blank" />
          {/* <div className='more'><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="more" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div> */}
        </div>
        <div className="home-previews">
          {boards &&
            boards.map((board) => (
              <HomePreview key={JSON.stringify(board)} board={board} />
            ))}
        </div>
      </div>
    </>
  );
}

export default Home;
