import React, { useState } from 'react';

export const Hello: React.FC = () => {
    const [counter, setCounter] = useState<number>(0);

    const increment = () => {
        setCounter(counter + 1);
    };

    return (
        <div>
            <button onClick={increment}>Click Me</button>
            <p>You've pressed the button {counter} times.</p>
        </div>
    );
};
