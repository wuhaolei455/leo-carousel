import React from 'react';
import { Carousel } from 'leo-carousel';
import 'leo-carousel/dist/index.css';
import './App.css';

const images = [
  'https://images.unsplash.com/photo-1599394022839-a72390509a25?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1593642532842-98d0775d8da9?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1606787620651-3f8e1d6b16c3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1621609764095-b32635d7dd66?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
];

function App() {
  return (
    <div className="App">
      <h1>React Carousel SDK</h1>
      <div className="carousel-wrapper">
        <Carousel images={images} />
      </div>
    </div>
  );
}

export default App;
