import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Header.scss";
import { userContext } from "../../App";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import LoginModal from "../LoginModal/LoginModal";

function Header() {
  const { user, setUser } = useContext(userContext);
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef();
  const userMenuBtnRef = useRef();
  const [loginToggle, setLoginToggle] = useState(false);
  const loginRef = useRef();
  const navigate = useNavigate();
  const toggleLoginModal = () => {
    const target = loginRef.current;
    if (loginToggle) {
      target.classList.remove("on");
      void target.offsetWidth;
      target.classList.add("off");
    } else {
      target.classList.remove("off");
      void target.offsetWidth;
      target.classList.add("on");
    }
    setLoginToggle(!loginToggle);
  };

  const handleClickOutside = ({ target }) => {
    if (
      !userMenuBtnRef.current?.contains(target) &&
      !userMenuRef.current?.contains(target)
    ) {
      setUserMenu(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("mongoose_id");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("mongoose_id");
    setUser(false);
    setUserMenu(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header>
        <Link to="/">
          <img className="logo" src={require("../../asset/logo_1.png")} />
        </Link>
        <div className="blank" />
        {/* <div className='svg_bg'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                        <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                    </svg>
                </div> */}
        {/* <div className='svg_bg'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="search bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                </div> */}
        {!user && (
          <div className="login-btn" onClick={toggleLoginModal}>
            로그인
          </div>
        )}
        {user && (
          <>
            <div className="write-btn" onClick={() => navigate("/write")}>
              새 글 작성
            </div>
            <img
              className="profile-img"
              onClick={() => {
                navigate(`/@${user.id}`);
              }}
              src={user.profile}
            />
            <svg
              ref={userMenuBtnRef}
              onClick={() => {
                setUserMenu((prev) => !prev);
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              className="bi bi-caret-down-fill"
              viewBox="0 0 16 16"
            >
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </>
        )}
        {userMenu && (
          <div className="userMenuParent">
            <div className="userMenu" ref={userMenuRef}>
              <div
                onClick={() => {
                  navigate(`/@${user.id}`, {
                    state: {
                      host: user.id,
                    },
                  });
                  setUserMenu(false);
                }}
              >
                내 디벨로그
              </div>
              <div
                onClick={() => {
                  navigate(`/setting`);
                  setUserMenu(false);
                }}
              >
                설정
              </div>
              <div onClick={handleLogout}>로그아웃</div>
            </div>
          </div>
        )}
      </header>
      <Outlet />
      <LoginModal
        loginToggle={loginToggle}
        toggleLoginModal={toggleLoginModal}
        loginRef={loginRef}
      />
    </>
  );
}

export default Header;
