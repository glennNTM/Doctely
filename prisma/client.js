import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// On utilise une propriété sur l'objet global pour stocker l'instance
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prismaGlobal || prismaClientSingleton();

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaGlobal = prisma;
}

export default prisma;
