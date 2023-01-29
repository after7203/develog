import './Board.scss'
import { Viewer } from '@toast-ui/react-editor';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import calTimeDiff from '../../utils/calTimeDiff';
axios.defaults.headers.common['Authorization'] = localStorage.getItem("token") ? localStorage.getItem("token") : SessionStorage.getItem("token");

const Board = () => {
    let { user, boardURL } = useParams()
    user = user.substring(1)
    const [board, setBoard] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URI}/api/board/${user}/${boardURL}`).then(res => {
            setBoard(res.data.board)
        })
    }, [])
    const handleDelete = async () => {
        axios.delete(`${process.env.REACT_APP_SERVER_URI}/api/board/${user}/${boardURL}`).then(() => {
            navigate('/')
        })
    }
    return (
        <>
            {board &&
                <div className="board">
                    <div className="title">{board.title}</div>
                    <div className="title_below">
                        <div>
                            <h4>{board.writer}</h4>
                            <h5>&nbsp;· {calTimeDiff(board.createdAt)}</h5>
                        </div>
                        <div className='ctrl_btns'>
                            <h5>통계</h5>
                            <h5>수정</h5>
                            <h5 onClick={handleDelete}>삭제</h5>
                        </div>
                    </div>
                    <div className="tag_wrapper">
                        {board.tags.map(tag => (<div key={tag} className="tag">{tag}</div>))}
                    </div>
                    <Viewer initialValue={board.contents} />
                    <div className="profile">
                        <img src='https://velog.velcdn.com/images/after7203/profile/2d5b9fac-b879-4451-97a3-54e486942c48/social_profile.png' />
                        <div className="profile_text">
                            <h2>{board.writer}</h2>
                            <h3>안녕하시어요</h3>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Board