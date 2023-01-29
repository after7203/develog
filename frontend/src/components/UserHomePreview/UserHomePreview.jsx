import "./UserHomePreview.scss"

const UserHomePreview = () => {
    return (
        <div className="userHomePreview">
            <img src="https://velog.velcdn.com/images/after7203/post/4b46bce7-af8b-48b5-b7ca-560b767b4a4c/image.png" />
            <h2>[프로젝트 develog] 3. bcrypt, jwt 추가</h2>
            <h4>로그인을 구현할 때 서버 api 요청을 할때 user state만 설정되어있으면 가능하도록 하면 상관없지않을까 했는데.. 생각이 짧았다.크래커가 직접 http 패킷을 만들어 보내면 로그인 하지 않더라도 접근할 수 있게된다.또한 패스워드를 db에 저장할 때 암호화를 해주</h4>
            <div className="tag_wrapper">
                {<div className="tag">Develog</div>}
            </div>
            <div className="below">
                <h5>2023년 1월 16일 · 0개의 댓글 · </h5>
                <svg height="100%" viewBox="0 0 24 24"><path fill="currentColor" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z"></path></svg>
                <h5>0</h5>
            </div>
        </div>
    )
}

export default UserHomePreview