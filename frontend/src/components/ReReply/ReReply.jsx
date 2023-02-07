import axios from 'axios'
import { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userContext } from '../../App'
import calTimeDiff from '../../utils/calTimeDiff'
import './ReReply.scss'

const ReReply = ({ reply, getBoard }) => {
    const { user } = useContext(userContext)
    const [isRevise, setIsRevise] = useState(false)
    const revise_textarea = useRef()
    const navigate = useNavigate()
    const ResizeReviseform = () => {
        revise_textarea.current.style.height = 'auto';
        revise_textarea.current.style.height = revise_textarea.current.scrollHeight - 20 + 'px';
    };
    const onDelete = () => {
        axios.delete(`${process.env.REACT_APP_SERVER_URI}/api/reply/${reply._id}`).then(() => {
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
        <div className='re_reply'>
            <div className="header">
                <div className="left">
                    <img onClick={() => navigate(`/@${reply.writer.id}`)} src={reply.writer.profile} alt="" />
                    <div>
                        <h3 onClick={() => navigate(`/@${reply.writer.id}`)}>{reply.writer.id}</h3>
                        <h5>{calTimeDiff(reply.createdAt)}</h5>
                    </div>
                </div>
                {user && reply.writer.id === user.id &&
                    <div className="right">
                        <h5 onClick={() => { setIsRevise(true) }}>수정</h5>
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
        </div>
    )
}

export default ReReply