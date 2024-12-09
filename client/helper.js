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
    document.querySelector("#error-message").innerHTML = message
}

const hideError = () => {
    document.querySelector("#error-message").innerHTML = ''
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

module.exports = {
    sendPost,
    sendDelete,
    getEnemyData,
    handleError,
    hideError,
    format
}