import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"
import "./UserHome.scss"
import '@toast-ui/editor/dist/toastui-editor.css';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ColumnPreview from "../../components/ColumnPreview/ColumnPreview";

const UserHome = () => {
    const [user, setUser] = useState(null)
    let { user_id } = useParams()
    user_id = user_id.substring(1)
    const navigate = useNavigate()
    const [boards, setBoards] = useState([])
    const [series, setSeries] = useState(null)
    const [select, setSelect] = useState('boards')
    const menuRef = useRef()
    const params = useParams();
    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user")).token
        axios.get(`${process.env.REACT_APP_SERVER_URI}/api/board/${user_id}`).then((res) => {
            setBoards(res.data.boards)
        })
        axios.get(`${process.env.REACT_APP_SERVER_URI}/api/users/?id=${user_id}`).then((res) => {
            setUser(res.data.user)
        })
        document.getElementsByTagName('title')[0].innerText = params.user_id.substring(1)
    }, [])
    const getSeries = () => {
        axios.get(`${process.env.REACT_APP_SERVER_URI}/api/users/series?id=${user_id}`).then((res) => {
            setSeries(res.data.userSeries)
        })
    }
    return (
        <div className="userHome">
            {user &&
                <>
                    <div className="left"></div>
                    <div className="center">
                        <div className="introduce">
                            <img className="profile-img" src={user.profile} />
                            <div>
                                <h2>{user.id}</h2>
                                <h3>{user.description}</h3>
                            </div>
                        </div>
                        <div className="menu" ref={menuRef}>
                            <div className="article_btn" onClick={() => { menuRef.current.className = "menu article_btn"; setSelect('boards') }}>
                                글
                            </div>
                            <div className="series_btn" onClick={() => { menuRef.current.className = "menu series_btn"; setSelect('series') }}>
                                시리즈
                            </div>
                            {/* <div className="introduce_tap" onClick={() => menuRef.current.className = "menu introduce_tap"}>
                                소개
                            </div> */}
                            <span className="below_line"></span>
                        </div>
                        <div className="search"></div>
                        {select === 'boards' && boards.map(board => (
                            <ColumnPreview key={JSON.stringify(board)} board={board} />
                        ))}
                        {select === 'series' && (!series ? getSeries() :
                            <div className="series_wrapper">
                                {series.map(series => {
                                    if (series.boards.length)
                                        return (
                                            <div key={series.name} className="series">
                                                <div className="img_wrapper" onClick={()=>navigate(`/${user_id}/series/${series.url}`)}>
                                                    <img src={`${process.env.REACT_APP_SERVER_URI}/${series.boards[0].thumbnail}`} alt="" />
                                                </div>
                                                <h3 onClick={()=>navigate(`/${user_id}/series/${series.url}`)}>{series.name}</h3>
                                                <h5>{series.boards.length}개의 포스트</h5>
                                            </div>
                                        )
                                })}
                            </div>)
                        }
                    </div>
                    <div className="right"></div>
                </>
            }
        </div>
    )
}

export default UserHome