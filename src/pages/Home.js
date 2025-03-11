import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to The Lost Galaxy</h1>
      <p>Click the button below to start the game!</p>
      
      <Link 
        to="/game"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '5px',
          textDecoration: 'none',
          marginRight: '10px'
        }}
      >
        Start Game
      </Link>

      <Link 
        to="/tutorial"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: '#fff',
          borderRadius: '5px',
          textDecoration: 'none'
        }}
      >
        Tutorial
      </Link>
    </div>
  );
}
