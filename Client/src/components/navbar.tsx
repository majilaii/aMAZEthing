import '../css/navbar.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import MediaQuery from 'react-responsive';
import apiService from '../services/apiService';
import { useAppDispatch } from '../features/hooks';
import { refreshData } from '../features/user_slice';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { loginWithRedirect, logout, user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();

  const toggleNavbar = () => {
    setToggle(!toggle);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    const getMessage = async () => {
      if (isAuthenticated === true) {
        const accessToken = await getAccessTokenSilently();
        console.log(user)
        const data = await apiService.profile(accessToken,user);
        if(data.user) dispatch(refreshData(data.user));
      }
    };
    getMessage();
  }, [user]);

  return (
    <>
      <div className="navbar">
        <div className="navbar-start">
          <button className="button" onClick={() => navigate('/')}>
            aMAZEthing
          </button>
          <MediaQuery minWidth={951}>
            {location.pathname === '/game' && (
              <button className="button" onClick={() => navigate('/learning')}>
                LEARN
              </button>
            )}
            {location.pathname === '/learning' && (
              <button className="button" onClick={() => navigate('/game')}>
                PLAY
              </button>
            )}
            {location.pathname === '/profile' && (
              <button className="button" onClick={() => navigate('/game')}>
                PLAY
              </button>
            )}
            {location.pathname === '/profile' && (
              <button className="button" onClick={() => navigate('/learning')}>
                LEARN
              </button>
            )}
          </MediaQuery>
        </div>
        <div className="navbar-end">
          <MediaQuery minWidth={951}>
            {location.pathname === '/' && (
              <button className="button" onClick={() => navigate('/about')}>
                ABOUT
              </button>
            )}
            {isAuthenticated && !(location.pathname === '/profile') && (
              <button className="button" onClick={() => navigate('/profile')}>
                PROFILE
              </button>
            )}
            {!isLoading && !user && (
              <button className="button" onClick={() => loginWithRedirect()}>
                LOGIN
              </button>
            )}
            {!isLoading && user && (
              <button className="button" onClick={() => logout()}>
                LOGOUT
              </button>
            )}
          </MediaQuery>
          <MediaQuery maxWidth={950}>
            <div
              className="container"
              onClick={() => {
                toggleNavbar();
                toggleModal();
              }}
            >
              <div className={`bar1 ${toggle && 'active'}`} />
              <div className={`bar2 ${toggle && 'active'}`} />
              <div className={`bar3 ${toggle && 'active'}`} />
            </div>
          </MediaQuery>
        </div>
        <MediaQuery maxWidth={950}>
          <div className={`modal-body open-${modalOpen}`}>
            {location.pathname === '/' && (
              <button
                className="button"
                onClick={() => {
                  navigate('/about');
                  toggleModal();
                  toggleNavbar();
                }}
              >
                ABOUT
              </button>
            )}
            {(location.pathname === '/game' || location.pathname === '/profile') && user && (
              <button
                className="button"
                onClick={() => {
                  navigate('/learning');
                  toggleModal();
                  toggleNavbar();
                }}
              >
                LEARN
              </button>
            )}
              {(location.pathname === '/learning' || location.pathname === '/profile') && user && (
              <button
                className="button"
                onClick={() => {
                  navigate('/game');
                  toggleModal();
                  toggleNavbar();
                }}
              >
                GAME
              </button>
            )}
            {!(location.pathname === '/profile') && user && (
              <button
                className="button"
                onClick={() => {
                  navigate('/profile');
                  toggleModal();
                  toggleNavbar();
                }}
              >
                PROFILE
              </button>
            )}
             {!user && (
              <button
                className="button"
                onClick={() => {
                  loginWithRedirect();
                  toggleModal();
                  toggleNavbar();
                }}
              >
                LOGIN
              </button>
            )}
            {user && (
              <button
                className="button"
                onClick={() => {
                  logout();
                  toggleModal();
                  toggleNavbar();
                }}
              >
                LOGOUT
              </button>
            )}
          </div>
        </MediaQuery>
      </div>
    </>
  );
}

export default Navbar;
