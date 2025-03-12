// Scrum-1 tutorial for Quantum
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
