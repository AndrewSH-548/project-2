const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const {createRoot} = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const eyeColor = e.target.querySelector('#domoEyeColor').value;

    if (!(name && age && eyeColor)) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, eyeColor}, onDomoAdded);
    return false;
}

const deleteDomo = (e, id, onDelete) => {
    e.preventDefault();
    helper.hideError();

    if (!id){
        helper.handleError('No id found!');
        return false;
    }

    helper.sendDelete('/maker', {id}, onDelete);
    return false;
}

const DomoForm = props => {
    return <form id="domoForm"
        onSubmit={e => handleDomo(e, props.triggerReload)}
        name="domoForm"
        action="/maker"
        method='POST'
        className='domoForm' 
    >
        <label htmlFor="name">Name: </label>
        <input type="text" id="domoName" name="name" placeholder="Domo Name" />
        <label htmlFor="age">Age: </label>
        <input type="number" id="domoAge" name="age" min="0" />
        <label htmlFor="eyeColor">Eye Color: </label>
        <select id="domoEyeColor" name="eyeColor">
            <option>Red</option>
            <option>Black</option>
            <option>Blue</option>
            <option>Gray</option>
            <option>Brown</option>
        </select>
        <input type="submit" className="makeDomoSubmit" value="Make Domo" />
    </form>;
}

const DomoList = props => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return <div className="domoList">
            <h3 className="emptyDomo">No Domos Yet!</h3>
        </div>;
    };

    const domoNodes = domos.map(domo => {
        return <div key={domo._id} className="domo">
            <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
            <h3 className="domoName">Name: {domo.name}</h3>
            <h3 className="domoAge">Age: {domo.age}</h3>
            <h3 className="domoEyeColor">Eye Color: {domo.eyeColor}</h3>
            <button onClick={ e => { deleteDomo(e, domo._id, props.triggerReload);} }>Delete</button>
        </div>
    });

    return <div className="domoList">
        {domoNodes}
    </div>
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return <div>
        <div id="makeDomo">
            <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)}/>
        </div>
        <div id="domos">
            <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => setReloadDomos(!reloadDomos)}/>
        </div>
    </div>
}

const init = () => {
    const root = createRoot(document.querySelector('#app'));
    root.render( <App />);
};

window.onload = init;