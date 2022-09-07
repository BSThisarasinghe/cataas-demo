const debug = require('debug')('server:Controller:images');
const chalk = require('chalk');
const fetch = require('node-fetch');
let { writeFile } = require('fs');
let { join } = require('path');
const mergeImages = require('merge-images');
const moment = require('moment');
const { Canvas, Image } = require('canvas');

let greeting = 'Hello', who = 'You', width = 400, height = 500, color = 'Pink', size = 100;

async function getImageBind(req, res) {

    debug(chalk.blue('getImageBind '));
    let firstUrl = 'https://cataas.com/cat/says/' + greeting + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size;
    let secondUrl = 'https://cataas.com/cat/says/' + who + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size;
    let firstResponse = await getImage(firstUrl); // get images from API
    let secondResponse = await getImage(secondUrl);

    let b64 = await joinImages(firstResponse, secondResponse); // merge images

    const fileName = join(process.cwd(), 'merged-image-' + moment().format('YYYYMMDDhhmmss') + '.png'); // set file path
    debug(chalk.blue('fileName ' + fileName));

    var base64result = b64.split(',')[1];
    writeFile(fileName, base64result, 'base64', (err) => {
        if (err) {
            debug(chalk.red('file save error ' + err));
            res.status(500).json({
                message: "The file save failed!"
            })
        }
        debug(chalk.green('The file was saved!'));
        res.status(200).json({
            message: "The file was saved!"
        })
    });
}

const joinImages = (firstResponse, secondResponse) => {
    let firstImage = "data:image/jpeg;base64," + firstResponse.toString('base64');
    let secondImage = "data:image/jpeg;base64," + secondResponse.toString('base64');
    debug(chalk.blue('join images'));

    return mergeImages([{ src: firstImage, x: 0, y: 0 }, { src: secondImage, x: width, y: 0 }], { // merge images
        Canvas: Canvas,
        Image: Image,
        width: width * 2,
        height: height
    });
}

const getImage = (url) => {
    debug(chalk.blue('fetch image' + url));
    return fetch(url) // fetch images
        .then(res => res.buffer());
}

module.exports = {
    getImageBind
}