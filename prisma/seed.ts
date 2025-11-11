import { PrismaClient } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  const usuariosSeed = [
    {
      id: 0,
      email: 'anonimo',
      nome: 'anonimo',
      senha: 'anonimo',
      is_admin: false,
    },
    {
      id: 1,
      email: 'super@contexto-biblico.com.br',
      nome: 'administrador',
      senha: 'adelson',
      is_admin: true,
    },
  ];

  for (const usuario of usuariosSeed) {
    console.log('Criando usuario:', usuario.nome);
    const senhaHash = await bcrypt.hash(usuario.senha, SALT_ROUNDS);

    await prisma.usuarios.upsert({
      where: { id: usuario.id },
      update: {
        email: usuario.email,
        nome: usuario.nome,
        senha: senhaHash,
        is_admin: usuario.is_admin,
        isDeleted: false,
        refresh_token_hash: null,
      },
      create: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        senha: senhaHash,
        is_admin: usuario.is_admin,
      },
    });
  }

  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('public.usuarios', 'id'),
      GREATEST((SELECT MAX(id) FROM "usuarios"), 1)
    )
  `;

  console.log('Seed executado com sucesso');
}

main()
  .catch((error) => {
    console.error('Erro ao executar seed Prisma:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

