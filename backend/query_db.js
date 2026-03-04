const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const ofertas = await prisma.oferta.findMany({ select: { slug: true, incluyeItems: { select: { tipo: true, descripcion: true } } } });
  for (const o of ofertas) {
     const i = o.incluyeItems.find(item => item.tipo.toLowerCase().includes('salidas') || item.tipo.toLowerCase().includes('fecha'));
     if (i && (i.descripcion.toLowerCase().includes('mar') || i.descripcion.toLowerCase().includes('feb'))) {
         console.log(o.slug, '=>', i.descripcion);
     }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
