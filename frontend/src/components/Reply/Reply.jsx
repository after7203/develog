import axios from 'axios'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import calTimeDiff from '../../utils/calTimeDiff'
import ReReply from '../ReReply/ReReply'
import './Reply.scss'

const Reply = ({ reply, board, getBoard }) => {
    const [isExpand, setIsExpand] = useState(false)
    const textarea = useRef()
    const userId = localStorage.getItem("user") ? localStorage.getItem("user") : sessionStorage.getItem("user")
    const mongoose_id = localStorage.getItem("mongoose_id") ? localStorage.getItem("mongoose_id") : sessionStorage.getItem("mongoose_id")
    const handleResizeHeight = () => {
        textarea.current.style.height = 'auto';
        textarea.current.style.height = textarea.current.scrollHeight - 20 + 'px';
    };
    const onDelete = () => {
        axios.delete(`${process.env.REACT_APP_SERVER_URI}/api/reply`, { data: { _id: reply._id } }).then(() => {
            getBoard()
        })
    }

    const onSubmitReply = () => {
        axios.post(`${process.env.REACT_APP_SERVER_URI}/api/reply/${board.writer}/${board.url}/${reply._id}`, { parentReply: reply._id, userId: userId, mongooseId: mongoose_id, contents: textarea.current.value }).then(() => {
            textarea.current.value = ''
            getBoard()
        })
    }

    return (
        <div className='reply'>
            <div className="header">
                <div className="left">
                    <img src='https://velog.velcdn.com/images/after7203/profile/2d5b9fac-b879-4451-97a3-54e486942c48/social_profile.png' alt="" />
                    <div>
                        <h3>{reply.writer.id}</h3>
                        <h5>{calTimeDiff(reply.createdAt)}</h5>
                    </div>
                </div>
                <div className="right">
                    <h5>수정</h5>
                    <h5 onClick={onDelete}>삭제</h5>
                </div>
            </div>
            <div className="contents">{reply.contents}</div>
            <div className="expand_reply">
                {!isExpand &&
                    <div onClick={() => setIsExpand(true)}>
                        <svg width="1rem" height="1rem" fill="none" viewBox="0 0 12 12">
                            <path fill="currentColor" d="M5.5 2.5h1v3h3v1h-3v3h-1v-3h-3v-1h3v-3z"></path>
                            <path fill="currentColor" fillRule="evenodd" d="M1 0a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm10 1H1v10h10V1z" clipRule="evenodd"></path>
                        </svg>
                        <span>{reply.reply.length === 0 ? "답글 달기" : `${reply.reply.length}개의 답글`}</span>
                    </div>
                }
                {isExpand &&
                    <div onClick={() => setIsExpand(false)}>
                        <svg width="1rem" height="1rem" fill="none" viewBox="0 0 12 12">
                            <path fill="currentColor" d="M9.5 6.5v-1h-7v1h7z"></path>
                            <path fill="currentColor" fillRule="evenodd" d="M0 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm1 0h10v10H1V1z" clipRule="evenodd"></path>
                        </svg>
                        <span>숨기기</span>
                    </div>
                }
            </div>
            {
                isExpand &&
                <div className='re_reply_wrapper'>
                    {reply.reply.map(reply => (<ReReply key={JSON.stringify(reply)} reply={reply} />))}
                    <textarea ref={textarea} onChange={handleResizeHeight} placeholder='댓글을 작성하세요' />
                    <div className="rpbtn_wrapper">
                        <div className="cancelbtn" onClick={() => setIsExpand(false)}>취소</div>
                        <div className="rpbtn" onClick={onSubmitReply}>댓글 작성</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Reply