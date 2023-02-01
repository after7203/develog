import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"
import "./UserHome.scss"
import '@toast-ui/editor/dist/toastui-editor.css';
import { useParams } from "react-router-dom";
import UserHomePreview from "../../components/UserHomePreview/UserHomePreview";
import axios from "axios";

const UserHome = () => {
    let { user } = useParams()
    user = user.substring(1)
    const [boards, setBoards] = useState([])
    const [menu, setMenu] = useState("article")
    const menuRef = useRef()
    const params = useParams();
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URI}/api/board/${user}`).then((res) => {
            setBoards(res.data.boards)
        })
        document.getElementsByTagName('title')[0].innerText = params.user.substring(1)
        if (menu == "article") {
            menuRef.current.className = "menu article"
        }
        else if (menu == "series") {
            menuRef.current.className = "menu series"
        }
        else if (menu == "introduce_tap") {
            menuRef.current.className = "menu introduce_tap"
        }
    }, [menu])
    return (
        <div className="userHome">
            <div className="left"></div>
            <div className="center">
                <div className="introduce">
                    <img className="profile-img" src={require("../../asset/profile_1.png")} />
                    <div>
                        <h2>{user}</h2>
                        <h3>안녕하시어요</h3>
                    </div>
                </div>
                <div className="menu" ref={menuRef}>
                    <div className="article" onClick={() => setMenu("article")}>
                        글
                    </div>
                    <div className="series" onClick={() => setMenu("series")}>
                        시리즈
                    </div>
                    <div className="introduce_tap" onClick={() => setMenu("introduce_tap")}>
                        소개
                    </div>
                    <span className="below_line"></span>
                </div>
                <div className="search"></div>
                {boards.map(board => (
                    <UserHomePreview key={JSON.stringify(board)} board={board} />
                ))}
            </div>
            <div className="right"></div>
        </div>
    )
}

export default UserHome