import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
       <Navbar />
        <Routes>
          
          <Route path="/login" element={<Login />} />
        </Routes>
    
    </div>
  );
}

export default App;
