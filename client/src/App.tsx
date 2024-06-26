import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import { AppContextProvider } from './context/AppContext';
import Home from './views/Home';
import Chat from './views/Chat';
import { TabProvider } from './context/TabContext';
import AddContactView from './views/AddContact';
import NewConversation from './views/NewConversation';
import ContactRequestView from './views/ContactRequestView';


const App = () => {

    return (
        <div className="App">
            <BrowserRouter>
                <AppContextProvider>
                    <TabProvider>
                        <Routes>
                            <Route element={<ProtectedRoutes />}>
                                <Route path='/' element={<Home />} />
                                <Route path='/chat/:contactId' element={<Chat />} />
                                <Route path='/add-contact' element={<AddContactView />} />
                                <Route path='/new-conversation' element={<NewConversation />} />
                                <Route path='/contact-request/:contactId' element={<ContactRequestView />} />
                            </Route>
                            <Route path='/login' element={<Login />} />
                            <Route path='/register' element={<Register />} />
                        </Routes>
                    </TabProvider>
                </AppContextProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
