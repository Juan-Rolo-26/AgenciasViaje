const jimp = require('jimp');

async function crop() {
    const image = await jimp.read('/home/juampi26/AgenciasViaje/frontend/src/assets/logo.png');
    image.autocrop();
    await image.writeAsync('/home/juampi26/AgenciasViaje/frontend/src/assets/logo.png'); // overwrite original? maybe better save as favicon
    await image.writeAsync('/home/juampi26/AgenciasViaje/frontend/public/favicon.png');
}
crop().catch(err => {
    console.error(err);
    process.exit(1);
});
