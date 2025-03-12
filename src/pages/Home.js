import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Import the CSS

export default function Home() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.documentElement.style.setProperty('--mousex-delta', x.toFixed(2));
      document.documentElement.style.setProperty('--mousey-delta', y.toFixed(2));
    };

    const handleScroll = () => {
      const scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty('--scroll-delta', scrollY.toFixed(2));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ padding: '10px 20px', background: 'black', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <img src="/assets/images/The-Lost-Galaxy-Home-icon.png" alt="The Lost Galaxy" height="100" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1em', fontSize: '20px' }}>
          <a style={{ color: '#8bb2ff', textAlign: 'center', fontWeight: '400', textDecoration: 'none' }}>Log in</a>
          <a style={{ color: '#8bb2ff', textAlign: 'center', fontWeight: '400', border: '1px solid', borderColor: '#8bb2ff', padding: '10px', textDecoration: 'none' }}>Sign up</a>
        </div>
      </div>

      <div style={{ display: 'flex', flexFlow: 'column', padding: '20px', color: '#FFF', marginTop: '30px' }}>
        <div className="dynamic-transform-absolute" style={{ right: '0' }}>
          <img src="/assets/images/alien spaceships ufo with blue.png" alt="UFO" height="800" />
        </div>

        <div >
          <div style={{ position: 'relative', fontSize: '40px', color: '#8bb2ff' }}>
            Welcome
            <div style={{ position: 'absolute', bottom: '-5px', left: '0', width: '6vw', height: '2px', background: '#8bb2ff' }} />
          </div>
          <div><h1 style={{ fontSize: '100px', margin: '10px 0px' }}>Quantum Computing <br /> in Space Exploration</h1></div>

        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
            <Link to="/game" style={{
              padding: '.5em 1em',
              color: '#8bb2ff',
              textAlign: 'center',
              fontSize: '1.25em',
              fontWeight: '600',
              border: '1px solid',
              borderColor: '#8bb2ff',
              textDecoration: 'none'
            }}>
              Start Game
            </Link>
            <Link to="/game" style={{
              padding: '.5em 1em',
              color: '#8bb2ff',
              textAlign: 'center',
              fontSize: '1.25em',
              fontWeight: '600',
              border: '1px solid',
              borderColor: '#8bb2ff',
              textDecoration: 'none'
            }}>
              Learn More
            </Link>
          </div>
        </div>
        <div>
          <h1>What is Quantum Computing?</h1>
          <div className="dynamic-transform-absolute" style={{ right: '0' }}>
            <img src="/assets/images/home-cta-planet.png" alt="planet" height="400" />
          </div>

          <div className="dynamic-transform-absolute" style={{ left: '0' }}>
            <img src="/assets/images/home-cta-rocket.png" alt="rocket" width="288" />
          </div>
        </div>
      </div>
    </div>
  );
}