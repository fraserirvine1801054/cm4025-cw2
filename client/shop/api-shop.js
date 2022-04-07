//api-shop
const createShopItem = async (item, credentials) => {
    console.log("creating shop item by admin");
    
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