import './Spinner.scss'

const Spinner = () => {
    return (
        <div className="spinner">
            <img src={require("../../asset/loading.gif")} alt="" />
        </div>
    )
}

export default Spinner