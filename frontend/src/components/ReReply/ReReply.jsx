import calTimeDiff from '../../utils/calTimeDiff'
import './ReReply.scss'

const ReReply = ({reply}) => {
    // console.log(reply)
    // console.log(reply.writer)
    const onDelete = () => {
        axios.delete(`${process.env.REACT_APP_SERVER_URI}/api/reply`, { data: { _id: reply._id } }).then(() => {
            getBoard()
        })
    }
    return (
        <div className='re_reply'>
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
        </div>
    )
}

export default ReReply