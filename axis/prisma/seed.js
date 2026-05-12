const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 'lily_palmer_001' },
    update: {},
    create: {
      id: 'lily_palmer_001',
      name: 'Lily Palmer',
      email: 'lily@sovereignridge.com',
      tier: 'power',
      preferences: {
        create: {
          id: 'lily_prefs_001',
          language: ['en', 'ru', 'de', 'es', 'zh', 'fi'],
          pingStartTime: '07:30',
          pingEndTime: '21:00',
          learningModes: ['russian', 'german', 'spanish', 'mandarin', 'finnish']
        }
      }
    }
  });
  console.log('Created user:', user.name);
}

main()
  .catch(e => console.error(e))
  .finally(async () => { await prisma.$disconnect(); });
