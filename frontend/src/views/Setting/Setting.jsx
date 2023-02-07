import axios from 'axios'
import { useState } from 'react'
import { useContext } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userContext } from '../../App'
import './Setting.scss'

const Setting = () => {
    const { user, setUser } = useContext(userContext)
    const [isReviseDescription, setIsReviseDescription] = useState(false)
    const description_form = useRef()
    // const navigate = useNavigate()
    // useEffect(() => {
    //     if (!(JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user")))) navigate('/')
    //     else if (user) {
    //         axios.defaults.headers.common['Authorization'] = user.token
    //         axios.defaults.headers.common['mongoose_id'] = user._id
    //         fetchUser()
    //     }
    // }, [user])
    // const fetchUser = async () => {
    //     const res = await axios.get(`${process.env.REACT_APP_SERVER_URI}/api/users/${user._id}`)
    //     setProfile(res.data.user)
    // }
    const handleProfile = async (e) => {
        const formdata = new FormData()
        const file = e.target.files[0]
        const ext = file.name.split('.').slice(-1)[0]
        const blob = file.slice(0, file.size, `image/${ext}`);
        const newFile = new File([blob], `profile.${ext}`, { type: `image/${ext}` });
        formdata.append('profile', newFile)
        await axios.put(`${process.env.REACT_APP_SERVER_URI}/api/users/${user._id}/profile`, formdata, { headers: { profile: `profile.${ext}` } })
            .catch(e => console.log(e))
        window.location.reload()
    }
    const reviseDescription = async () => {
        await axios.put(`${process.env.REACT_APP_SERVER_URI}/api/users/${user._id}/description`, { id: user.id, description: description_form.current.value })
            .catch(e => console.log(e))
    }
    const deleteThumb = async () => {
        await axios.delete(`${process.env.REACT_APP_SERVER_URI}/api/users/${user._id}/profile`)
            .catch(e => console.log(e))
        window.location.reload()
    }
    return (
        <div className='setting'>
            {
                user &&
                <div>
                    <div className="profile">
                        <div className="left">
                            <div className='img_wrapper'>
                                <img src={user.profile} />
                            </div>
                            <input id='thumb_input' name='profile' type="file" accept="image/*" onChange={handleProfile} />
                            <label className="upload" htmlFor="thumb_input">이미지 업로드</label>
                            <div className="delete" onClick={deleteThumb}>이미지 제거</div>
                        </div>
                        <div className="right">
                            <h1>{user.id}</h1>
                            {!isReviseDescription ?
                                <>
                                    <h4 className='discription'>{user.description}</h4>
                                    <div className='revise_btn_wrapper'>
                                        <h4 className='revise_btn' onClick={() => setIsReviseDescription(true)}>수정</h4>
                                    </div>
                                </>
                                :
                                <>
                                    <input ref={description_form} type='text' defaultValue={user.description} onChange={() => setUser({ ...user, description: description_form.current.value })} />
                                    <div>
                                        <div onClick={() => { reviseDescription(); setIsReviseDescription(false) }}>저장</div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    {/* <div className="velog_title">
                        <div className="top">
                            <div>
                                <h2>벨로그 제목</h2>
                                <h4>{'after7203.log'}</h4>
                            </div>
                            <h4 className='revise_btn'>수정</h4>
                        </div>
                        <div className='description'>
                            개인 페이지의 좌측 상단에 나타나는 페이지 제목입니다.
                        </div>
                    </div> */}
                    {/* <div className="social_info">
                        <div className="top">
                            <h2>소셜 정보</h2>
                            <h4 className='revise_btn'>정보 추가</h4>
                        </div>
                        <div className='description'>
                            포스트 및 블로그에서 보여지는 프로필에 공개되는 소셜 정보입니다.
                        </div>
                    </div> */}
                </div>
            }
        </div>
    )
}

export default Setting