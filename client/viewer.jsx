const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
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
            <img className="enemy-base" src={`/assets/img/${enemy.type}/${enemy.color}.png`} alt={`base enemy: ${enemy.color} ${enemy.type}`}/>
            {enemy.accessories.map(a => {
                let style;
                const offset = calculateOffset(enemy.type, a);

                switch(a){
                    case "spike-helmet":
                        style = {
                            position: 'relative',
                            right: offset.x,
                            bottom: offset.y
                        };
                    break;
                }
                
                return <img src={`/assets/img/accessories/${a}.png`} id={`${enemy.name}-${a}`} alt={`accessory: ${a}`} style={style}/>
                })}
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