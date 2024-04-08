import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import { AppContextProvider } from './context/AppContext';
import Home from './views/Home';
import Chat from './views/Chat';


const App = () => {

    return (
        <div className="App">
            <BrowserRouter>
                <AppContextProvider>
                    <Routes>
                        <Route element={<ProtectedRoutes/>}>
                            <Route path='/' element={<Home />} />
                            <Route path='/chat/:contactId' element={ <Chat />} />
                        </Route>
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                    </Routes>
                </AppContextProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
