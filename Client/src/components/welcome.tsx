import '../css/welcome.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import MediaQuery from 'react-responsive';
import apiService from '../services/apiService';

function Welcome() {

  const navigate = useNavigate();

  return (
    <div className='welcome-page'>
      <MediaQuery minWidth={951}>
        <h1 className='welcome'>WELCOME.</h1>
        <button className='options' onClick={() => navigate('/game')}>PLAY</button>
        <br/>
        <button className='options' onClick={() => navigate('/learning')}>LEARN</button>
      </MediaQuery>
      <MediaQuery maxWidth={951} minWidth={651}>
        <h1 className='welcome-medium'>WELCOME.</h1>
        <button className='options-medium' onClick={() => navigate('/game')}>PLAY</button>
        <br/>
        <button className='options-medium' onClick={() => navigate('/learning')}>LEARN</button>
      </MediaQuery>
      <MediaQuery maxWidth={650}>
        <h1 className='welcome-small'>WEL</h1><h1 className='welcome-small'>COME.</h1>
        <button className='options-small' onClick={() => navigate('/game')}>PLAY</button>
        <br/>
        <button className='options-small' onClick={() => navigate('/learning')}>LEARN</button>
      </MediaQuery>
    </div>
  )
}

export default Welcome;