const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const models = Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$'));
    console.log('Modelos encontrados:', models);

    for (const model of models) {
        try {
            const results = await prisma[model].findMany();
            results.forEach(res => {
                const str = JSON.stringify(res);
                if (str.includes('(')) {
                    console.log(`[${model}] match found.`);
                    // If it's a known field with parentheses, ignore it or show it.
                    // But I want to find "Formosa ("
                    if (str.includes('Formosa (')) {
                        console.log(`!!! FOUND IN ${model}:`, res);
                    }
                }
            });
        } catch (e) {
            // Not a model or other error
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
