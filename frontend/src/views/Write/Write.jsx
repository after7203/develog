import "./Write.scss"
import { set, useForm } from 'react-hook-form'
import { useContext, useEffect, useState } from "react"
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../../App";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.min.css'

const Write = () => {
    const { user, setUser } = useContext(userContext)
    const navigate = useNavigate()
    const location = useLocation()
    const [input, setInput] = useState({
        title: '',
        tags: [],
        brief: '',
        scope: "public",
        url: '',
        series: [],
    })
    const init_series = location.state ? location.state.series : []
    const [isFocus, setIsFocus] = useState(false)
    const [handleSeries, setHandleSeries] = useState(null)
    const [userSeries, setUserSeries] = useState(null)
    const [thumbPreview, setThumbPreview] = useState(null)
    const [isCustomBrief, setIsCustomBrief] = useState(false)
    const [isCustomURL, setIsCustomURL] = useState(false)
    const [isCustomSeriesURL, setIsCustomSeriesURL] = useState(false)
    const [isCustomThumb, setIsCustomThumb] = useState(false)
    const tagRef = useRef()
    const ref_editor = useRef()
    const series_url_preview = useRef()
    const ref_series_add = useRef()
    const toast_null_title = () => toast.error("제목을 입력해주세요", { theme: "colored", autoClose: 1500, })
    const toast_null_contents = () => toast.error("내용을 입력해주세요", { theme: "colored", autoClose: 1500, })
    const toast_duplicate_name = () => toast.error("이미 존재하는 이름입니다", { theme: "colored", autoClose: 1500, })
    const toast_duplicate_url = () => toast.error("이미 존재하는 URL입니다", { theme: "colored", autoClose: 1500, })

    useEffect(() => {
        // axios.get('https://api.ipify.org?format=json')
        //     .then(({ data, config }) => {
        //         consolelog({    
        //             data,
        //             headers: config.headers,
        //         });
        //     });
        if (location.state) {
            (async () => {
                if (location.state.thumbnail !== 'public/default/thumbnail.png') {
                    const data = await fetch(`${process.env.REACT_APP_SERVER_URI}/${location.state.thumbnail}`)
                    const blob = await data.blob();
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = () => {
                        setThumbPreview(reader.result)
                    }
                }
            })()
            ref_editor.current.getInstance().setHTML(location.state.contents)
            setInput({ ...location.state })
        }
        document.getElementsByTagName('title')[0].innerText = '새 글 작성'
        document.getElementsByClassName("tag_form")[0].addEventListener("blur", () => setIsFocus(false))
        document.getElementsByTagName("body")[0].classList.add("scroll_off")
        window.addEventListener("mousedown", handleClickOutside);
        return (() => {
            document.getElementsByTagName("body")[0].classList.remove("scroll_off")
            window.removeEventListener("mousedown", handleClickOutside);
        })
    }, []);

    useEffect(() => {
        if (user) {
            axios.defaults.headers.common['Authorization'] = user.token;
            axios.defaults.headers.common['mongoose_id'] = user._id;
            (async () => {
                const res = await axios.get(`${process.env.REACT_APP_SERVER_URI}/api/users/series`, { params: { id: user.id } })
                setUserSeries(res.data.userSeries)
            })()
        }
    }, [user])

    const base64toFile = (base_data, filename) => {
        var arr = base_data.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename + '.' + mime.split('/')[1], { type: mime });
    }

    const handleClickOutside = ({ target }) => {
        if (!ref_series_add.current?.contains(target)) {
            shrinkSeriesAddForm()
        }
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const curtag = tagRef.current.value
            if (curtag !== "") {
                tagRef.current.value = ""
                if (!input.tags.find((tag) => (tag === curtag))) {
                    setInput({ ...input, tags: [...input.tags, curtag] })
                }
            }
        }
    }

    const deleteTag = (e) => {
        setInput({ ...input, tags: input.tags.filter((tag) => tag != e.target.innerText) })
    }

    const setPublic = () => {
        setInput({ ...input, scope: "public" })
        document.getElementsByClassName("public")[0].className = "public select"
        document.getElementsByClassName("private")[0].className = "private unselect"
    }

    const setPrivate = () => {
        setInput({ ...input, scope: "private" })
        document.getElementsByClassName("public")[0].className = "public unselect"
        document.getElementsByClassName("private")[0].className = "private select"
    }

    const setDetailModal = () => {
        if (input.title === '') {
            toast_null_title()
        }
        else if (ref_editor.current.getInstance().getMarkdown().length === 0) {
            toast_null_contents()
        }
        else {
            document.getElementsByClassName("detail_modal")[0].className = "detail_modal on"
            const brief = isCustomBrief || location.state ? input.brief : document.getElementsByClassName('ProseMirror toastui-editor-contents')[0].innerText.split('\n').filter(e => e !== "")[0] || ''
            const url = isCustomURL || location.state ? input.url : input.title
            if (!isCustomThumb && !location.state) {
                const contents = ref_editor.current.getInstance().getHTML()
                let result = null
                const tagindex = contents.indexOf('<img')
                if (tagindex !== -1) {
                    const start = contents.indexOf('data:', tagindex)
                    const end = contents.indexOf('"', start)
                    result = contents.substring(start, end - 1)
                }
                setThumbPreview(result)
            }
            document.getElementsByClassName('brief')[0].value = brief
            setInput({ ...input, brief: brief, url: url })
        }
    }

    const closeDetailModal = () => {
        document.getElementsByClassName("detail_modal")[0].className = "detail_modal"
    }

    const handleThumbnail = (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0])
        reader.onload = function () {
            setThumbPreview(reader.result)
            setIsCustomThumb(true)
        }
    }

    const handleBriefChange = (e) => {
        setIsCustomBrief(true)
        if (e.target.value.length >= 150) {
            document.getElementsByClassName('count')[0].classList.add("full")
            if (e.target.value.length > 150) {
                e.target.value = e.target.value.substr(0, 147) + "...";
            }
            else {
                e.target.value = e.target.value.substr(0, 150);
            }
        }
        else {
            document.getElementsByClassName('count')[0].classList.remove("full")
        }
        setInput({ ...input, brief: e.target.value })
    }

    const expandSeriesAddForm = () => {
        ref_series_add.current?.classList.add('expand')
        ref_series_add.current?.classList.remove('shrink')
    }

    const shrinkSeriesAddForm = () => {
        if (ref_series_add.current?.className.includes('expand')) {
            ref_series_add.current?.classList.remove('expand')
            ref_series_add.current?.classList.add('shrink')
        }
    }

    const addSeries = async () => {
        const name = document.getElementsByClassName('series_add_form')[0].value
        const user_url = document.getElementsByClassName('user_url')[0].value
        for (const index in userSeries) {
            if (userSeries[index].name === name) {
                toast_duplicate_name()
                return
            }
            if (userSeries[index].url === user_url) {
                toast_duplicate_url()
                return
            }
        }
        document.getElementsByClassName("series_add_form")[0].value = ''
        document.getElementsByClassName("user_url")[0].value = ''
        shrinkSeriesAddForm()
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URI}/api/users/series`, { user: user.id, name: name, url: user_url })
        setUserSeries([...userSeries, { name: name, url: user_url, _id: res.data.series._id }])
    }

    const toggleSeriesSelect = (e) => {
        if ('select' === e.target.classList[0]) {
            e.target.classList.remove('select')
        }
        else {
            e.target.classList.add('select')
        }
    }

    const confirmURLSelect = () => {
        const series = Array.from(document.getElementsByClassName('series_list')[0].children).map(div => {
            if (div.className === 'select') {
                return JSON.parse(div.id)
            }
        }).filter((e) => e !== undefined)
        setInput({ ...input, series: series })
        setHandleSeries(false)
    }

    const onSubmit = async () => {
        // const { contents, files } = (() => {
        //     const contents = ref_editor.current.getInstance().getHTML()
        //     let replaced = ""
        //     const files = []
        //     let curindex = 0
        //     while (true) {
        //         const imgindex = contents.indexOf('<img', curindex)
        //         if (imgindex === -1) {
        //             replaced += contents.substring(curindex)
        //             break
        //         }
        //         const start = contents.indexOf('src="data:', imgindex) + 5
        //         const end = contents.indexOf('"', start)
        //         const file = base64toFile(contents.substring(start, end), curindex)
        //         files.push(file)
        //         replaced += contents.substring(curindex, start) + `${process.env.REACT_APP_SERVER_URI}/public/users/${user}/board/${input.url}/contents/${file.name}`
        //         curindex = end
        //     }
        //     return { contents: replaced, files }
        // })()
        let after_series = Array.from(input.series.map(series => series._id))
        let before_series = Array.from(init_series.map(series => series._id))
        const added_series = after_series.filter(_id => !before_series.includes(_id))
        const deleted_series = before_series.filter(_id => !after_series.includes(_id))
        let data = { ...input, writer: user.id, _id: location.state?._id, added_series, deleted_series }
        delete data.contents
        const formdata = new FormData()
        formdata.append('files', new File([ref_editor.current.getInstance().getHTML()], 'contents.txt', { type: "text/plain" }))
        if (thumbPreview) {
            const thumbnail = base64toFile(thumbPreview, "thumbnail")
            formdata.append('files', thumbnail)
            data.thumbnail = `public/users/${user.id}/board/${input.url}/contents/${thumbnail.name}`
        }
        else {
            data.thumbnail = 'public/default/thumbnail.png'
        }
        const headers = { headers: { data: encodeURIComponent(JSON.stringify(data)) } }
        if (!location.state) {
            axios.post(`${process.env.REACT_APP_SERVER_URI}/api/board/${user.id}/${input.url}`, formdata, headers)
                .catch(e => console.log(e))
                .then(() => navigate('/'))
        }
        else {
            axios.put(`${process.env.REACT_APP_SERVER_URI}/api/board/${location.state._id}`, formdata, headers)
                .catch(e => console.log(e))
                .then(() => navigate('/'))
        }
    }

    return (
        <div className="write_page">
            <ToastContainer />
            <div className="form_wrap">
                <form className="write_form">
                    <input className="title" type="text" placeholder="제목을 입력하세요" defaultValue={input.title} onChange={(e) => { setInput({ ...input, title: e.target.value }) }} />
                    <div className="division" />
                    <div className="tag_wrapper">
                        {input.tags.map((tag) => (<div className='tag' key={tag} onClick={deleteTag}>{tag}</div>))}
                        <input className='tag_form' ref={tagRef} onFocus={() => { setIsFocus(true) }} placeholder="태그를 입력하세요" onKeyPress={handleEnter} />
                    </div>
                    <div className={isFocus ? "tip_wrapper focus" : "tip_wrapper"}>
                        <div className='tip'>쉼표 혹은 엔터를 입력하여 태그를 등록 할 수 있습니다. 등록된 태그를 클릭하면 삭제됩니다.</div>
                    </div>
                    <div className="editor_wrapper">
                        <Editor
                            ref={ref_editor}
                            initialValue={location.state ? location.state.contents : ''}
                            height="100%"
                            previewStyle="vertical"
                            initialEditType='wysiwyg'//'markdown'
                            placeholder="당신의 이야기를 적어보세요...."
                            hideModeSwitch={true}
                            plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
                            language="ko-KR"
                        />
                    </div>
                    <div className="below_bar">
                        <div className="exit" onClick={() => navigate(-1)}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                            <h3 >나가기</h3>
                        </div>
                        <div>
                            {/* <div className="tmp_save">임시저장</div> */}
                            <div className="post" onClick={setDetailModal}>{!location.state ? '출간하기' : '수정하기'}</div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="detail_modal">
                <div className="detail_wrapper">
                    <div className="left">
                        <h2>포스트 미리보기</h2>
                        {thumbPreview &&
                            <div className="thumb_edit_btn_wrapper">
                                <h3 onClick={() => { document.getElementById('thumb_btn').click() }}>재업로드</h3>
                                <h3 onClick={() => { setThumbPreview(null); document.getElementById('thumb_btn').value = null }}>제거</h3>
                            </div>
                        }
                        <div className="thumbnail">
                            <svg width="107" height="85" fill="none" viewBox="0 0 107 85"><path fill="#868E96" d="M105.155 0H1.845A1.844 1.844 0 0 0 0 1.845v81.172c0 1.02.826 1.845 1.845 1.845h103.31A1.844 1.844 0 0 0 107 83.017V1.845C107 .825 106.174 0 105.155 0zm-1.845 81.172H3.69V3.69h99.62v77.482z"></path><path fill="#868E96" d="M29.517 40.84c5.666 0 10.274-4.608 10.274-10.271 0-5.668-4.608-10.276-10.274-10.276-5.665 0-10.274 4.608-10.274 10.274 0 5.665 4.609 10.274 10.274 10.274zm0-16.857a6.593 6.593 0 0 1 6.584 6.584 6.593 6.593 0 0 1-6.584 6.584 6.591 6.591 0 0 1-6.584-6.582c0-3.629 2.954-6.586 6.584-6.586zM12.914 73.793a1.84 1.84 0 0 0 1.217-.46l30.095-26.495 19.005 19.004a1.843 1.843 0 0 0 2.609 0 1.843 1.843 0 0 0 0-2.609l-8.868-8.868 16.937-18.548 20.775 19.044a1.846 1.846 0 0 0 2.492-2.72L75.038 31.846a1.902 1.902 0 0 0-1.328-.483c-.489.022-.95.238-1.28.6L54.36 51.752l-8.75-8.75a1.847 1.847 0 0 0-2.523-.081l-31.394 27.64a1.845 1.845 0 0 0 1.22 3.231z"></path></svg>
                            <label htmlFor="thumb_btn">썸네일 업로드</label>
                            <input className="thumb_btn" id="thumb_btn" type="file" accept="image/*" onChange={handleThumbnail} />
                            {thumbPreview &&
                                <>
                                    <div />
                                    <img src={thumbPreview} />
                                </>
                            }
                        </div>
                        <h2>{input.title}</h2>
                        <textarea className="brief" onChange={handleBriefChange} placeholder='당신의 포스트를 짧게 소개해보세요.' />
                        <div className="count"><div>{input.brief.length}/150</div></div>
                    </div>
                    <div className="right">
                        {!handleSeries &&
                            <>
                                <h2>공개 설정</h2>
                                <div className="btn_wrapper_1">
                                    <div className={`public ${input.scope === 'public' ? 'select' : 'unselect'}`} onClick={setPublic}>
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.243 22.212a10.209 10.209 0 0 1-6.03-2.939A10.218 10.218 0 0 1 1.714 12c0-2.473.868-4.813 2.458-6.673.041.492.142 1.019.116 1.395-.094 1.373-.23 2.232.574 3.39.313.451.39 1.098.542 1.62.149.51.744.779 1.155 1.094.828.635 1.62 1.373 2.5 1.932.579.369.941.552.771 1.26-.136.569-.174.92-.469 1.426-.09.155.34 1.15.482 1.292.433.433.862.83 1.333 1.219.732.604-.07 1.389-.42 2.257zm8.516-2.939a10.213 10.213 0 0 1-5.34 2.832c.285-.705.793-1.331 1.264-1.694.409-.316.922-.924 1.136-1.405.213-.48.496-.898.783-1.34.407-.628-1.005-1.577-1.463-1.776-1.03-.447-1.805-1.05-2.72-1.694-.653-.46-1.977.24-2.713-.082-1.009-.44-1.84-1.206-2.716-1.866-.905-.68-.861-1.475-.861-2.48.708.026 1.716-.196 2.187.373.148.18.659.984 1 .698.28-.233-.207-1.168-.3-1.388-.29-.676.658-.94 1.142-1.398.632-.597 1.989-1.535 1.882-1.964-.108-.428-1.358-1.643-2.092-1.453-.11.028-1.078 1.044-1.266 1.203l.015-.994c.004-.21-.39-.424-.372-.56.046-.34.996-.96 1.232-1.232-.165-.103-.73-.588-.9-.517-.415.173-.882.291-1.296.464 0-.144-.017-.279-.038-.412a10.188 10.188 0 0 1 2.614-.758l.812.326.574.68.573.591.5.162.795-.75-.205-.535v-.481c1.572.228 3.057.814 4.357 1.719-.233.02-.488.055-.777.091-.119-.07-.272-.102-.401-.15.376.81.77 1.608 1.169 2.408.426.853 1.372 1.77 1.539 2.67.195 1.063.06 2.028.166 3.278.104 1.204 1.358 2.572 1.358 2.572s.579.197 1.06.128a10.222 10.222 0 0 1-2.698 4.734z"></path></svg>
                                        <h3>전체 공개</h3>
                                    </div>
                                    <div className={`private ${input.scope === 'private' ? 'select' : 'unselect'}`} onClick={setPrivate}>
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.625 9H16.5V6.81c0-2.47-1.969-4.522-4.44-4.56a4.514 4.514 0 0 0-4.56 4.5V9H6.375A1.88 1.88 0 0 0 4.5 10.875v9a1.88 1.88 0 0 0 1.875 1.875h11.25a1.88 1.88 0 0 0 1.875-1.875v-9A1.88 1.88 0 0 0 17.625 9zm-4.969 5.85v3.225a.672.672 0 0 1-.623.675.657.657 0 0 1-.69-.656V14.85a1.5 1.5 0 0 1-.838-1.486 1.5 1.5 0 1 1 2.152 1.486zM15.187 9H8.814V6.75c0-.848.332-1.645.937-2.25A3.16 3.16 0 0 1 12 3.562a3.16 3.16 0 0 1 2.25.938 3.16 3.16 0 0 1 .938 2.25V9z"></path></svg>
                                        <h3>비공개</h3>
                                    </div>
                                </div>
                                <h2>URL 설정</h2>
                                <div className="URL">
                                    <div>/@after7203/</div>
                                    <input onChange={(e) => { setIsCustomURL(true); setInput({ ...input, url: e.target.value }) }} value={input.url} />
                                </div>
                                {input.series.length >= 1 ? <h2>선택한 시리즈</h2> : <h2>시리즈 설정</h2>}
                                <div className="below_series_label">
                                    <div className="btn_series_expand" onClick={() => setHandleSeries(true)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M14 10H2V12H14V10ZM14 6H2V8H14V6ZM18 14V10H16V14H12V16H16V20H18V16H22V14H18ZM2 16H10V14H2V16Z" fill="currentColor"></path></svg>
                                        <h3>시리즈에 추가하기</h3>
                                    </div>
                                    {
                                        input.series.length >= 1 &&
                                        <>
                                            <div className="edit_series">
                                                <div onClick={() => setHandleSeries(true)}>수정하기</div>
                                            </div>
                                            <div className="loaded_series">
                                                {input.series.map((series) => <div key={series._id}>{series.name}</div>)}
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className="btn_wrapper_2">
                                    <div className="cancel" onClick={closeDetailModal}>뒤로</div>
                                    <div className="upload" onClick={onSubmit}>{!location.state ? '출간하기' : '수정하기'}</div>
                                </div>
                            </>
                        }
                        {handleSeries &&
                            <div className="series_form">
                                <h2>시리즈 설정</h2>
                                <div className="series_add" ref={ref_series_add}>
                                    <input className="series_add_form" onKeyPress={(e) => { e.key === 'Enter' && addSeries() }} placeholder="새로운 시리즈 이름을 입력하세요" onFocus={expandSeriesAddForm} onChange={(e) => !isCustomSeriesURL && (series_url_preview.current.value = e.target.value)} />
                                    <div className="url_preview">
                                        <div className="fix_url">{`/@${user.id}/series/`}</div>
                                        <input className="user_url" onKeyPress={(e) => { e.key === 'Enter' && addSeries() }} onChange={() => setIsCustomSeriesURL(true)} ref={series_url_preview} />
                                    </div>
                                    <div className="add_series_btn_wrapper">
                                        <div className="cancel_add_series_btn" onClick={shrinkSeriesAddForm}>취소</div>
                                        <div className="add_series_btn" onClick={addSeries}>시리즈 추가</div>
                                    </div>
                                </div>
                                <div className="series_list">
                                    {userSeries.map(userSeries => (
                                        <div id={JSON.stringify(userSeries)} key={userSeries._id} className={Array.from(input.series.map(series => series.name)).includes(userSeries.name) ? 'select' : ''} onClick={toggleSeriesSelect}>{userSeries.name}</div>
                                    ))}
                                </div>
                                <div className="series_btn_wrapper">
                                    <div className="cancel_series_btn" onClick={() => { setHandleSeries(false) }}>취소</div>
                                    <div className="series_btn" onClick={() => { confirmURLSelect() }}>선택하기</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Write