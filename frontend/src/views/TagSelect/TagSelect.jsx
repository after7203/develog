import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"
import "./TagSelect.scss"
import { useParams } from "react-router-dom";
import ColumnPreview from "../../components/ColumnPreview/ColumnPreview";
import axios from "axios";

const TagSelect = () => {
    const [boards, setBoards] = useState([])
    const { tag } = useParams()
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URI}/api/board?tag=${tag}`).then((res) => {
            setBoards(res.data.boards)
        })
        document.getElementsByTagName('title')[0].innerText = `#${tag}`
    }, [])
    return (
        <div className="tagSelect">
            {boards &&
                <div className="wrapper">
                    {boards.map(board => (
                        <ColumnPreview writer key={JSON.stringify(board)} board={board} />
                    ))}
                </div>
            }
        </div>
    )
}

export default TagSelect