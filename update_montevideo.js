const { updateDestino } = require('./backend/src/services/destinationService');

const id = 204;
const payload = {
    imagenPortada: "/assets/destinos/montevideo.png",
    galeria: [
        { imagen: "/assets/destinos/montevideo1.jpg", orden: 1 },
        { imagen: "/assets/destinos/montevideo2.webp", orden: 2 },
        { imagen: "/assets/destinos/montevideo3.jpg", orden: 3 }
    ]
};

async function update() {
    try {
        await updateDestino(id, payload);
        console.log("Destino Montevideo actualizado con minúsculas");
    } catch (error) {
        console.error("Error al actualizar Montevideo:", error);
        process.exit(1);
    }
}

update();
