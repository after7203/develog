import './Board.scss'
import { Viewer } from '@toast-ui/react-editor';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import calTimeDiff from '../../utils/calTimeDiff';
import { useRef } from 'react';
import Reply from '../../components/Reply/Reply';
import { useContext } from 'react';
import { spinnerContext, userContext } from '../../App';
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.min.css'

const Board = () => {
    let { writer, boardURL } = useParams()
    const { setIsLoading } = useContext(spinnerContext)
    const { user, setUser } = useContext(userContext)
    writer = writer.substring(1)
    const [board, setBoard] = useState(null)
    const [expandList, setExpandList] = useState([])
    const navigate = useNavigate()
    const textarea = useRef()
    const recommend = useRef()
    const aside_bar = useRef()
    const copy_toast = () => toast.success("클립보드에 복사되었습니다", { theme: "colored", autoClose: 1500, })
    const invalid_toast = () => toast.error("로그인후 이용해주세요", { theme: "colored", autoClose: 1500, })
    useEffect(() => {
        window.addEventListener('scroll', sticky_scroll);
        if (user) {
            axios.defaults.headers.common['Authorization'] = user.token
            axios.defaults.headers.common['mongoose_id'] = user._id
        }
        getBoard()
        return () => {
            window.removeEventListener('scroll', sticky_scroll)
        }
    }, [user])
    const sticky_scroll = () => {
        const distance = aside_bar.current?.getBoundingClientRect().top
        const rem = parseInt(getComputedStyle(document.getElementById('root')).fontSize, 10)
        if (rem && distance <= rem * 7) {
            aside_bar.current?.classList.add('fix')
        }
        if (distance < aside_bar.current?.parentNode.getBoundingClientRect().top) {
            aside_bar.current?.classList.remove('fix')
        }
    }
    const getBoard = () => {
        setIsLoading(true)
        axios.get(`${process.env.REACT_APP_SERVER_URI}/api/board/${writer}/${boardURL}`).then(res => {
            setIsLoading(false)
            if (res.data.private) {
                toast.error("비공개글입니다", { theme: "colored", autoClose: 1500, })
                navigate('/', {
                    state: {
                        private: true
                    }
                })
            }
            setBoard(res.data.board)
        })
    }
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
    const moveRevise = () => {
        navigate('/write', {
            state: {
                ...board
            }
        })
    }
    const handleDelete = async () => {
        setIsLoading(true)
        axios.delete(`${process.env.REACT_APP_SERVER_URI}/api/board/${writer}/${boardURL}`).then(() => {
            setIsLoading(false)
            navigate('/')
        })
    }
    const handleResizeHeight = () => {
        textarea.current.style.height = 'auto';
        textarea.current.style.height = textarea.current.scrollHeight - 20 + 'px';
    };
    const onSubmitReply = () => {
        setIsLoading(true)
        axios.post(`${process.env.REACT_APP_SERVER_URI}/api/reply/${board._id}`, { parentBoard: board._id, userId: user.id, mongooseId: user._id, contents: textarea.current.value }).then(() => {
            textarea.current.value = ''
            getBoard()
        })
    }
    const handleLike = () => {
        if(!user){
            invalid_toast()
            return
        }
        if (!recommend.current.classList.contains('check')) {
            axios.put(`${process.env.REACT_APP_SERVER_URI}/api/board/${board._id}/like`, { user: user.id, mongooseId: user._id })
            // const new_like = 
            // console.log(board.like, new_like)
            setBoard({ ...board, like: [...board.like, user._id] })
            // recommend.current.classList.add('check')
        }
        else {
            axios.put(`${process.env.REACT_APP_SERVER_URI}/api/board/${board._id}/unlike`, { user: user.id, mongooseId: user._id })
            // const new_like = 
            // console.log(board.like, new_like)
            setBoard({ ...board, like: board.like.filter(_id => _id !== user._id) })
            // recommend.current.classList.remove('check')
        }
    }
    return (
        <>
            <ToastContainer />
            {board &&
                <>
                    <div className="board">
                        <div className="title">{board.title}</div>
                        <div className="title_below">
                            <div>
                                <h4 onClick={() => navigate(`/@${board.writer.id}`)}>{board.writer.id}</h4>
                                <h5>&nbsp;· {calTimeDiff(board.createdAt)}</h5>
                            </div>
                            {user && writer === user.id &&
                                <div className='ctrl_btns'>
                                    {/* <h5>통계</h5> */}
                                    <h5 onClick={moveRevise}>수정</h5>
                                    <h5 onClick={handleDelete}>삭제</h5>
                                </div>
                            }
                        </div>
                        <div className="tag_wrapper">
                            {board.tags.map(tag => (<div key={tag} className="tag" onClick={() => navigate(`/tag/${tag}`)}>{tag}</div>))}
                        </div>
                        <div className="series">
                            <aside>
                                <div className="aside_bar" ref={aside_bar}>
                                    <div className={!board.like.includes(user?._id) ? 'recommend' : 'recommend check'} ref={recommend} onClick={handleLike}>
                                        <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z"></path></svg>
                                    </div>
                                    <div className="count">{board.like.length}</div>
                                    <div className="share" onClick={() => { copy_toast(); navigator.clipboard.writeText(window.location.href); }}>
                                        <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="M5 7c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm11.122 12.065c-.073.301-.122.611-.122.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.943 1.764l5.488 2.927zm7.878-15.065c0-2.209-1.791-4-4-4s-4 1.791-4 4c0 .324.049.634.122.935l-5.488 2.927c.395.535.713 1.127.943 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4z"></path></svg>
                                    </div>
                                </div>
                            </aside>
                        </div>

                        <Viewer initialValue={board.contents} />
                        <div className="profile">
                            <img src={board.writer.profile} onClick={() => navigate(`/@${board.writer.id}`)} />
                            <div className="profile_text">
                                <h2 onClick={() => navigate(`/@${board.writer.id}`)}>{board.writer.id}</h2>
                                <h3>{board.writer.description}</h3>
                            </div>
                        </div>
                        {/* <div className="ref">
                            <a href="https://github.com/msung99" target="_blank" rel="noopener noreferrer" data-testid="github"><svg fill="currentColor" viewBox="0 0 20 20"><mask id="github" width="20" height="20" x="0" y="0" maskUnits="userSpaceOnUse"><path fill="#ffffff" fillRule="evenodd" d="M6.69 15.944c0 .08-.093.145-.21.145-.133.012-.226-.053-.226-.145 0-.081.093-.146.21-.146.12-.012.226.053.226.146zm-1.255-.182c-.028.08.053.173.174.198.105.04.226 0 .25-.081.024-.08-.053-.173-.174-.21-.104-.028-.221.012-.25.093zm1.783-.068c-.117.028-.198.104-.186.197.012.08.117.133.238.105.117-.028.198-.105.186-.186-.012-.076-.121-.129-.238-.116zM9.87.242C4.278.242 0 4.488 0 10.08c0 4.471 2.815 8.298 6.835 9.645.516.093.697-.226.697-.488 0-.25-.012-1.63-.012-2.476 0 0-2.822.605-3.415-1.202 0 0-.46-1.173-1.121-1.475 0 0-.924-.633.064-.621 0 0 1.004.08 1.557 1.04.883 1.557 2.363 1.109 2.94.843.092-.645.354-1.093.645-1.36-2.255-.25-4.529-.576-4.529-4.455 0-1.109.307-1.665.952-2.375-.105-.262-.448-1.342.105-2.738C5.56 4.157 7.5 5.51 7.5 5.51a9.474 9.474 0 0 1 2.532-.344c.86 0 1.726.117 2.533.343 0 0 1.939-1.355 2.782-1.089.552 1.4.21 2.476.105 2.738.645.714 1.04 1.27 1.04 2.375 0 3.891-2.375 4.202-4.63 4.456.372.319.686.923.686 1.87 0 1.36-.012 3.041-.012 3.372 0 .262.186.58.698.488C17.266 18.379 20 14.552 20 10.08 20 4.488 15.464.24 9.871.24zM3.919 14.149c-.052.04-.04.133.029.21.064.064.157.093.21.04.052-.04.04-.133-.029-.21-.064-.064-.157-.092-.21-.04zm-.435-.326c-.028.052.012.117.093.157.064.04.145.028.173-.028.028-.053-.012-.117-.093-.158-.08-.024-.145-.012-.173.029zm1.306 1.435c-.064.053-.04.174.053.25.092.093.21.105.262.04.052-.052.028-.173-.053-.25-.088-.092-.21-.104-.262-.04zm-.46-.593c-.064.04-.064.146 0 .238.065.093.174.133.226.093.065-.053.065-.157 0-.25-.056-.093-.16-.133-.225-.08z" clipRule="evenodd"></path></mask><g mask="url(#github)"><path fill="currentColor" d="M0 0h20v20H0z"></path></g></svg></a>
                            <a href="mailto:msung6924@naver.com"><svg fill="none" viewBox="0 0 32 32" data-testid="email"><path fill="currentColor" d="M16 16.871L1.019 5H30.98L16 16.871zm0 3.146L1 8.131V27h30V8.131L16 20.017z"></path></svg></a>
                        </div> */}
                        <div className='reply_count'>{getReplyCount(board.reply.length)}개의 댓글</div>
                        <textarea ref={textarea} onChange={handleResizeHeight} placeholder='댓글을 작성하세요' />
                        <div className="rpbtn_wrapper">
                            <div className="rpbtn" onClick={onSubmitReply}>댓글 작성</div>
                        </div>
                        {board.reply.map(reply => (<Reply key={JSON.stringify(reply)} reply={reply} _isExpand={expandList.includes(reply._id)} expandList={expandList} setExpandList={setExpandList} board={board} getBoard={getBoard} />))}
                    </div>
                </>
            }
        </>
    )
}

export default Board