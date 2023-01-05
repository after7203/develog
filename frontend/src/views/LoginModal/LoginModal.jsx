import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Link, Navigate, useNavigate } from "react-router-dom";
import "./LoginModal.scss"
import axios from 'axios'
import { useState } from "react";
import { baseURI, userContext } from "../../App";
import { useContext } from "react";

function LoginModal({ loginToggle, toggleLoginModal, loginRef }) {
    const { register, handleSubmit, formState: { isSubmitting }, } = useForm()
    const [id, setId] = useState("default")
    const [pw, setPw] = useState("default")
    const [error, setError] = useState(false)
    const {user, setUser} = useContext(userContext)

    const onSubmit = async (data) => {
        setError(false)
        setId(data.id)
        setPw(data.pw)
        if (id && pw) {
            var res = await axios.post(`${baseURI}/api/users/login`, data)
        }
        else {
            return;
        }
        if (res.data.success) {
            setUser(data.id)
            localStorage.setItem("user",data.id);
            toggleLoginModal()
        }
        else {
            setError(true)
        }
    }

    return (
        <div className={loginToggle ? "login_modal_bg on" : "login_modal_bg off"}>
            <div className="login_modal" ref={loginRef}>
                <div className="gray_block">
                    <img src="https://static.velog.io/static/media/undraw_joyride_hnno.fae6b95e.svg" />
                    <div className="welcome">환영합니다!</div>
                </div>
                <div className="white_block">
                    <div className="exit_wrapper">
                        <svg className="exit_btn" onClick={toggleLoginModal} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" tabindex="1" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                    </div>
                    <h1>로그인</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h4>아이디</h4>
                        <input type="text" placeholder="아이디를 입력하세요." {...register("id")} />
                        {id == "" && <h5>아이디를 입력해주세요</h5>}
                        <h4>비밀번호</h4>
                        <input type="password" placeholder="비밀번호를 입력하세요." {...register("pw")} />
                        {pw == "" ? <h5>비밀번호를 입력해주세요</h5> : error && <h5>아이디 또는 비밀번호를 확인해주세요</h5>}
                        <button type="submit" disabled={isSubmitting}>로그인</button>
                    </form>
                    <h4>소셜 계정으로 로그인</h4>
                    <div className="btn_group">
                        <div className="github_btn">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><mask id="github" width="20" height="20" x="0" y="0" maskUnits="userSpaceOnUse"><path fill="#ffffff" fill-rule="evenodd" d="M6.69 15.944c0 .08-.093.145-.21.145-.133.012-.226-.053-.226-.145 0-.081.093-.146.21-.146.12-.012.226.053.226.146zm-1.255-.182c-.028.08.053.173.174.198.105.04.226 0 .25-.081.024-.08-.053-.173-.174-.21-.104-.028-.221.012-.25.093zm1.783-.068c-.117.028-.198.104-.186.197.012.08.117.133.238.105.117-.028.198-.105.186-.186-.012-.076-.121-.129-.238-.116zM9.87.242C4.278.242 0 4.488 0 10.08c0 4.471 2.815 8.298 6.835 9.645.516.093.697-.226.697-.488 0-.25-.012-1.63-.012-2.476 0 0-2.822.605-3.415-1.202 0 0-.46-1.173-1.121-1.475 0 0-.924-.633.064-.621 0 0 1.004.08 1.557 1.04.883 1.557 2.363 1.109 2.94.843.092-.645.354-1.093.645-1.36-2.255-.25-4.529-.576-4.529-4.455 0-1.109.307-1.665.952-2.375-.105-.262-.448-1.342.105-2.738C5.56 4.157 7.5 5.51 7.5 5.51a9.474 9.474 0 0 1 2.532-.344c.86 0 1.726.117 2.533.343 0 0 1.939-1.355 2.782-1.089.552 1.4.21 2.476.105 2.738.645.714 1.04 1.27 1.04 2.375 0 3.891-2.375 4.202-4.63 4.456.372.319.686.923.686 1.87 0 1.36-.012 3.041-.012 3.372 0 .262.186.58.698.488C17.266 18.379 20 14.552 20 10.08 20 4.488 15.464.24 9.871.24zM3.919 14.149c-.052.04-.04.133.029.21.064.064.157.093.21.04.052-.04.04-.133-.029-.21-.064-.064-.157-.092-.21-.04zm-.435-.326c-.028.052.012.117.093.157.064.04.145.028.173-.028.028-.053-.012-.117-.093-.158-.08-.024-.145-.012-.173.029zm1.306 1.435c-.064.053-.04.174.053.25.092.093.21.105.262.04.052-.052.028-.173-.053-.25-.088-.092-.21-.104-.262-.04zm-.46-.593c-.064.04-.064.146 0 .238.065.093.174.133.226.093.065-.053.065-.157 0-.25-.056-.093-.16-.133-.225-.08z" clip-rule="evenodd"></path></mask><g mask="url(#github)"><path fill="currentColor" d="M0 0h20v20H0z"></path></g></svg>
                        </div>
                        <div className="google_btn">
                            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#4285F4" d="M19.99 10.187c0-.82-.069-1.417-.216-2.037H10.2v3.698h5.62c-.113.92-.725 2.303-2.084 3.233l-.02.124 3.028 2.292.21.02c1.926-1.738 3.037-4.296 3.037-7.33z"></path><path fill="#34A853" d="M10.2 19.931c2.753 0 5.064-.886 6.753-2.414l-3.218-2.436c-.862.587-2.017.997-3.536.997a6.126 6.126 0 0 1-5.801-4.141l-.12.01-3.148 2.38-.041.112c1.677 3.256 5.122 5.492 9.11 5.492z"></path><path fill="#FBBC05" d="M4.398 11.937a6.008 6.008 0 0 1-.34-1.971c0-.687.125-1.351.329-1.971l-.006-.132-3.188-2.42-.104.05A9.79 9.79 0 0 0 .001 9.965a9.79 9.79 0 0 0 1.088 4.473l3.309-2.502z"></path><path fill="#EB4335" d="M10.2 3.853c1.914 0 3.206.809 3.943 1.484l2.878-2.746C15.253.985 12.953 0 10.199 0 6.211 0 2.766 2.237 1.09 5.492l3.297 2.503A6.152 6.152 0 0 1 10.2 3.853z"></path></svg>
                        </div>
                        <div className="facebook_btn">
                            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><mask id="facebook" width="12" height="20" x="4" y="0" maskUnits="userSpaceOnUse"><path fill="#fff" fill-rule="evenodd" d="M7.84 20v-8.945H4.844V7.5H7.84V4.7C7.84 1.655 9.7 0 12.414 0c1.3 0 2.418.098 2.742.14v3.18h-1.883c-1.476 0-1.761.703-1.761 1.73V7.5h3.332l-.457 3.555h-2.875V20" clip-rule="evenodd"></path></mask><g mask="url(#facebook)"><path fill="#fff" d="M0 0h20v20H0z"></path></g></svg>
                        </div>
                    </div>
                    <div className="foot">
                        <span>아직 회원이 아니신가요?</span>
                        <Link to="register" className="signup_btn">회원가입</Link>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default LoginModal