const helper = require('./helper.js');
const React = require('react');
const { useState } = React;
const { createRoot } = require('react-dom/client');

const constructAccessories = form => {
    let accessories = []
    if (!form) return accessories;

    for (const input of form.children){
        if (input.tagName.toLowerCase() == 'input' && input.checked) accessories.push(input.name);
    }
    return accessories;
}

const submitEnemyData = e => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#enemy-name').value;
    const type = e.target.querySelector('#enemy-type').value;  
    const color = e.target.querySelector('#enemy-color').value;
    const accessories = constructAccessories(e.target.querySelector('#enemy-accessories'));

    if (!(name && type && color)) {
        helper.handleError('Name, type and color required!');
        return false;
    }
    
    helper.sendPost(e.target.action, {name, type, color, accessories}, refreshFields());
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

const refreshFields = () => {
    document.querySelector("#color-select").innerHTML = '';
    document.querySelector("#enemy-name").value = '';

    const typeSelect = document.querySelector("#enemy-type");
    for (let child of typeSelect.children){
        child.selected = child.value == 'default';
    }

    const accessorySelect = document.querySelector("#enemy-accessories");
    for (let child of accessorySelect.children){
        child.value = false;
    }
    helper.handleError("Minion submitted!");
}

const EnemyTypeSelect = () => {
    return <select id='enemy-type' name='type' onChange={e => { setColorSelect(e.target.value); helper.hideError(); }}>
        <option value="default" selected>Select Species</option>
        <option value="goomba">Goomba</option>
        <option value="koopa">Koopa</option>
        {/* <option value="bob-omb">Bob-omb</option> */}
        <option value="boo">Boo</option>
    </select>
}

const AccessorySelect = () => {
    return <div id='enemy-accessories'>
        <h3>Accessories:</h3>
        <label for='spike-helmet'>Spike Helmet</label>
        <input type='checkbox' name='spike-helmet'/>
    </div>
}

const EnemyForm = (submitFunction) => {
    return <form 
    action='/maker' 
    method='POST' 
    onSubmit={ e => submitEnemyData(e)}>
        <label for='name'>Name:</label>
        <input type='text' id='enemy-name' name='name' />
        <EnemyTypeSelect/>
        <div id='color-select'>
        </div>
        <AccessorySelect/>
        <input type="submit" value="Create your enemy!" />
    </form>
}

const App = () => {
    return <div>
        <EnemyForm />
        <h1 id='error-message'></h1>
    </div>
}

const init = () => {
    const root = createRoot(document.querySelector('#app'));
    root.render(<App />);
};

window.onload = init;