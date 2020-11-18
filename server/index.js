const axios = require('axios');

const uuid = require('uuid');

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('error', (error) => console.log(error));
client.on('connected', () => console.log('Connected to Redis...'));

const unsplashImages = async (pageNum) => {
    

    const data = await axios.get(`https://api.unsplash.com/photos?client_id=pyMwznBO27ZXLNPyLvgLglHpJIw4n7Jykxdi8gJmJYg&page=${pageNum}`);
    const res = data.data;

    const output = [];

    for(let e of res) {
        const inbin = await client.getAsync(e.id);
        let binned = false;
        if(inbin) {
            binned = true;
        }
        const temp = {
            id: e.id,
            url: e.urls.full,
            posterName: e.user.name,
            description: e.alt_description,
            userPosted: false,
            binned: binned,
        };
        output.push(temp);
    }

    return output;
};

const binnedImages = async () => {
    const binnedList = await client.lrangeAsync('binned', 0, -1);

    const output = [];

    for (let item of binnedList) {
        const data = await client.getAsync(item);
        output.push(JSON.parse(data));
    }

    return output;
};

const userPostedImages = async () => {
    const userPostedList = await client.lrangeAsync('userpost', 0, -1);

    const output = [];

    for (let item of userPostedList) {
        const data = await client.getAsync(item);
        output.push(JSON.parse(data));
    }

    return output;
};

const uploadImage = async (url, description, posterName) => {
    const uploadData = {
        id: uuid.v4(),
        url: url,
        description: description,
        posterName: posterName,
        userPosted: true,
        binned: false,
    };

    const setData = JSON.stringify(uploadData);

    await client.setAsync(uploadData.id, setData);

    await client.rpushAsync('userpost', uploadData.id);

    return uploadData;
};

const updateImage = async (
    id,
    url,
    posterName,
    description,
    userPosted=false,
    binned
) => {
    const newData = {
        id: id,
        url: url,
        posterName: posterName,
        description: description,
        userPosted: userPosted,
        binned: binned,
    };
    const setData = JSON.stringify(newData);
    let oldData;

    if (userPosted || binned) {
        oldData = JSON.parse(await client.getAsync(id));
        if (!oldData) {
            await client.setAsync(id, setData);

            if (userPosted) await client.rpushAsync('userpost', id);
            if (binned) await client.rpushAsync('binned', id);

            return newData;
        }
        await client.setAsync(id, setData);

        if (oldData.userPosted && !userPosted)
            await client.lremAsync('userpost', 0, id);
        if (oldData.binned && !binned) await client.lremAsync('binned', 0, id);

        if (userPosted && !oldData.userPosted)
            await client.rpushAsync('userpost', id);
        if (binned && !oldData.binned) await client.rpushAsync('binned', id);

        return newData;
    }

    oldData = JSON.parse(await client.getAsync(id));

    if (!oldData) throw 'No such id in Redis';

    await client.delAsync(id);

    if (oldData.userPosted){
        await client.lremAsync('userpost', 0, id);
    }
    if (oldData.binned){
        await client.lremAsync('binned', 0, id);
    } 
    return newData;
};

const deleteImage = async (id) => {
    let data;

    data = JSON.parse(await client.getAsync(id));

    if (!data) {
        throw 'No such id';
    }

    if (!data.userPosted) {
        throw 'No Access to non-userPosted Images';
    }

    await client.delAsync(id);

    await client.lremAsync('userpost', 0, id);

    await client.lremAsync('binned', 0, id);

    return data;
};

module.exports = {
    unsplashImages,
    binnedImages,
    userPostedImages,
    uploadImage,
    updateImage,
    deleteImage,
};
