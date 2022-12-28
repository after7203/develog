import './HomePreview.scss'

function HomePreview() {
    return (
        < div className='home-preview'>
            <img className='thumbnail' src="https://velog.velcdn.com/images/tosspayments/post/2a8da37d-dbe2-4cd6-9be0-1398b9f816ea/image.jpg" />
            <div className='title'>동료들은 다 아는 정보, 나만 모르지 않게</div>
            <div className='content'>매일 5분만 투자하면 더 이상 업계의 중요한 정보들을 놓칠까봐 걱정할 필요가 없어요. 아직은 많이 부족한 서비스이지만 이제 막 출발선 앞에 도착한 저희 팀의 여정에 함께해 주시면 진심으로 감사하겠습니다.</div>
            <div className='day-reply'>6일 전·11개의 댓글</div>
            <div className='below-info'>
                <div className='bi-left'>
                    <img className="bi-thumb" src='https://velog.velcdn.com/images/tosspayments/profile/b8fbda89-6591-41ea-b280-582674fcff7a/image.jpg' />
                    <div className="by">by</div>
                    <div>after7203</div>
                </div>
                <div className='bi-right'>
                    <svg width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z"></path></svg>
                    <div>38</div>
                </div>
            </div>
        </div >
    )
}

export default HomePreview