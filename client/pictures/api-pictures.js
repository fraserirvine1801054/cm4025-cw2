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
    } catch (err) {
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
    } catch (err) {
        console.log(err);
    }
}
//upload comments

const createCom = async (comment, params) => {
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
    } catch (err) {
        console.log(err);
    }
}

const listCom = async (signal, params) => {
    try {
        console.log("listcom test");
        let response = await fetch('/api/pictures/comments/' + params, {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const deleteImg = async (credentials, params) => {
    console.log("deleteimg call");
    try {
        let response = await fetch('/api/pictures/images/admin/' + params, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const userDeleteImg = async (credentials, params) => {
    console.log("deleteimg call as user");
    try {
        let response = await fetch('/api/pictures/images/' + params, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const deleteCom = async (credentials, params) => {
    console.log("delete comment call");
    try {
        let response = await fetch('/api/pictures/comments/admin/' + params, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const userDeleteCom = async (credentials, params) => {
    console.log("delete comment as user call");
    try {
        let response = await fetch('/api/pictures/comments/' + params, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const getSingleComment = async (signal, params) => {
    try {
        let response = await fetch('/api/pictures/singlecomment/' + params, {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const editSingleComment = async (comment, credentials, params) => {
    try {
        let response = await fetch('/api/pictures/comments/edit/' + params, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials
            },
            body: JSON.stringify(comment)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

export {
    createImg,
    listImg,
    createCom,
    listCom,
    deleteImg,
    userDeleteImg,
    deleteCom,
    userDeleteCom,
    getSingleComment,
    editSingleComment
}