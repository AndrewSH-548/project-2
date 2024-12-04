const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const loadEnemies = () => {
    const enemyData = helper.getEnemyData();
    const enemyList = [];
    for (const enemy of enemyData){
        const enemyImage = <img className="enemy-base" src={`/assets/img/${enemy.type}/${enemy.color}`}/>
        if (enemy.accessories){
            const enemyAccessories = enemy.accessories.map(a => <img src={`/assets/img/accessories/${a}`} id={`${enemy.name}-${a}`}></>)
        }
        enemyList.push(<div className='enemy'>
            {enemyImage}
        </div>)
    }
    
}

const MinionViewer = () => {
    return <div>

    </div>
}

const init = () => {
    const root = createRoot(document.querySelector("#content-viewer"));
    root.render(<MinionViewer />);
}