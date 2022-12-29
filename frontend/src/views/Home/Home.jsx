import {
  Link
} from 'react-router-dom'
import './Home.scss';
import HomeHeader from '../Header/HomeHeader/HomeHeader';
import HomePreview from '../../components/HomePreview/HomePreview';
import LoginModal from '../LoginModal/LoginModal';
import { useRef, useState } from 'react';

function Home() {
  const [loginToggle, setLoginToggle] = useState(false)
  const loginRef = useRef();
  const toggleLoginModal = () => {
    const target = loginRef.current;
    if (loginToggle) {
      target.classList.remove("on")
      void target.offsetWidth;
      target.classList.add("off")
    }
    else {
      target.classList.remove("off")
      void target.offsetWidth;
      target.classList.add("on")
    }
    setLoginToggle(!loginToggle);
  }

  return (
    <>
      <div className='home'>
        <HomeHeader toggleLoginModal={toggleLoginModal}/>
        <div className='menu'>
          <div className='filter'>
            <div className='trend'>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"></path></svg>
              <div className='string'>트렌딩</div>
            </div>
            <div className='new'>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></svg>
              <div className='string'>최신</div>
            </div>
            <button className='period'>
              이번 주
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </button>
          </div>
          <div className='blank' />
          <div className='more'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="more" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
        </div>
        <div className='home-previews'>
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
          <HomePreview />
        </div>
      </div>
      <LoginModal loginToggle={loginToggle} toggleLoginModal={toggleLoginModal} loginRef={loginRef} />
    </>
  );
}

export default Home;