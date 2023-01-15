import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"
import "./UserHome.scss"
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const UserHome = () => {
    const [ menu, setMenu ] = useState("article")
    const menuRef = useRef()
    useEffect(()=>{
        if(menu == "article"){
            menuRef.current.className = "menu article"
        }
        else if(menu == "series"){
            menuRef.current.className = "menu series"
        }
        else if(menu == "introduce_tap"){
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
                        <h2>after7203</h2>
                        <h3>안녕하시어요</h3>
                    </div>
                </div>
                <div className="menu" ref={menuRef}>
                    <div className="article" onClick={()=>setMenu("article")}>
                        글
                    </div>
                    <div className="series" onClick={()=>setMenu("series")}>
                        시리즈
                    </div>
                    <div className="introduce_tap" onClick={()=>setMenu("introduce_tap")}>
                        소개
                    </div>
                    <sapn className="below_line"></sapn>
                </div>
                <div className="search"></div>
            </div>
            <div className="right"></div>
        </div>
    )
}

export default UserHome