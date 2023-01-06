import "./UserHome.scss"

const UserHome = () => {
    return (
        <div className="userHome">
            <div className="left"></div>
            <div className="center">
                <div className="menu">
                    <div className="article">
                        글
                    </div>
                    <div className="series">
                        시리즈
                    </div>
                    <div className="introduce">
                        소개
                    </div>
                </div>
                <div className="search"></div>
            </div>
            <div className="right"></div>
        </div>
    )
}

export default UserHome