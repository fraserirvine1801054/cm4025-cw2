//api-shop
const createShopItem = async (credentials, item) => {
    console.log("creating shop item by admin");
    try {
        let response = await fetch('/api/shop/admin/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials
            },
            body: JSON.stringify(item)
        });
        return await response.json();
    } catch(err) {
        console.log(err);
    }
}

const listShopItems = async (signal) => {
    try {
        let response = await fetch('/api/shop/items', {
            method: 'GET',
            signal: signal,
        });
        return await response.json();
    } catch(err) {
        console.log(err);
    }
}

export {
    createShopItem,
    listShopItems
}