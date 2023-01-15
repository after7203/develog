import "./Write.scss"
import { set, useForm } from 'react-hook-form'
import { useEffect, useState } from "react"
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/i18n/ko-kr';
//import { Editor } from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
//import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js'
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'
// import { Viewer } from '@toast-ui/react-editor';
// import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import hljs from 'highlight.js';
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
//import 'highlight.js/styles/github.css'

const Write = () => {
    const { register } = useForm()
    const navigate = useNavigate()
    const [input, setInput] = useState({
        title: "",
        tags: [],
        contents: "",
        thumbnail: "",
        brief: "",
        scope: "public",
        url: "",
        series: []
    })
    const [isFocus, setIsFocus] = useState(false)
    const tagRef = useRef()

    useEffect(() => {
        document.getElementsByClassName("tag_form")[0].addEventListener("blur", () => setIsFocus(false))
        document.getElementsByTagName("body")[0].classList.add("scroll_off")
        return (() => {
            document.getElementsByTagName("body")[0].classList.remove("scroll_off")
        })
    }, []);

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
        document.getElementsByClassName("detail")[0].className = "detail on"
    }

    const closeDetailModal = () => {
        document.getElementsByClassName("detail")[0].className = "detail"
    }

    const handleThumbnail = (e) => {
        console.log(e.target.files[0])
    }

    const handleBriefChange = (e) => {
        if(e.target.value.length >= 150){
            e.target.value = e.target.value.substr(0, 150);
            document.getElementsByClassName('count')[0].classList.add("full")
        }
        else{
            document.getElementsByClassName('count')[0].classList.remove("full")
        }
        setInput({ ...input, brief: e.target.value })
    }

    return (
        <div className="write_page">
            <div className="form_wrap">
                <form className="write_form">
                    <input className="title" type="text" placeholder="제목을 입력하세요" onChange={(e) => { setInput({ ...input, title: e.target.value }) }} />
                    <div className="division" />
                    <div className="tag_wrapper">
                        {input.tags.map((tag) => (<div className='tag' onClick={deleteTag}>{tag}</div>))}
                        <input className='tag_form' ref={tagRef} onFocus={() => { setIsFocus(true) }} placeholder="태그를 입력하세요" onKeyPress={handleEnter} />
                    </div>
                    <div className={isFocus ? "tip_wrapper focus" : "tip_wrapper"}>
                        <div className='tip'>쉼표 혹은 엔터를 입력하여 태그를 등록 할 수 있습니다. 등록된 태그를 클릭하면 삭제됩니다.</div>
                    </div>
                    <div className="editor_wrapper">
                        <Editor
                            initialValue=""//console.log(a); let a = 4 + 3;"
                            height="100%"
                            previewStyle="vertical"
                            //initialEditType='markdown'//'wysiwyg'//'markdown'
                            placeholder="당신의 이야기를 적어보세요...."
                            hideModeSwitch={true}
                            plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
                            language="ko-KR"
                        />
                    </div>
                    <div className="below_bar">
                        <div className="exit" onClick={() => navigate('/')}>
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                            <h3 >나가기</h3>
                        </div>
                        <div>
                            <div className="tmp_save">임시저장</div>
                            <div className="post" onClick={setDetailModal}>출간하기</div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="detail">
                <div className="left">
                    <h2>포스트 미리보기</h2>
                    <div className="thumbnail">
                        <svg width="107" height="85" fill="none" viewBox="0 0 107 85"><path fill="#868E96" d="M105.155 0H1.845A1.844 1.844 0 0 0 0 1.845v81.172c0 1.02.826 1.845 1.845 1.845h103.31A1.844 1.844 0 0 0 107 83.017V1.845C107 .825 106.174 0 105.155 0zm-1.845 81.172H3.69V3.69h99.62v77.482z"></path><path fill="#868E96" d="M29.517 40.84c5.666 0 10.274-4.608 10.274-10.271 0-5.668-4.608-10.276-10.274-10.276-5.665 0-10.274 4.608-10.274 10.274 0 5.665 4.609 10.274 10.274 10.274zm0-16.857a6.593 6.593 0 0 1 6.584 6.584 6.593 6.593 0 0 1-6.584 6.584 6.591 6.591 0 0 1-6.584-6.582c0-3.629 2.954-6.586 6.584-6.586zM12.914 73.793a1.84 1.84 0 0 0 1.217-.46l30.095-26.495 19.005 19.004a1.843 1.843 0 0 0 2.609 0 1.843 1.843 0 0 0 0-2.609l-8.868-8.868 16.937-18.548 20.775 19.044a1.846 1.846 0 0 0 2.492-2.72L75.038 31.846a1.902 1.902 0 0 0-1.328-.483c-.489.022-.95.238-1.28.6L54.36 51.752l-8.75-8.75a1.847 1.847 0 0 0-2.523-.081l-31.394 27.64a1.845 1.845 0 0 0 1.22 3.231z"></path></svg>
                        <label htmlFor="thumb_btn">썸네일 업로드</label>
                        <input className="thumb_btn" id="thumb_btn" type="file" accept="image/*" onChange={handleThumbnail} />
                    </div>
                    <h2>{input.title}</h2>
                    <textarea className="brief" onChange={handleBriefChange} placeholder='당신의 포스트를 짧게 소개해보세요.'/>
                    <div className="count"><div>{input.brief.length}/150</div></div>
                </div>
                <div className="right">
                    <h2>공개 설정</h2>
                    <div className="btn_wrapper_1">
                        <div className="public select" onClick={setPublic}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.243 22.212a10.209 10.209 0 0 1-6.03-2.939A10.218 10.218 0 0 1 1.714 12c0-2.473.868-4.813 2.458-6.673.041.492.142 1.019.116 1.395-.094 1.373-.23 2.232.574 3.39.313.451.39 1.098.542 1.62.149.51.744.779 1.155 1.094.828.635 1.62 1.373 2.5 1.932.579.369.941.552.771 1.26-.136.569-.174.92-.469 1.426-.09.155.34 1.15.482 1.292.433.433.862.83 1.333 1.219.732.604-.07 1.389-.42 2.257zm8.516-2.939a10.213 10.213 0 0 1-5.34 2.832c.285-.705.793-1.331 1.264-1.694.409-.316.922-.924 1.136-1.405.213-.48.496-.898.783-1.34.407-.628-1.005-1.577-1.463-1.776-1.03-.447-1.805-1.05-2.72-1.694-.653-.46-1.977.24-2.713-.082-1.009-.44-1.84-1.206-2.716-1.866-.905-.68-.861-1.475-.861-2.48.708.026 1.716-.196 2.187.373.148.18.659.984 1 .698.28-.233-.207-1.168-.3-1.388-.29-.676.658-.94 1.142-1.398.632-.597 1.989-1.535 1.882-1.964-.108-.428-1.358-1.643-2.092-1.453-.11.028-1.078 1.044-1.266 1.203l.015-.994c.004-.21-.39-.424-.372-.56.046-.34.996-.96 1.232-1.232-.165-.103-.73-.588-.9-.517-.415.173-.882.291-1.296.464 0-.144-.017-.279-.038-.412a10.188 10.188 0 0 1 2.614-.758l.812.326.574.68.573.591.5.162.795-.75-.205-.535v-.481c1.572.228 3.057.814 4.357 1.719-.233.02-.488.055-.777.091-.119-.07-.272-.102-.401-.15.376.81.77 1.608 1.169 2.408.426.853 1.372 1.77 1.539 2.67.195 1.063.06 2.028.166 3.278.104 1.204 1.358 2.572 1.358 2.572s.579.197 1.06.128a10.222 10.222 0 0 1-2.698 4.734z"></path></svg>
                            <h3>전체 공개</h3>
                        </div>
                        <div className="private unselect" onClick={setPrivate}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.625 9H16.5V6.81c0-2.47-1.969-4.522-4.44-4.56a4.514 4.514 0 0 0-4.56 4.5V9H6.375A1.88 1.88 0 0 0 4.5 10.875v9a1.88 1.88 0 0 0 1.875 1.875h11.25a1.88 1.88 0 0 0 1.875-1.875v-9A1.88 1.88 0 0 0 17.625 9zm-4.969 5.85v3.225a.672.672 0 0 1-.623.675.657.657 0 0 1-.69-.656V14.85a1.5 1.5 0 0 1-.838-1.486 1.5 1.5 0 1 1 2.152 1.486zM15.187 9H8.814V6.75c0-.848.332-1.645.937-2.25A3.16 3.16 0 0 1 12 3.562a3.16 3.16 0 0 1 2.25.938 3.16 3.16 0 0 1 .938 2.25V9z"></path></svg>
                            <h3>비공개</h3>
                        </div>
                    </div>
                    <h2>URL 설정</h2>
                    <div className="URL">
                        <div>/@after7203/</div>
                        <input />
                    </div>
                    <h2>시리즈 설정</h2>
                    <div className="series">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 10H2V12H14V10ZM14 6H2V8H14V6ZM18 14V10H16V14H12V16H16V20H18V16H22V14H18ZM2 16H10V14H2V16Z" fill="currentColor"></path></svg>
                        <h3>시리즈에 추가하기</h3>
                    </div>
                    <div className="btn_wrapper_2">
                        <div className="cancel" onClick={closeDetailModal}>뒤로</div>
                        <div className="upload">출간하기</div>
                    </div>
                    <div className="series_form">
                        <h2>시리즈 설정</h2>
                        <div className="series_add">
                            <input className="series_add_form" placeholder="새로운 시리즈 이름을 입력하세요"/>
                            {/* <input className="series_add_form" placeholder={`/@${}/series/`}> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Write