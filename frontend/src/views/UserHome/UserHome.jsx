import { useContext, useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import "./UserHome.scss";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ColumnPreview from "../../components/ColumnPreview/ColumnPreview";
import { spinnerContext, userContext } from "../../App";

const UserHome = () => {
  const [host, setHost] = useState();
  const { setIsLoading } = useContext(spinnerContext);
  const [boards, setBoards] = useState([]);
  const [series, setSeries] = useState(null);
  const [select, setSelect] = useState("boards");
  const menuRef = useRef();
  const params = useParams();
  useEffect(() => {
    const hostId = params.user_id.substring(1);
    axios.defaults.headers.common["Authorization"] = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user")
    )?.token;
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_SERVER_URI}/api/users?id=${hostId}`)
      .then((res) => {
        setHost(res.data.user);
      });
    axios
      .get(`${process.env.REACT_APP_SERVER_URI}/api/board/${hostId}`)
      .then((res) => {
        setBoards(res.data.boards);
        setIsLoading(false);
      });
    document.getElementsByTagName("title")[0].innerText = hostId;
  }, []);
  const getSeries = () => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_SERVER_URI}/api/users/series?id=${host.id}`)
      .then((res) => {
        setSeries(res.data.userSeries);
        setIsLoading(false);
      });
  };
  return (
    <div className="userHome">
      {host && (
        <>
          <div className="left"></div>
          <div className="center">
            <div className="introduce">
              <img className="profile-img" src={host.profile} />
              <div>
                <h2>{host.id}</h2>
                <h3>{host.description}</h3>
              </div>
            </div>
            <div className="menu" ref={menuRef}>
              <div
                className="article_btn"
                onClick={() => {
                  menuRef.current.className = "menu article_btn";
                  setSelect("boards");
                }}
              >
                글
              </div>
              <div
                className="series_btn"
                onClick={() => {
                  menuRef.current.className = "menu series_btn";
                  setSelect("series");
                }}
              >
                시리즈
              </div>
              {/* <div className="introduce_tap" onClick={() => menuRef.current.className = "menu introduce_tap"}>
                                소개
                            </div> */}
              <span className="below_line"></span>
            </div>
            <div className="search"></div>
            {select === "boards" &&
              boards.map((board) => (
                <ColumnPreview key={JSON.stringify(board)} board={board} />
              ))}
            {select === "series" &&
              (!series ? (
                getSeries()
              ) : (
                <div className="series_wrapper">
                  {series.map((series) => {
                    if (series.boards.length)
                      return (
                        <div key={series.name} className="series">
                          <div
                            className="img_wrapper"
                            onClick={() =>
                              navigate(`/${host.id}/series/${series.url}`)
                            }
                          >
                            <img
                              src={`${process.env.REACT_APP_SERVER_URI}/${series.boards[0].thumbnail}`}
                              alt=""
                            />
                          </div>
                          <h3
                            onClick={() =>
                              navigate(`/${host.id}/series/${series.url}`)
                            }
                          >
                            {series.name}
                          </h3>
                          <h5>{series.boards.length}개의 포스트</h5>
                        </div>
                      );
                  })}
                </div>
              ))}
          </div>
          <div className="right"></div>
        </>
      )}
    </div>
  );
};

export default UserHome;
