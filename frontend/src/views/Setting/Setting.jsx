import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { spinnerContext, userContext } from "../../App";
import "./Setting.scss";

const Setting = () => {
  const { user, setUser } = useContext(userContext);
  const { setIsLoading } = useContext(spinnerContext);
  const [isReviseDescription, setIsReviseDescription] = useState(false);
  const description_form = useRef();
  const navigate = useNavigate();
  // const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem("user") && !sessionStorage.getItem("user")) {
      navigate("/");
    }
    axios.defaults.headers.common["Authorization"] = user?.token;
    // if (!(JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user")))) navigate('/')
    // else if (user) {
    //     axios.defaults.headers.common['mongoose_id'] = user._id
    //     fetchUser()
    // }
    console.log(user);
  }, [user]);
  // const fetchUser = async () => {
  //     const res = await axios.get(`${process.env.REACT_APP_SERVER_URI}/api/users/${user._id}`)
  //     setProfile(res.data.user)
  // }
  const handleProfile = async (e) => {
    const formdata = new FormData();
    const file = e.target.files[0];
    const ext = file.name.split(".").slice(-1)[0];
    const blob = file.slice(0, file.size, `image/${ext}`);
    const newFile = new File([blob], `profile.${ext}`, {
      type: `image/${ext}`,
    });
    formdata.append("profile", newFile);
    setIsLoading(true);
    await axios
      .put(
        `${process.env.REACT_APP_SERVER_URI}/api/users/${user._id}/profile`,
        formdata,
        { headers: { profile: `profile.${ext}` } }
      )
      .then((res) => {
        const updated_data = { ...user, profile: res.data.profile };
        if (localStorage.getItem("user"))
          localStorage.setItem("user", JSON.stringify(updated_data));
        else if (sessionStorage.getItem("user"))
          sessionStorage.setItem("user", JSON.stringify(updated_data));
      })
      .catch((e) => console.log(e));
    setIsLoading(false);
    window.location.reload();
  };
  const reviseDescription = async () => {
    await axios
      .put(
        `${process.env.REACT_APP_SERVER_URI}/api/users/${user._id}/description`,
        { id: user.id, description: description_form.current.value }
      )
      .catch((e) => console.log(e));
  };
  const deleteThumb = async () => {
    setIsLoading(false);
    await axios
      .delete(
        `${process.env.REACT_APP_SERVER_URI}/api/users/${user._id}/profile`
      )
      .catch((e) => console.log(e));
    setIsLoading(true);
    window.location.reload();
  };
  return (
    <div className="setting">
      {user && (
        <div>
          <div className="profile">
            <div className="left">
              <div className="img_wrapper">
                <img src={user.profile} />
              </div>
              <input
                id="thumb_input"
                name="profile"
                type="file"
                accept="image/*"
                onChange={handleProfile}
              />
              <label className="upload" htmlFor="thumb_input">
                ????????? ?????????
              </label>
              <div className="delete" onClick={deleteThumb}>
                ????????? ??????
              </div>
            </div>
            <div className="right">
              <h1>{user.id}</h1>
              {!isReviseDescription ? (
                <>
                  <h4 className="discription">{user.description}</h4>
                  <div className="revise_btn_wrapper">
                    <h4
                      className="revise_btn"
                      onClick={() => setIsReviseDescription(true)}
                    >
                      ??????
                    </h4>
                  </div>
                </>
              ) : (
                <>
                  <input
                    ref={description_form}
                    type="text"
                    defaultValue={user.description}
                  />
                  <div>
                    <div
                      onClick={() => {
                        reviseDescription();
                        setUser({
                          ...user,
                          description: description_form.current.value,
                        });
                        setIsReviseDescription(false);
                      }}
                    >
                      ??????
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* <div className="velog_title">
                        <div className="top">
                            <div>
                                <h2>????????? ??????</h2>
                                <h4>{'after7203.log'}</h4>
                            </div>
                            <h4 className='revise_btn'>??????</h4>
                        </div>
                        <div className='description'>
                            ?????? ???????????? ?????? ????????? ???????????? ????????? ???????????????.
                        </div>
                    </div> */}
          {/* <div className="social_info">
                        <div className="top">
                            <h2>?????? ??????</h2>
                            <h4 className='revise_btn'>?????? ??????</h4>
                        </div>
                        <div className='description'>
                            ????????? ??? ??????????????? ???????????? ???????????? ???????????? ?????? ???????????????.
                        </div>
                    </div> */}
        </div>
      )}
    </div>
  );
};

export default Setting;
