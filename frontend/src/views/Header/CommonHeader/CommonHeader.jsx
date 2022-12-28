import {
    Link,
  } from 'react-router-dom';

function CommonHeader() {
    return (
        <>
            <Link to="/"><img src={require("../../asset/logo_2.png")} /></Link>
        </>
    );
}

export default CommonHeader;