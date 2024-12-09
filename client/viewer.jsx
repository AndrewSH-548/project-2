const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect, useRef} = React;
const {createRoot} = require('react-dom/client');

const calculateOffset = (enemyType, accessory) => {
    switch(enemyType){
        case "goomba":
            switch(accessory){
                case "spike-helmet": return { x: 27, y: 160 };
            }
            break;
        case "koopa":
            switch(accessory){
                case "spike-helmet": return { x: 30, y: 60};
            }
            break;
        case "boo":
            switch(accessory){
                case "spike-helmet": return { x: 47, y: 155};
            }
            break;
    }
}

const EnemyCanvas = (props) => {
    const canvasRef = useRef(null);
    const enemyList = props.enemyList;

    const marginSize = 40;
    const cellWidth = 250;
    const cellHeight = 400;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'maroon';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        

        for (let i = 0; i < enemyList.length; i++){
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
                for(const a of enemyList[i].accessories){
                    const accessoryImage = new Image();
                    accessoryImage.src = `/assets/img/accessories/${a}.png`;
                    const offset = calculateOffset(enemyList[i].type, a);
                    accessoryImage.onload = () => {ctx.drawImage(accessoryImage, xPos + offset.x, yPos + offset.y);}
                }
            }

            //Draw Name
            ctx.fillStyle = '#FF874B';
            ctx.fillRect(xPos, yPos, cellWidth, 60);
            ctx.fillStyle = '#FFEB93';
            ctx.font = '40px verdana';
            ctx.textBaseline = 'top'
            ctx.fillText(enemyList[i].name, xPos + 10, yPos + 10);

            
        }
    }, [])

    return <canvas id='enemy-canvas' ref={canvasRef} 
    width={(cellWidth * 4) + (marginSize * 5)} 
    height={(cellHeight + marginSize) * (Math.ceil(enemyList.length / 4)) + marginSize}>
        
    </canvas>
}

const MinionViewer = props => {
    const [enemyList, setEnemyList] = useState(props.enemyList);
    

    useEffect(() => {
        const loadEnemiesFromServer = async () => {
            const response = await fetch('/getEnemies');
            const data = await response.json();
            setEnemyList(data.enemies);
        };
        loadEnemiesFromServer();
    }, [props.reloadEnemies]);

    if (enemyList.length === 0) {
        return <div id="enemy-list">
            <h3 className="emptyEnemy">No Enemies Yet!</h3>
        </div>;
    };

    return <div id="enemy-list">
        <EnemyCanvas enemyList={enemyList}/>
    </div>
}

const init = () => {
    const root = createRoot(document.querySelector("#viewer"));
    root.render(<MinionViewer 
        enemyList={[]} 
        />);
}

window.onload = init;