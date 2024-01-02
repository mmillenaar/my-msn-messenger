import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './views/Login';
import Register from './views/Register';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import { AppContextProvider } from './Context/AppContext';
import Home from './views/Home';
// import Chat from './components/Chat/Chat';
// import MessageForm from './components/MessageForm/MessageForm';


const App = () => {

    return (
        <div className="App">
            <BrowserRouter>
                <AppContextProvider>
                    <Routes>
                        <Route element={<ProtectedRoutes/>}>
                            <Route path='/' element={<Home />} />
                        </Route>
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                    </Routes>
                    {/* <h1>chat</h1>
                    <MessageForm />
                    <Chat /> */}
                </AppContextProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
