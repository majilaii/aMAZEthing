import { useNavigate } from 'react-router-dom';
import '../../css/gameOver.css';
import { useAppSelector } from '../../features/hooks';

function GameOver ({currentPlayer} : {
  currentPlayer: 'p1' | 'p2'
}) {

  const {finalGameStats} = useAppSelector(state => state.game);

  let win = finalGameStats.p1Towers.length > finalGameStats.p2Towers.length;
  if (finalGameStats.p1Towers.length === finalGameStats.p2Towers.length) win = finalGameStats.p1Coins > finalGameStats.p2Coins;
  if (currentPlayer === 'p2') win = !win;

  const navigate = useNavigate();

  return (
    <div className={`gameOver ${win ? '' : 'lose'}`}>
      <div className='gameOverModal'>
        <div className="header">
          <h1>{win ? 'VICTORY' : 'LOSE'}</h1>
          <h2>GAME STATS</h2>
        </div>
        <div className="player">
          <h2 className={win ? 'win' : 'loser'}>You</h2>
          <div className="stats">
            <h2>Minions</h2>
            <h2 className="value">
              {currentPlayer === 'p1' ? finalGameStats.p1MinionCount : finalGameStats.p2MinionCount}
            </h2>

            <h2>GOLD</h2>
            <h2 className="value">
              {currentPlayer === 'p1' ? finalGameStats.p1Coins : finalGameStats.p2Coins}
            </h2>

            <h2>Towers</h2>
            <h2 className="value">
            {currentPlayer === 'p1' ? finalGameStats.p1Towers.length : finalGameStats.p2Towers.length}
            </h2>
          </div>
        </div>
        <div className="player">
          <h2 className={win ? 'loser' : 'win'}>Opponent</h2>
          <div className="stats">
            <h2>Minions</h2>
            <h2 className="value">
              {currentPlayer === 'p2' ? finalGameStats.p1MinionCount : finalGameStats.p2MinionCount}
            </h2>

            <h2>GOLD</h2>
            <h2 className="value">
              {currentPlayer === 'p2' ? finalGameStats.p1Coins : finalGameStats.p2Coins}
            </h2>

            <h2>Towers</h2>
            <h2 className="value">
            {currentPlayer === 'p2' ? finalGameStats.p1Towers.length : finalGameStats.p2Towers.length}
            </h2>
          </div>
        </div>
        <button className='game-over-button' onClick={() => navigate('/waitingRoom')}>Go Back</button>
      </div>
    </div>
  )
}

export default GameOver;