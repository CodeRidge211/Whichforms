import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Import seed data
const seedData = require('../whichforms/seed-data');

async function main() {
  console.log('🌱 Seeding WhichForms database...');

  // Clear existing data
  console.log('  Clearing existing data...');
  await prisma.faq.deleteMany();
  await prisma.formSituation.deleteMany();
  await prisma.situationIdentityDoc.deleteMany();
  await prisma.form.deleteMany();
  await prisma.situation.deleteMany();
  await prisma.identityDoc.deleteMany();

  // Step 1: Seed Identity Docs FIRST (needed by situations)
  console.log('  Seeding identity documents...');
  for (const docData of seedData.identityDocs) {
    const { faqs, ...doc } = docData;
    
    const createdDoc = await prisma.identityDoc.create({
      data: doc,
    });

    // Create FAQs for identity docs
    if (faqs && faqs.length > 0) {
      for (let i = 0; i < faqs.length; i++) {
        await prisma.faq.create({
          data: {
            page_type: 'identity',
            page_slug: docData.slug,
            question: faqs[i].q,
            answer: faqs[i].a,
            sort_order: i,
            identity_doc_id: createdDoc.id,
          },
        });
      }
    }
  }

  // Step 2: Seed Situations SECOND (needed by forms)
  console.log('  Seeding situations...');
  for (const situationData of seedData.situations) {
    const { form_slugs, identity_doc_slugs, faqs, ...situation } = situationData;
    
    const createdSituation = await prisma.situation.create({
      data: situation,
    });

    // Link to identity docs
    if (identity_doc_slugs && identity_doc_slugs.length > 0) {
      for (const docSlug of identity_doc_slugs) {
        const doc = await prisma.identityDoc.findUnique({
          where: { slug: docSlug },
        });
        
        if (doc) {
          await prisma.situationIdentityDoc.create({
            data: {
              situation_id: createdSituation.id,
              identity_doc_id: doc.id,
            },
          });
        }
      }
    }

    // Create FAQs for situations
    if (faqs && faqs.length > 0) {
      for (let i = 0; i < faqs.length; i++) {
        await prisma.faq.create({
          data: {
            page_type: 'situation',
            page_slug: situationData.slug,
            question: faqs[i].q,
            answer: faqs[i].a,
            sort_order: i,
            situation_id: createdSituation.id,
          },
        });
      }
    }
  }

  // Step 3: Seed Forms LAST (can now link to existing situations)
  console.log('  Seeding forms...');
  const allForms = [
    ...seedData.irsForms,
    ...seedData.uscisForms,
    ...seedData.ssaForms,
    ...seedData.businessForms,
  ];

  for (const formData of allForms) {
    const { faqs, situations, ...form } = formData;
    
    const createdForm = await prisma.form.create({
      data: form,
    });

    // Link to situations (now they exist!)
    if (situations && situations.length > 0) {
      for (const situationSlug of situations) {
        const situation = await prisma.situation.findUnique({
          where: { slug: situationSlug },
        });
        
        if (situation) {
          await prisma.formSituation.create({
            data: {
              form_id: createdForm.id,
              situation_id: situation.id,
            },
          });
        }
      }
    }

    // Create FAQs for forms
    if (faqs && faqs.length > 0) {
      for (let i = 0; i < faqs.length; i++) {
        await prisma.faq.create({
          data: {
            page_type: 'form',
            page_slug: formData.slug,
            question: faqs[i].q,
            answer: faqs[i].a,
            sort_order: i,
            form_id: createdForm.id,
          },
        });
      }
    }
  }

  // Summary
  const formCount = await prisma.form.count();
  const situationCount = await prisma.situation.count();
  const identityDocCount = await prisma.identityDoc.count();
  const faqCount = await prisma.faq.count();

  console.log('');
  console.log('✅ Seeding complete!');
  console.log(`   • ${formCount} forms`);
  console.log(`   • ${situationCount} situations`);
  console.log(`   • ${identityDocCount} identity documents`);
  console.log(`   • ${faqCount} FAQs`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });