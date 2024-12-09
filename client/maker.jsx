const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const constructAccessories = form => {
    let accessories = []
    if (!form) return accessories;

    for (const input of form.children) {
        if (input.tagName.toLowerCase() == 'input' && input.checked) accessories.push(input.name);
    }
    return accessories;
}

const submitEnemyData = (e, resetFunction) => {
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

    helper.sendPost(e.target.action, { name, type, color, accessories }, refreshFields(resetFunction));
}

const ColorSelect = (props) => {
    let [options, setOptions] = useState(props.options);

    useEffect(() => {
        switch (props.type) {
            case "goomba":
                setOptions(['brown', 'green', 'navy_blue']);
                break;
            case "koopa":
                setOptions(['red', 'green', 'purple', 'blue']);
                break;
            case "bob-omb":
                setOptions(['black', 'pink', 'purple', 'red']);
                break;
            case "boo":
                setOptions(['white', 'beige', 'purple', 'green']);
                break;
        }
    }, props.type);

    if (!props.type) return <></>

    const colorOptions = options.map(o => <option value={o} selected={options.indexOf(o) == 0}>{helper.format(o)}</option>)

    return <>
        <label for='color'>Color:</label>
        <select id='enemy-color' name='color'>
            {colorOptions}
        </select>
    </>
}

const refreshFields = (resetEnemyType) => {
    document.querySelector("#enemy-name").value = '';
    resetEnemyType(null);

    const typeSelect = document.querySelector("#enemy-type");
    for (let child of typeSelect.children) {
        child.selected = child.value == 'default';
    }

    const accessorySelect = document.querySelector("#enemy-accessories");
    for (let child of accessorySelect.children) {
        child.value = false;
    }
    helper.handleError("Minion submitted!");
}

const EnemyTypeSelect = props => {
    return <>
        <label for='type'>Species:</label>
        <select id='enemy-type' name='type' onChange={e => { props.setEnemyType(e.target.value); props.setShowColorSelect(true); helper.hideError(); }}>
            <option value="default" selected>Select Species</option>
            <option value="goomba">Goomba</option>
            <option value="koopa">Koopa</option>
            {/* <option value="bob-omb">Bob-omb</option> */}
            <option value="boo">Boo</option>
        </select>
    </>
}

const AccessorySelect = () => {
    return <div id='enemy-accessories'>
        <h2>Accessories:</h2>
        <label class="cr-wrapper">
            <input type='checkbox' name='spike-helmet' />
            <div class="cr-input"></div>
            <span>Spike Helmet</span>
        </label>
    </div>
}

const EnemyForm = () => {
    const [showColorSelect, setShowColorSelect] = useState(false);
    const [enemyType, setEnemyType] = useState(null);

    return <form
        action='/maker'
        method='POST'
        id='enemy-form'
        className='mainForm'
        onSubmit={e => submitEnemyData(e, setEnemyType)}>
        <label for='name'>Name:</label>
        <input type='text' id='enemy-name' name='name' />
        <EnemyTypeSelect setEnemyType={setEnemyType} setShowColorSelect={setShowColorSelect} />
        {showColorSelect && <ColorSelect options={[]} type={enemyType} />}
        <AccessorySelect />
        <input type="submit" className="formSubmit" value="Employ your minion!" />
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