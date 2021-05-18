import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    const handleTest = () => {
        fetch('/api/lti_launches', {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${window.DEFAULT_JWT}`
            }
        }).then((res) => {
            console.log(res.text());
        });
    }
    return (
        <div>
            <img id="usu-logo" src="/vertical_logo_blue.png" />
            <h1>Welcome to the LTI Starter App</h1>
            <button onClick={handleTest}>TEST</button>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("app"));