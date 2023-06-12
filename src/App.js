import React from 'react';
import './App.css';
import FeeStatusModule from './FeeStatusModule';

function App() {
  const officer = {
    name: 'Jobin Jolly',
    email: 'jobinjolly@gmail.com',
  };
    const students = [
      // Your student data here...
    ];
  

  return (
    <div>
      <FeeStatusModule officer={officer} students={students} />
    </div>
  );
}

export default App;