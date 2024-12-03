const helper = require('./helper.js');
const React = require('react');
const { useState } = React;
const { createRoot } = require('react-dom/client');

const constructAccessories = form => {
    if (!form) return [];
}

const submitEnemyData = e => {
    e.preventDefault();

    const name = e.target.querySelector('#enemy-name').value;
    const type = e.target.querySelector('#enemy-type').value;
    const color = e.target.querySelector('#enemy-color').value;
    const accessories = constructAccessories(e.target.querySelector('#enemy-accessories'));

    if (!(name && type && color)) {
        return false;
    }

    helper.sendPost(e.target.action, {name, type, color, accessories})
}

const setColorSelect = (type) => {
    const colorSelect = document.querySelector("#color-select");

    switch (type){
        case "goomba":
            colorSelect.innerHTML = `<select id='enemy-color' name='color'>
                <option value="brown" selected>Brown</option>
                <option value="green">Green</option>
                <option value="navyblue">Navy Blue</option>
            </select>`
            break;
        case "koopa":
            colorSelect.innerHTML = `<select id='enemy-color' name='color'>
            <option value="red">Red</option>
            <option value="green" selected>Green</option>
            <option value="purple">Purple</option>
            <option value="blue">Blue</option>
            </select>`
            break;
        case "bob-omb":
            colorSelect.innerHTML = `<select id='enemy-color' name='color'>
            <option value="black" selected>Black</option>
            <option value="pink">Pink</option>
            <option value="purple">Purple</option>
            <option value="red">Red</option>
            </select>`
            break;
        case "boo":
            colorSelect.innerHTML = `<select id='enemy-color' name='color'>
            <option value="white" selected>White</option>
            <option value="beige">Beige</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
            </select>`
            break;
    }
}

const EnemyTypeSelect = () => {
    return <select id='enemy-type' name='enemy-type' onChange={e => { setColorSelect(e.target.value); }}>
        <option value="default" selected>Select Enemy Type</option>
        <option value="goomba">Goomba</option>
        <option value="koopa">Koopa</option>
        <option value="bob-omb">Bob-omb</option>
        <option value="boo">Boo</option>
    </select>
}

const AccessorySelect = () => {

}

const EnemyForm = (submitFunction) => {
    return <form 
    action='/maker' 
    method='POST' 
    onSubmit={ e => submitEnemyData(e)}>
        <label for='name'>Name:</label>
        <input type='text' id='enemy-name' name='name'></input>
        <EnemyTypeSelect/>
        <div id='color-select'>
        </div>
        <input type="submit" value="Create your enemy!" />
    </form>
}

const App = () => {
    return <div>
        <EnemyForm />
    </div>
}

const init = () => {
    const root = createRoot(document.querySelector('#app'));
    root.render(<App />);
};

window.onload = init;