const React = require('react');
const helper = require('./helper.js');
const { useState, useEffect } = React;
const EnemyTypeSelect = props => {
    const [selectedType, setSelectedType] = useState(props.selectedEnemy.type);
    const typeOptions = ["goomba", "koopa", "boo", "bandit", "fuzzy"];

    useEffect(() => {
        setSelectedType(props.selectedEnemy.type);
    }, props.selectedEnemy)

    const returnOptions = typeOptions.map(t => <option value={t} selected={t == selectedType}>{helper.format(t)}</option>);
    returnOptions.unshift(<option value="default" selected={!selectedType}>Select Species</option>);

    return <>
        <label for='type'>Species:</label>
        <select id='enemy-type' name='type' onChange={e => { props.setEnemyType(e.target.value); props.setShowColorSelect(true); helper.hideError();}}>
            {returnOptions}
        </select>
    </>
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
            case "bandit":
                setOptions(['blue', 'green', 'purple', 'red']);
                break;
            case "fuzzy":
                setOptions(['black', 'green', 'pink', 'gold']);
                break;
            case "boo":
                setOptions(['white', 'beige', 'purple', 'green']);
                break;
            default:
                setOptions([]);
                break;
        }
        
    }, props.type);

    if (options.length == 0) return <></>

    let selectionIndex = options.indexOf(props.color) || 0;
    const colorOptions = options.map(o => <option value={o} selected={options.indexOf(o) == selectionIndex}>{helper.format(o)}</option>)

    return <>
        <label for='color'>Color:</label>
        <select id='enemy-color' name='color'>
            {colorOptions}
        </select>
    </>
}

const AccessorySelect = props => {
    const accessoryList = ["puny_antenna", "spike_helmet", "bowtie", "shadow_brooch", "shades"];   

    const accessoryCheckboxes = accessoryList.map(a => {
        return <><label className="cr-wrapper">
        <input type='checkbox' name={a} className='accessory-checkbox'/>
        <div className="cr-input">
        </div>
        <span>{helper.format(a)}</span>
    </label><br /></>
    })
    return <div id='enemy-accessories'>
        <h2>Accessories:</h2>
        {accessoryCheckboxes}
    </div>
}

module.exports = {
    EnemyTypeSelect,
    ColorSelect,
    AccessorySelect,
}