//upload images
const createImg = async (picture) => {
    console.log(picture);
    try {
        let response = await fetch('/api/pictures/images/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(picture)
        });
        return await response.json();
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

const createCom = async (comment,params) => {
    try {
        let response = await fetch('/api/pictures/comments/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        });
        return await response.json();
    } catch(err) {
        console.log(err);
    }
}

const listCom = async (signal,params) => {
    try {
        console.log("listcom test");
        let response = await fetch('/api/pictures/comments/' + params, {
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
    listCom
}