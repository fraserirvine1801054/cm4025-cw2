//upload images
const createImg = async (picture) => {
    try {
        let response = await fetch('/api/pictures/images/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(picture)
        });
    } catch(err) {
        console.log(err);
    }
}

const listImg = async (signal) => {
    try {
        let response = await fetch('/api/pictures/images/', {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch(err) {
        console.log(err);
    }
}
//upload comments

const createCom = async (comment) => {
    try {
        let response = await fetch('/api/pictures/comments/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        });
    } catch(err) {
        console.log(err);
    }
}

const listCom = async (signal,params) => {
    try {
        let response = await fetch('/api/pictures/comments/' + params.img_id, {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch(err) {
        console.log(err);
    }
}

const getComName = async (signal,params) => {
    try {
        let response = await fetch('/api/users/name/' + params.userId, {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch(err) {
        console.log(err);
    }
}

export {
    createImg,
    listImg,
    createCom,
    listCom,
    getComName
}