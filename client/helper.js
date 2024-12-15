/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
        return;
    }

    if (handler){
        handler(result);
    }
};

const sendPut = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
        return;
    }

    if (handler){
        handler(result);
    }
};

const sendDelete = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if (handler){
        handler(result);
    }
}

const getEnemyData = async () => {
    const response = await fetch('/getEnemies');
    const data = await response.json();
    return data;
}

const handleError = (message) => {
    document.querySelector("#error-graphic").className = '';
    document.querySelector("#error-text").innerHTML = `ARF ARF ARF!<br />(${message})`;
}

const hideError = () => {
    document.querySelector("#error-graphic").className = 'hidden';
    document.querySelector("#error-text").innerHTML = '';
}

const format = word => {
    if (word.includes('_')){
        let wordList = word.split('_');
        let result = "";
        for (let w of wordList){
            result += w[0].toUpperCase() + w.slice(1);
            if (wordList.indexOf(w) != wordList.length - 1) result += " ";
        }
        return result;
    }
    else{
        return word.slice(0, 1).toUpperCase() + word.slice(1);
    }
}

const calculateOffset = (enemyType, accessory) => {
    switch(enemyType){
        case "goomba":
            switch(accessory){
                case "shades": return { x: 30, y: 260 };
                case "puny_antenna": return { x: 80, y: 165 };
                case "spike_helmet": return { x: 27, y: 160 };
                case "bowtie": return { x: 17, y: 330 };
                case "shadow_brooch": return { x: 42, y: 330 };
            }
            break;
        case "koopa":
            switch(accessory){
                case "shades": return { x: 20, y: 140 };
                case "puny_antenna": return { x: 75, y: 65 };
                case "spike_helmet": return { x: 30, y: 60};
                case "bowtie": return { x: 32, y: 240 };
                case "shadow_brooch": return { x: 57, y: 250 };
            }
            break;
        case "boo":
            switch(accessory){
                case "shades": return { x: 17, y: 260 };
                case "puny_antenna": return { x: 97, y: 157 };
                case "spike_helmet": return { x: 47, y: 155};
                case "bowtie": return { x: 27, y: 360 };
                case "shadow_brooch": return { x: 47, y: 360 };
            }
            break;
        case "bandit":
            switch(accessory){
                case "shades": return { x: 7, y: 230 };
                case "puny_antenna": return { x: 90, y: 96 };
                case "spike_helmet": return { x: 30, y: 100};
                case "bowtie": return { x: 20, y: 280 };
                case "shadow_brooch": return { x: 40, y: 300 };
            }
            break;
        case "fuzzy":
            switch(accessory){
                case "shades": return { x: 63, y: 260 };
                case "puny_antenna": return { x: 94, y: 148 };
                case "spike_helmet": return { x: 47, y: 165};
                case "bowtie": return { x: 50, y: 340 };
                case "shadow_brooch": return { x: 70, y: 340 };
            }
            break;
    }
}

const constructAccessories = checkList => {
    let accessories = []
    if (!checkList) return accessories;

    for (const input of checkList) {
        if (input.tagName.toLowerCase() == 'input' && input.checked) accessories.push(input.name);
    }

    return accessories;
}


module.exports = {
    sendPost,
    sendPut,
    sendDelete,
    getEnemyData,
    handleError,
    hideError,
    format,
    calculateOffset,
    constructAccessories
}