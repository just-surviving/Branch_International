import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import { importMessagesFromCSV } from '../src/services/csvImportService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if data already exists
  const existingAgents = await prisma.agent.count();
  if (existingAgents > 0) {
    console.log('⚠️  Database already seeded. Skipping...');
    return;
  }

  // Create sample agents
  const agents = await Promise.all([
    prisma.agent.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@branch.com',
        status: 'AVAILABLE'
      }
    }),
    prisma.agent.create({
      data: {
        name: 'Michael Chen',
        email: 'michael.chen@branch.com',
        status: 'AVAILABLE'
      }
    }),
    prisma.agent.create({
      data: {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@branch.com',
        status: 'BUSY'
      }
    }),
    prisma.agent.create({
      data: {
        name: 'David Kim',
        email: 'david.kim@branch.com',
        status: 'OFFLINE'
      }
    })
  ]);

  console.log(`✅ Created ${agents.length} agents`);

  // Create canned responses
  const cannedResponses = await Promise.all([
    prisma.cannedResponse.create({
      data: {
        title: 'Welcome Message',
        content: 'Thank you for contacting Branch! How can I assist you today?',
        category: 'Greetings'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Loan Status Check',
        content: "I'll check your loan status right away. Please give me a moment.",
        category: 'Loan Questions'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Disbursement Timeline',
        content: "Loan disbursements typically take 1-3 business days after approval. You'll receive an email notification once the funds are transferred.",
        category: 'Loan Questions'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Account Update Help',
        content: "To update your account information, please go to Settings > Profile in the app. If you need further assistance, I'm here to help!",
        category: 'Account Help'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Document Upload',
        content: 'Please upload your documents through the app under Documents section. Accepted formats are PDF, JPG, and PNG.',
        category: 'Account Help'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Approval Process',
        content: "Our loan approval process typically takes 24-48 hours. You'll be notified via email and SMS once we have an update.",
        category: 'Loan Questions'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Issue Resolution',
        content: 'I understand your concern. Let me escalate this to our technical team and get back to you within 24 hours.',
        category: 'Support'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Closing Message',
        content: 'Is there anything else I can help you with today?',
        category: 'Closing'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Thank You',
        content: 'Thank you for being a valued Branch customer! Have a great day!',
        category: 'Closing'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Payment Confirmation',
        content: 'Your payment has been received and processed successfully. You should see it reflected in your account within 24 hours.',
        category: 'Payments'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'CRB Clearance',
        content: 'Your CRB clearance has been processed. You should receive your batch number within 72 hours.',
        category: 'CRB'
      }
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Reapplication Wait',
        content: 'We understand this can be frustrating. The 7-day waiting period helps us reassess your eligibility. Please reapply after this period.',
        category: 'Loan Questions'
      }
    })
  ]);

  console.log(`✅ Created ${cannedResponses.length} canned responses`);

  // Import messages from CSV
  // Try multiple paths for Docker and local development
  const possiblePaths = [
    path.resolve(__dirname, './seed-data.csv'),
    path.resolve(__dirname, '../../GeneralistRails_Project_MessageData.csv'),
    path.resolve(__dirname, '../GeneralistRails_Project_MessageData.csv'),
    '/app/GeneralistRails_Project_MessageData.csv',
    './GeneralistRails_Project_MessageData.csv'
  ];

  let csvPath = '';
  for (const p of possiblePaths) {
    try {
      const fs = await import('fs');
      if (fs.existsSync(p)) {
        csvPath = p;
        break;
      }
    } catch {
      continue;
    }
  }

  if (!csvPath) {
    console.warn('⚠️  CSV file not found. Skipping message import.');
    console.log('   Looked in:', possiblePaths);
  } else {
    console.log(`📄 Importing messages from: ${csvPath}`);

    try {
      await importMessagesFromCSV(csvPath);
      console.log('✅ CSV import completed');
    } catch (error) {
      console.error('❌ CSV import failed:', error);
      throw error;
    }
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
