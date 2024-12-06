const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect, useRef} = React;
const {createRoot} = require('react-dom/client');

const calculateOffset = (enemyType, accessory) => {
    switch(enemyType){
        case "goomba":
            switch(accessory){
                case "spike-helmet": return { x: '167px', y: '140px'};
            }
            break;
        case "koopa":
            switch(accessory){
                case "spike-helmet": return { x: '230px', y: '280px'};
            }
            break;
        case "boo":
            switch(accessory){
                case "spike-helmet": return { x: '180px', y: '120px'};
            }
            break;
    }
}

const EnemyDrawing = (props) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const enemyBase = new Image();
        enemyBase.src = props.url;
        enemyBase.onload = () => { ctx.drawImage(enemyBase, 0, canvas.height - enemyBase.height); }
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
        for(const a of props.accessories){
            const accessoryImage = new Image();
            accessoryImage.src = `/assets/img/accessories/${a}.png`;
            accessoryImage.onload = () => {ctx.drawImage(accessoryImage, 0, 0);}
        }
    }, [])

    return <canvas className='enemy-image' ref={canvasRef} width={300} height={500}></canvas>
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
        return <div className="enemyList">
            <h3 className="emptyEnemy">No Enemies Yet!</h3>
        </div>;
    };
    
    const enemyImages = enemyList.map(enemy => {
        return <div key={enemy._id} className="enemy">
            <EnemyDrawing url={`/assets/img/${enemy.type}/${enemy.color}.png`} accessories={enemy.accessories} />
            <h1>{enemy.name}</h1>
        </div>
    });

    return <div className="enemyList">
        {enemyImages}
    </div>
}

const init = () => {
    const root = createRoot(document.querySelector("#viewer"));
    root.render(<MinionViewer 
        enemyList={[]} 
        />);
}

window.onload = init;