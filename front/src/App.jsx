import React from 'react';
import EventList from './components/EventList.jsx';

function App() {
  const userRole = 'Participante';
  return (
    <>
      <div className="App">
        <EventList userRole={userRole} />
      </div>
    </>
  )
}

export default App
