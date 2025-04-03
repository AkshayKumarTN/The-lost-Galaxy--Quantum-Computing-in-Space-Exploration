import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
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
    <div className="home-main">
      <div className="home-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <img src="/assets/images/The-Lost-Galaxy-Home-icon.png" alt="The Lost Galaxy" height="100" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1em', fontSize: '20px' }}>
          <Link to="/LoginIn" style={{
            //padding: '.5em 1em',
            color: '#8bb2ff',
            textAlign: 'center',
            fontWeight: '400',
            padding: '10px',
            textDecoration: 'none'
          }}>Log in</Link>
          <Link to="/SignUp" style={{ color: '#8bb2ff', textAlign: 'center', fontWeight: '400', border: '1px solid', borderColor: '#8bb2ff', padding: '10px', textDecoration: 'none' }}>Sign up</Link>
        </div>
      </div>

      <div className="home-body">
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
            <HashLink  to="#learnMore" smooth style={{
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
            </HashLink >
            {/* <div><img src="/assets/images/SP-Studio.png" alt="UFO" height="300" /></div> */}
          </div>
        </div>
        <div style={{ marginTop: '5em' }}>
          <h1>About The Lost Galaxy</h1>
          <div className="dynamic-transform-absolute" style={{ right: '0' }}>
            <img src="/assets/images/home-cta-planet.png" alt="planet" height="400" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
            <div id="learnMore">The Lost Galaxy is an epic space adventure game that takes you on a journey through uncharted galaxies,  <br />
              ancient alien civilizations, and thrilling interstellar battles. As a fearless explorer, you'll navigate mysterious <br />
              worlds,uncover hidden secrets, and battle cosmic threats to save the galaxy from impending doom. <br /> <br />
              But there's more—your greatest weapon isn't just your starship, but your mastery of quantum computing.<br />
              Solve complex quantum puzzles, crack alien codes, and use quantum algorithms to unlock technologies <br />
              that can reshape your cosmic destiny.<br /><br />
              Customize your starship, forge alliances, and make choices that shape your destiny.  <br />
              Whether you crave intense space combat, deep exploration, or intriguing storylines,  <br />
              The Lost Galaxy offers an unforgettable adventure among the stars. <br /> <br />
              Are you ready to uncover the secrets of the cosmos? Your journey begins now.</div>
          </div>
        </div>


        <div style={{ margin: '10em 10em 0em 10em' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15em' }}>
            <div style={{ left: '0', position: 'absolute' }}>
              <img src="/assets/images/nebula.webp" alt="rocket" width="588" />
            </div>
            <div style={{ marginLeft: '15em', zIndex: '1' }}>
              <h1>What is Space Exploration?</h1>
              <div>Space Exploration is the investigation and discovery of outer space using astronomy, spacecraft, and advanced technology. <br />
                It involves studying planets, stars, and galaxies, as well as sending robots and astronauts beyond Earth to explore the universe. <br />
                Space exploration helps us understand the origins of the cosmos, search for life beyond Earth, <br />
                and develop new technologies for the future.

              </div>
              <div style={{ marginTop: '2em', display: 'flex', alignItems: 'center', gap: '1em' }}>
                <Link to="/tutorial" style={{
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
                {/* <div><img src="/assets/images/SP-Studio.png" alt="UFO" height="300" /></div> */}
              </div>
            </div>

          </div>
        </div>


        <div style={{ margin: '10em 10em 2em 10em' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10em' }}>
            <div>
              <h1>What is Quantum Computing?</h1>
              <div>Quantum Computing is a cutting-edge technology that uses the principles of quantum physics to process information. <br />
                Unlike traditional computers that use bits (0s and 1s), quantum computers use qubits, which can represent multiple states at once.<br />
                This allows them to solve complex problems much faster than classical computers, revolutionizing fields like cryptography, medicine, and artificial intelligence.</div>
              <div style={{ marginTop: '2em', display: 'flex', alignItems: 'center', gap: '1em' }}>
                <Link to="/tutorial" style={{
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
            <div style={{ right: '0' }}>
              <img src="/assets/images/qc-icon.png" alt="rocket" width="488" />
            </div>
          </div>
        </div>


        {/* <div style={{ margin: '10em 10em 0em 10em' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10em' }}>
            <div className="dynamic-transform" style={{ left: '0' }}>
              <img src="/assets/images/home-cta-rocket.png" alt="rocket" width="288" />
            </div>
            <div>
              <h1>What is Quantum Computing?</h1>
              <div>Quantum Computing is a cutting-edge technology that uses the principles of quantum physics to process information. <br />
                Unlike traditional computers that use bits (0s and 1s), quantum computers use qubits, which can represent multiple states at once.<br />
                This allows them to solve complex problems much faster than classical computers, revolutionizing fields like cryptography, medicine, and artificial intelligence.</div>
              <div style={{ marginTop: '2em', display: 'flex', alignItems: 'center', gap: '1em' }}>
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
          </div>
        </div> 
        */}

      </div>

      <div className="setCourse">
        <div style={{ fontSize: '72px', fontWeight: '500' }}>SET COURSE</div>
        <div style={{ fontSize: '36px', fontWeight: '300' }}>FOR YOUR SPACE ADVENTURE</div>
        <div style={{ marginTop: '2em', display: 'flex', alignItems: 'center', gap: '1em' }}>
          <Link to="/game" style={{
            padding: '.5em 1em',
            color: '#000',
            textAlign: 'center',
            fontSize: '1.25em',
            fontWeight: '600',
            border: '1px solid',
            borderColor: '#8bb2ff',
            textDecoration: 'none',
            background: '#FFF',
          }}>
            PLAY NOW
          </Link>
        </div>
      </div>
      <div className='home-footer'>
        <div>
          <div>Follow Us</div>
          <div style={{fontSize:'24px', padding:'20px 0px 0px 0px'}}>Developers</div>
          <div style={{display:'flex', gap:'2em', padding:'20px 0px'}}>
            <div className='name'>Akshay
              <div className='linkdin-ico' onClick={() => window.open('https://www.linkedin.com/in/akshay-kumar-t-n-093b71232/', '_blank')}>
                <svg xmlns="http://www.w3.org/2000/svg" height="27" width="27" viewBox="0 0 27 27" focusable="false" class="lazy-loaded" aria-busy="false" >
                  <g fill="currentColor" >
                    <path d="M1.91 0h22.363a1.91 1.91 0 011.909 1.91v22.363a1.91 1.91 0 01-1.91 1.909H1.91A1.91 1.91 0 010 24.272V1.91A1.91 1.91 0 011.91 0zm1.908 22.364h3.818V9.818H3.818zM8.182 5.727a2.455 2.455 0 10-4.91 0 2.455 2.455 0 004.91 0zm2.182 4.091v12.546h3.818v-6.077c0-2.037.75-3.332 2.553-3.332 1.3 0 1.81 1.201 1.81 3.332v6.077h3.819v-6.93c0-3.74-.895-5.78-4.667-5.78-1.967 0-3.277.921-3.788 1.946V9.818z" fill="currentColor" fill-rule="evenodd"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div className='name'>Carlos
              <div className='linkdin-ico' onClick={() => window.open('https://www.linkedin.com/in/carlos-valdez/', '_blank')}>
                <svg xmlns="http://www.w3.org/2000/svg" height="27" width="27" viewBox="0 0 27 27" focusable="false" class="lazy-loaded" aria-busy="false" >
                  <g fill="currentColor" >
                    <path d="M1.91 0h22.363a1.91 1.91 0 011.909 1.91v22.363a1.91 1.91 0 01-1.91 1.909H1.91A1.91 1.91 0 010 24.272V1.91A1.91 1.91 0 011.91 0zm1.908 22.364h3.818V9.818H3.818zM8.182 5.727a2.455 2.455 0 10-4.91 0 2.455 2.455 0 004.91 0zm2.182 4.091v12.546h3.818v-6.077c0-2.037.75-3.332 2.553-3.332 1.3 0 1.81 1.201 1.81 3.332v6.077h3.819v-6.93c0-3.74-.895-5.78-4.667-5.78-1.967 0-3.277.921-3.788 1.946V9.818z" fill="currentColor" fill-rule="evenodd"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div className='name'>James
              <div className='linkdin-ico' onClick={() => window.open('https://www.linkedin.com/in/wuchuyuan/', '_blank')}>
                <svg xmlns="http://www.w3.org/2000/svg" height="27" width="27" viewBox="0 0 27 27" focusable="false" class="lazy-loaded" aria-busy="false" >
                  <g fill="currentColor" >
                    <path d="M1.91 0h22.363a1.91 1.91 0 011.909 1.91v22.363a1.91 1.91 0 01-1.91 1.909H1.91A1.91 1.91 0 010 24.272V1.91A1.91 1.91 0 011.91 0zm1.908 22.364h3.818V9.818H3.818zM8.182 5.727a2.455 2.455 0 10-4.91 0 2.455 2.455 0 004.91 0zm2.182 4.091v12.546h3.818v-6.077c0-2.037.75-3.332 2.553-3.332 1.3 0 1.81 1.201 1.81 3.332v6.077h3.819v-6.93c0-3.74-.895-5.78-4.667-5.78-1.967 0-3.277.921-3.788 1.946V9.818z" fill="currentColor" fill-rule="evenodd"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div className='name'>Zaafira
              <div className='linkdin-ico' onClick={() => window.open('https://www.linkedin.com/in/zaafira-hasan-153260140/', '_blank')}>
                <svg xmlns="http://www.w3.org/2000/svg" height="27" width="27" viewBox="0 0 27 27" focusable="false" class="lazy-loaded" aria-busy="false" >
                  <g fill="currentColor" >
                    <path d="M1.91 0h22.363a1.91 1.91 0 011.909 1.91v22.363a1.91 1.91 0 01-1.91 1.909H1.91A1.91 1.91 0 010 24.272V1.91A1.91 1.91 0 011.91 0zm1.908 22.364h3.818V9.818H3.818zM8.182 5.727a2.455 2.455 0 10-4.91 0 2.455 2.455 0 004.91 0zm2.182 4.091v12.546h3.818v-6.077c0-2.037.75-3.332 2.553-3.332 1.3 0 1.81 1.201 1.81 3.332v6.077h3.819v-6.93c0-3.74-.895-5.78-4.667-5.78-1.967 0-3.277.921-3.788 1.946V9.818z" fill="currentColor" fill-rule="evenodd"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div className='name'>Zeel
              <div className='linkdin-ico' onClick={() => window.open('https://www.linkedin.com/in/zeel-desai-8a0143296/', '_blank')}>
                <svg xmlns="http://www.w3.org/2000/svg" height="27" width="27" viewBox="0 0 27 27" focusable="false" class="lazy-loaded" aria-busy="false" >
                  <g fill="currentColor" >
                    <path d="M1.91 0h22.363a1.91 1.91 0 011.909 1.91v22.363a1.91 1.91 0 01-1.91 1.909H1.91A1.91 1.91 0 010 24.272V1.91A1.91 1.91 0 011.91 0zm1.908 22.364h3.818V9.818H3.818zM8.182 5.727a2.455 2.455 0 10-4.91 0 2.455 2.455 0 004.91 0zm2.182 4.091v12.546h3.818v-6.077c0-2.037.75-3.332 2.553-3.332 1.3 0 1.81 1.201 1.81 3.332v6.077h3.819v-6.93c0-3.74-.895-5.78-4.667-5.78-1.967 0-3.277.921-3.788 1.946V9.818z" fill="currentColor" fill-rule="evenodd"></path>
                  </g>
                </svg>
              </div>
            </div>

          </div>
        </div>
        <div style={{fontSize:'18px'}}> Copyright © CCP 1997-2025</div>
      </div>

    </div>
  );
}