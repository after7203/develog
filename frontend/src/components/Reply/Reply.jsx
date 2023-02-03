import axios from 'axios'
import { useEffect } from 'react'
import { useRef, useState } from 'react'
import calTimeDiff from '../../utils/calTimeDiff'
import ReReply from '../ReReply/ReReply'
import './Reply.scss'

const Reply = ({ _isExpand, reply, expandList, setExpandList, board, getBoard }) => {
    const [isExpand, setIsExpand] = useState(_isExpand)
    const [isRevise, setIsRevise] = useState(false)
    const[isExpandForm, setIsExpandForm] = useState(false)
    const add_textarea = useRef()
    const revise_textarea = useRef()
    const user = localStorage.getItem("user") || sessionStorage.getItem("user")
    useEffect(() => {
        // console.log(userId, reply.writer)
    })
    const ResizeReviseform = () => {
        revise_textarea.current.style.height = 'auto';
        revise_textarea.current.style.height = revise_textarea.current.scrollHeight - 20 + 'px';
    };
    const ResizeAddform = () => {
        add_textarea.current.style.height = 'auto';
        add_textarea.current.style.height = add_textarea.current.scrollHeight - 20 + 'px';
    };
    const onDelete = () => {
        axios.delete(`${process.env.REACT_APP_SERVER_URI}/api/reply/${reply._id}`).then(() => {
            getBoard()
        })
    }

    const onSubmitReply = () => {
        axios.post(`${process.env.REACT_APP_SERVER_URI}/api/reply/${board._id}/${reply._id}`, { parentReply: reply._id, userId: user.id, mongooseId: user._id, contents: add_textarea.current.value }).then(() => {
            add_textarea.current.value = ''
            getBoard()
        })
    }

    const onRevise = () => {
        axios.put(`${process.env.REACT_APP_SERVER_URI}/api/reply/${reply._id}`, { writer: reply.writer.id, contents: revise_textarea.current.value }).then(() => {
            getBoard()
            setIsRevise(false)
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
                {reply.writer.id === user.id &&
                    <div className="right">
                        <h5 onClick={() => setIsRevise(true)}>수정</h5>
                        <h5 onClick={onDelete}>삭제</h5>
                    </div>
                }
            </div>
            {!isRevise ?
                <div className="contents">{reply.contents}</div> :
                <div className="contents">
                    <textarea ref={revise_textarea} onChange={ResizeReviseform} placeholder='댓글을 작성하세요' defaultValue={reply.contents} />
                    <div className="revise_wrapper">
                        <div className="cancelbtn" onClick={() => { setIsRevise(false) }}>취소</div>
                        <div className="rpbtn" onClick={onRevise}>댓글 수정</div>
                    </div>
                </div>
            }
            <div className="expand_reply">
                {!isExpand &&
                    <div onClick={() => { setIsExpand(true); setExpandList([...expandList, reply._id]) }}>
                        <svg width="1rem" height="1rem" fill="none" viewBox="0 0 12 12">
                            <path fill="currentColor" d="M5.5 2.5h1v3h3v1h-3v3h-1v-3h-3v-1h3v-3z"></path>
                            <path fill="currentColor" fillRule="evenodd" d="M1 0a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm10 1H1v10h10V1z" clipRule="evenodd"></path>
                        </svg>
                        <span>{reply.reply.length === 0 ? "답글 달기" : `${reply.reply.length}개의 답글`}</span>
                    </div>
                }
                {isExpand &&
                    <div onClick={() => { setIsExpand(false); expandList.pop(reply._id) }}>
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
                    {reply.reply.map(reply => (<ReReply key={JSON.stringify(reply)} reply={reply} getBoard={getBoard} />))}
                    {isExpandForm ?
                        <>
                            <textarea ref={add_textarea} onChange={ResizeAddform} placeholder='댓글을 작성하세요' />
                            <div className="rpbtn_wrapper">
                                <div className="cancelbtn" onClick={() => setIsExpandForm(false)}>취소</div>
                                <div className="rpbtn" onClick={onSubmitReply}>댓글 작성</div>
                            </div>
                        </>
                        :
                        <div className="expandform_btn" onClick={() => setIsExpandForm(true)}>
                            답글 작성하기
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Reply