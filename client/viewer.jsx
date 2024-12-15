const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect, useRef } = React;
const { ColorSelect, AccessorySelect } = require('./components.jsx');
const { createRoot } = require('react-dom/client');

const marginSize = 40;
const cellWidth = 250;
const cellHeight = 400;

const deleteEnemy = async (e, _id, callback) => {
    e.preventDefault();
    helper.hideError();

    helper.sendDelete('/viewer', { _id }, callback);
}

const editEnemy = async (e, _id, type, callback) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#enemy-name').value;
    const color = e.target.querySelector('#enemy-color').value;
    const accessories = helper.constructAccessories(e.target.querySelectorAll('.accessory-checkbox'));

    helper.sendPut('/viewer', { _id, name, color, type, accessories }, callback);
}

const getMouse = (canvas, e) => {
    let field = canvas.getBoundingClientRect();
    return { x: e.clientX - field.left, y: e.clientY - field.top };
}

const isMouseInField = (mouse, field) =>
    mouse.x - 20 > field.x &&
    mouse.x - 20 < field.x + field.width &&
    mouse.y - 20 > field.y &&
    mouse.y - 20 < field.y + field.height;

const createButton = (canvas, ctx, x, y, type, callback) => {
    //Create and draw Buttons
    const button = {
        x, y, width: 60, height: 60
    }
    ctx.fillStyle = '#AB3320';
    ctx.fillRect(button.x, button.y, button.width, button.height);
    const icon = new Image();
    icon.src = `/assets/img/${type}-icon.png`;
    icon.onload = () => { ctx.drawImage(icon, button.x, button.y, button.width, button.height); }
    
    //Remove the event listener to not layer it
    canvas.removeEventListener('click', e => {
        const mouse = getMouse(canvas, e);

        if (isMouseInField(mouse, button)) {
            callback(e);
        }
    });

    canvas.addEventListener('click', e => {
        const mouse = getMouse(canvas, e);

        if (isMouseInField(mouse, button)) {
            callback(e);
        }
    });
}

const loadEnemyCanvas = (canvas, enemyList, props) => {
    if (!canvas) canvas = document.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'maroon';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < enemyList.length; i++) {
        const xPos = marginSize + (i % 4) * (cellWidth + marginSize);
        const yPos = marginSize + Math.floor(i / 4) * (cellHeight + marginSize);

        //Fill cell
        ctx.fillStyle = '#FF5800';
        ctx.fillRect(xPos, yPos, cellWidth, cellHeight);

        //Draw Enemy and Accessories
        const enemyBase = new Image();
        enemyBase.src = `/assets/img/${enemyList[i].type}/${enemyList[i].color}.png`;
        enemyBase.onload = () => {
            ctx.drawImage(enemyBase, xPos + 10, yPos + (cellHeight - 10) - enemyBase.height);
            for (const a of enemyList[i].accessories) {
                const accessoryImage = new Image();
                accessoryImage.src = `/assets/img/accessories/${a}.png`;
                const offset = helper.calculateOffset(enemyList[i].type, a);
                accessoryImage.onload = () => { ctx.drawImage(accessoryImage, xPos + offset.x, yPos + offset.y); }
            }
        }

        //Draw Name
        ctx.fillStyle = '#FF874B';
        ctx.fillRect(xPos, yPos, cellWidth, 60);
        ctx.fillStyle = '#FFEB93';
        ctx.font = '40px verdana';
        ctx.textBaseline = 'top';
        ctx.fillText(enemyList[i].name, xPos + 10, yPos + 10);

        createButton(canvas, ctx, xPos + cellWidth - 60, yPos + 60, 'edit', () => {
            console.log('Edit clicked');
            props.setSelectedEnemy(enemyList[i]);
            props.setShowEditor(true);
        });
        createButton(canvas, ctx, xPos + cellWidth - 60, yPos + 120, 'delete', e => {
            console.log('Delete clicked');
            deleteEnemy(e, enemyList[i]._id, props.triggerReload);
        });
    }
}

const EnemyCanvas = (props) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        loadEnemyCanvas(canvas, props.enemyList, props);
    }, props.enemyList);

    return <canvas id='enemy-canvas' ref={canvasRef}
        width={(cellWidth * 4) + (marginSize * 5)}
        height={(cellHeight + marginSize) * (Math.ceil(props.enemyList.length / 4)) + marginSize}>
    </canvas>
}

const EnemyEditor = props => {
    const [enemyStats, setEnemyStats] = useState(null);
    const [nameInput, setNameInput] = useState(<></>);
    const [colorSelect, setColorSelect] = useState(<></>);
    const [accessorySelect, setAccessorySelect] = useState(<></>);

    useEffect(() => {
        setEnemyStats({
            name: props.selectedEnemy.name,
            type: props.selectedEnemy.type,
            color: props.selectedEnemy.color,
            accessories: props.selectedEnemy.accessories
        });
        setNameInput(<>
        <label for='name'>Name:</label>
        <input type='text' id='enemy-name' name='name' value={props.selectedEnemy.name}/>
        </>);
        setColorSelect(<ColorSelect options={[]} type={props.selectedEnemy.type} color={props.selectedEnemy.color}/>);
        setAccessorySelect(<AccessorySelect accessories={props.selectedEnemy.accessories} />);
    }, props.selectedEnemy);

    if (!enemyStats) return <></>

    return <form
    action='/viewer'
    method='PUT'
    id='enemy-editor'
    className='mainForm'
    onSubmit={e => editEnemy(e, props.selectedEnemy._id, props.selectedEnemy.type, props.triggerReload)}
    >
    {nameInput}<br />
    {colorSelect}
    {accessorySelect}
    <input type="submit" className="formSubmit" value="Edit your minion!" />
    </form>
}

const MinionViewer = props => {
    const [enemyList, setEnemyList] = useState(props.enemyList);
    const [showEditor, setShowEditor] = useState(false);
    const [selectedEnemy, setSelectedEnemy] = useState(null);

    let triggerReload = () => {
        setShowEditor(false);
        setSelectedEnemy(null);
        loadEnemies();
    };

    const loadEnemies = async () => {
        const response = await fetch('/getEnemies');
        const data = await response.json();
        setEnemyList(data.enemies);
    };

    useEffect(() => {
        loadEnemies(enemyList => {
            loadEnemyCanvas(null, enemyList, triggerReload); 
        });
    }, []);

    if (enemyList.length === 0) {
        return <div id="enemy-list">
            <h1>Your army is empty!</h1>
        </div>;
    };

    return <div id="enemy-list">
        <EnemyCanvas 
        enemyList={enemyList} 
        loadEnemies={loadEnemies} 
        triggerReload={triggerReload} 
        setShowEditor={setShowEditor} 
        setSelectedEnemy={setSelectedEnemy}/>
        {showEditor && <EnemyEditor selectedEnemy={selectedEnemy} triggerReload={triggerReload}/>}
    </div>
}

const init = () => {
    const root = createRoot(document.querySelector("#viewer"));
    root.render(<MinionViewer
        enemyList={[]}
    />);
}

window.onload = init;