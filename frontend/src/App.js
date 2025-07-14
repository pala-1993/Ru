import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouletteApp from "./components/RouletteApp";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RouletteApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;