import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import './Series.scss'

const Series = () => {
    const [series, setSeries] = useState(null)
    const { user, series_url } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URI}/api/users/series`, { params: { id: user } }).then((res) => {
            res.data.userSeries.map(series => {
                if (series.url === series_url) {
                    setSeries(series)
                }
            })
        })
    }, [])
    return (
        <>
            {
                series &&
                <div className="series_jsx">
                    <h1>{series.name}</h1>
                    {series.boards.map((board, index) => (
                        <div className="wrapper" key={index}>
                            <div className="name">
                                <h3 className="index">{index + 1}.</h3>
                                <h3 onClick={() => navigate(`/@${board.writer.id}/${board.url}`)}>{board.title}</h3>
                            </div>
                            <div className="contents">
                                <div className="left" onClick={() => navigate(`/@${board.writer.id}/${board.url}`)}>
                                    <img src={`${process.env.REACT_APP_SERVER_URI}/${board.thumbnail}`} alt="" />
                                </div>
                                <div className="right">
                                    <h4>{board.brief}</h4>
                                    <h5>{board.createAt}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}

export default Series