const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect, useRef } = React;
const { createRoot } = require('react-dom/client');
const { EnemyTypeSelect, ColorSelect, AccessorySelect } = require('./components.jsx');

const submitEnemyData = (e, resetFunction, id) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#enemy-name').value;
    const type = e.target.querySelector('#enemy-type').value;
    if (!(name && type)) {
        helper.handleError('Name, type and color required!');
        return false;
    }

    const color = e.target.querySelector('#enemy-color').value;
    const accessories = helper.constructAccessories(e.target.querySelectorAll('.accessory-checkbox'));

    if (!(name && type && color)) {
        helper.handleError('Name, type and color required!');
        return false;
    }

    if (id) helper.sendPut(e.target.action, { id, name, type, color, accessories }, refreshFields(resetFunction));
    else helper.sendPost(e.target.action, { name, type, color, accessories }, refreshFields(resetFunction));
}

const refreshFields = (resetEnemyType) => {
    document.querySelector("#enemy-name").value = '';
    resetEnemyType(null);

    const typeSelect = document.querySelector("#enemy-type");
    for (let child of typeSelect.children) {
        child.selected = child.value == 'default';
    }

    const accessorySelect = document.querySelectorAll(".accessory-checkbox");
    for (let input of accessorySelect) {
        input.checked = false;
    }
    helper.handleError("Minion submitted!");
}

const EnemyForm = selectedEnemy => {
    const [showColorSelect, setShowColorSelect] = useState(false);
    const [enemyType, setEnemyType] = useState(null);
    
    return <form
        action='/maker'
        method='POST'
        id='enemy-form'
        className='mainForm'
        onSubmit={e => submitEnemyData(e, setEnemyType)}>
        <label for='name'>Name:</label>
        <input type='text' id='enemy-name' name='name' maxLength={11}/>
        <EnemyTypeSelect setEnemyType={setEnemyType} setShowColorSelect={setShowColorSelect} selectedEnemy={selectedEnemy} />
        {showColorSelect && <ColorSelect options={[]} type={enemyType} />}
        <AccessorySelect accessories={[]}/>
        <input type="submit" className="formSubmit" value="Employ your minion!" />
    </form>
}

const init = () => {
    const root = createRoot(document.querySelector('#app'));
    root.render(<EnemyForm />);
};

window.onload = init;