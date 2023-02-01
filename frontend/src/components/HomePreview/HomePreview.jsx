import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import calTimeDiff from '../../utils/calTimeDiff'
import './HomePreview.scss'

function HomePreview({ board }) {
    const navigate = useNavigate()
    const { writer, title, url, brief, like, thumbnail, createdAt } = board
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
        <div className='home-preview' onClick={() => navigate(`/@${writer}/${url}`)}>
            <div className='thumb_wrapper'>
                {thumbnail && <img className='thumbnail' src={`${process.env.REACT_APP_SERVER_URI}/${thumbnail}`} />}
            </div>
            <div className='title'>{title}</div>
            <div className='brief'>{brief}</div>
            <div className='day-reply'>{calTimeDiff(createdAt)} · {getReplyCount()}개의 댓글</div>
            <div className='below-info'>
                <div className='bi-left'>
                    <img className="bi-thumb" src='https://velog.velcdn.com/images/tosspayments/profile/b8fbda89-6591-41ea-b280-582674fcff7a/image.jpg' />
                    <div className="by">by</div>
                    <div>{writer}</div>
                </div>
                <div className='bi-right'>
                    <svg width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z"></path></svg>
                    <div>{like}</div>
                </div>
            </div>
        </div>
    )
}

export default HomePreview