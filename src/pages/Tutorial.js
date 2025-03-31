import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tutorial.css';

const slides = [
  {
    title: "Introduction to Quantum Computing",
    content: (
      <>
        <p>A new computing paradigm leveraging quantum mechanics principles.</p>
        <p>Uses <strong>qubits</strong> instead of classical bits (0s and 1s).</p>
        <ul>
          <li><strong>Superposition</strong>: Qubits can be in both 0 and 1 states simultaneously.</li>
          <li><strong>Entanglement</strong>: Qubits can be strongly correlated.</li>
          <li><strong>Quantum Parallelism</strong>: Ability to process multiple states at once.</li>
        </ul>
      </>
    )
  },
  {
    title: "Qubits, Superposition, and Measurement",
    content: (
      <>
        <p>A qubit is represented as |0⟩ and |1⟩, but can be in a superposition.</p>
        <p><strong>Superposition:</strong> Qubits exist in a mix of states until measured.</p>
        <p>Measurement collapses the state into either 0 or 1.</p>
        <p>The <strong>Bloch Sphere</strong> visualizes qubits as points on a sphere.</p>
      </>
    )
  },
  {
    title: "Quantum Gates and Operations",
    content: (
      <>
        <p>Quantum gates manipulate qubits and are reversible.</p>
        <ul>
          <li><strong>Hadamard Gate (H)</strong>: Creates superposition.</li>
          <li><strong>Pauli-X Gate (X)</strong>: Like a NOT gate, flips 0↔1.</li>
          <li><strong>CNOT Gate</strong>: A two-qubit gate used for entanglement.</li>
        </ul>
        <p>Quantum circuits combine multiple gates to perform computations.</p>
      </>
    )
  },
  {
    title: "Applications and Future of Quantum Computing",
    content: (
      <>
        <p>Potential applications include:</p>
        <ul>
          <li><strong>Cryptography</strong>: Shor’s algorithm for breaking RSA encryption.</li>
          <li><strong>Optimization</strong>: Solving complex logistics problems.</li>
          <li><strong>Drug Discovery</strong>: Simulating molecular interactions.</li>
          <li><strong>Machine Learning</strong>: Quantum-enhanced data processing.</li>
        </ul>
        <p>Challenges: Decoherence, error correction, and scalability.</p>
        <p>Future outlook: Advancements in quantum hardware by Google, IBM, etc.</p>
      </>
    )
  },
  {
    title: "Introduction to Space Exploration",
    content: (
      <>
        <p>Space exploration is the ongoing discovery and exploration of celestial structures in outer space.</p>
        <p>Key milestones include:</p>
        <ul>
          <li><strong>1957:</strong> Launch of Sputnik 1, the first artificial satellite.</li>
          <li><strong>1969:</strong> Apollo 11 lands the first humans on the Moon.</li>
          <li><strong>1998:</strong> Launch of the International Space Station (ISS).</li>
        </ul>
      </>
    )
  },
  {
    title: "Spacecraft and Rockets",
    content: (
      <>
        <p>Space travel relies on advanced spacecraft and rocket technology.</p>
        <ul>
          <li><strong>Satellites:</strong> Used for communication, navigation, and Earth observation.</li>
          <li><strong>Space Probes:</strong> Unmanned spacecraft sent to explore distant planets.</li>
          <li><strong>Reusable Rockets:</strong> Innovations by companies like SpaceX reduce costs.</li>
        </ul>
      </>
    )
  },
  {
    title: "Human Space Missions and Colonization",
    content: (
      <>
        <p>Human space exploration is focused on long-term missions and colonization.</p>
        <ul>
          <li><strong>ISS:</strong> A collaborative space station for research.</li>
          <li><strong>Moon Missions:</strong> NASA’s Artemis program aims to return humans to the Moon.</li>
          <li><strong>Mars Colonization:</strong> SpaceX and NASA plan to send humans to Mars in the future.</li>
        </ul>
      </>
    )
  },
  {
    title: "The Future of Space Exploration",
    content: (
      <>
        <p>Future advancements in space exploration focus on deep space travel and new technologies.</p>
        <ul>
          <li><strong>Interstellar Travel:</strong> Concepts like warp drives and antimatter propulsion.</li>
          <li><strong>Space Mining:</strong> Extracting resources from asteroids.</li>
          <li><strong>Exoplanet Exploration:</strong> Searching for habitable planets.</li>
        </ul>
        <p>International cooperation and private sector involvement are key drivers of progress.</p>
      </>
    )
  }
];

const Tutorial = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => setIndex((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="tutorial-container">
      <div className="slide">
        <h2>{slides[index].title}</h2>
        <div className="slide-content">{slides[index].content}</div>
      </div>
      <div className="navigation">
        <button onClick={prevSlide} disabled={index === 0}>Previous</button>
        <button onClick={nextSlide} disabled={index === slides.length - 1}>Next</button>
      </div>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default Tutorial;
