import { useNavigate } from "react-router-dom"
import calTimeDiff from "../../utils/calTimeDiff"
import "./UserHomePreview.scss"

const UserHomePreview = ({ board }) => {
    const navigate = useNavigate()
    const getReplyCount = () => {
        let reply_count = 0
        board.reply.map(reply => {
            reply_count++
            reply.reply.map(() => {
                reply_count++
            })
        })
        return reply_count
    }
    return (
        <div className="userHomePreview">
            <img src={`${process.env.REACT_APP_SERVER_URI}/${board.thumbnail}`} onClick={() => navigate(`/@${board.writer.id}/${board.url}`)} />
            <h2 onClick={() => navigate(`/@${board.writer.id}/${board.url}`)}>{board.title}</h2>
            <h4>{board.brief}</h4>
            <div className="tag_wrapper">
                {board.tags.map(tag => (<div className="tag" key={tag}>{tag}</div>))}
            </div>
            <div className="below">
                <h5>{calTimeDiff(board.createdAt)} · {getReplyCount(board)}개의 댓글 · </h5>
                <svg height="100%" viewBox="0 0 24 24"><path fill="currentColor" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z"></path></svg>
                <h5>{board.like.length}</h5>
            </div>
        </div>
    )
}

export default UserHomePreview