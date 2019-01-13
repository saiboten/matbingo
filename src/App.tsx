import React, { useState, ChangeEvent, ChangeEventHandler } from 'react';

function App() {

    const [counter, setCounter] = useState(0);

    return (
      <div>
        <header>

        </header>
        <div>

          <div><p>Hei</p></div>
          <input value={counter} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCounter(parseInt(e.target.value))}></input>
        </div>
      </div>
    );
}

export default App;
