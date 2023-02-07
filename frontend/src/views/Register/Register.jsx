import { Form, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios'
import "./Register.scss"
import { useContext, useState } from "react";
import { userContext } from "../../App";
import { useEffect } from "react";

const Register = () => {
    const { register, handleSubmit, formState: { isSubmitting }, } = useForm({ mode: "onChange" })
    const [errorID, setErrorID] = useState("")
    const [errorPw, setErrorPw] = useState("")
    const [errorPwConfirm, setErrorPwConfirm] = useState("")
    const navigate = useNavigate()
    const { user, setUser } = useContext(userContext)

    useEffect(() => {
        document.getElementsByTagName('title')[0].innerText = '회원가입'
    })

    const onSubmit = async (data) => {
        const { id, pw, pw_confirm } = data;
        setErrorID("")
        setErrorPw("")
        setErrorPwConfirm("")
        if (id == "") {
            setErrorID("아이디를 입력해주세요")
        }
        if (pw == "") {
            setErrorPw("비밀번호를 입력해주세요")
        }
        if (pw_confirm == "") {
            setErrorPwConfirm("비밀번호를 입력해주세요")
        }
        if (pw && pw != pw_confirm) {
            setErrorPwConfirm("비밀번호가 일치하지 않습니다")
        }
        if (id && pw && pw == pw_confirm) {
            const res = await axios.post(`${process.env.REACT_APP_SERVER_URI}/api/users/register`, { id: id, pw: pw })
            if (res.data.user) {
                setUser(res.data.user)
                sessionStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/")
            }
            else {
                setErrorID("이미 존재하는 아이디입니다")
            }
        }
    }

    return (
        <div className="register">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>환영합니다!</h1>
                <h3>기본 회원 정보를 등록해주세요.</h3>
                <div className="id"><h4>아이디</h4></div>
                <input type="text" placeholder="아이디를 입력하세요" {...register("id")}></input>
                <h5>{errorID}</h5>
                <h4>비밀번호</h4>
                <input type="password" autoComplete="off" placeholder="비밀번호를 입력하세요" {...register("pw")}></input>
                <h5>{errorPw}</h5>
                <h4>비밀번호 확인</h4>
                <input type="password" autoComplete="off" placeholder="비밀번호를 한번 더 입력하세요" {...register("pw_confirm")}></input>
                <h5>{errorPwConfirm}</h5>
                <div className="btn_group">
                    <button className="cancle" onClick={() => navigate("/")}>취소</button>
                    <input className="ensure" type="submit" disabled={isSubmitting} value='확인'></input>
                </div>
            </form>
        </div>
    )
}

export default Register