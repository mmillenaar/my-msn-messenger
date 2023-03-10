import React from 'react';
import Chat from './components/Chat/Chat';
import MessageForm from './components/MessageForm/MessageForm';

function App() {

  return (
    <div className="App">
      <h1>chat</h1>
      <MessageForm />
      <Chat />
    </div>
  );
}

export default App;
