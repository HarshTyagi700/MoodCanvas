import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import PinterestNavbar from './components/navbar/CustomNavbar';
import SearchPin from './components/searchPins/searchedPins';
import { Register } from './components/register/register';
import {Login} from './components/login/login';
import NoteState from './context/NoteState';
import Modal from './components/temp/modal';
import CreatePin from './components/createpin/createpin';
import MyBoards from './components/mypinboards/myboards';
function App() {
  return ( 
    <div>
         <BrowserRouter>
     
  <NoteState>
      <PinterestNavbar/>
   
    
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/search" element={<SearchPin/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/modal" element={<Modal/>} />
      <Route path="/createpin" element={<CreatePin/>} />
      <Route path="/myboards" element={<MyBoards/>} />

    </Routes>
    </NoteState>
  
      </BrowserRouter>
      
    </div>
    
  );
}

export default App;
