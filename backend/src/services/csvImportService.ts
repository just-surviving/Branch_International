import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import { detectUrgency } from './urgencyDetectionService.js';

const prisma = new PrismaClient();

interface CSVRow {
  'User ID': string;
  'Timestamp (UTC)': string;
  'Message Body': string;
}

interface ParsedMessage {
  userId: number;
  timestamp: Date;
  messageBody: string;
}

export async function importMessagesFromCSV(filePath: string): Promise<void> {
  console.log('📄 Starting CSV import from:', filePath);

  const messages: ParsedMessage[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: CSVRow) => {
        const userId = parseInt(row['User ID']);
        const timestamp = new Date(row['Timestamp (UTC)']);
        const messageBody = row['Message Body'];

        if (!isNaN(userId) && messageBody) {
          messages.push({
            userId,
            timestamp,
            messageBody
          });
        }
      })
      .on('end', async () => {
        console.log(`✅ Parsed ${messages.length} messages from CSV`);

        try {
          // Sort messages by timestamp to maintain chronological order
          messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

          let customersCreated = 0;
          let messagesCreated = 0;
          let conversationsCreated = 0;

          // Create customers and messages
          for (const msg of messages) {
            // Find or create customer
            let customer = await prisma.customer.findUnique({
              where: { userId: msg.userId }
            });

            if (!customer) {
              customer = await prisma.customer.create({
                data: {
                  userId: msg.userId,
                  name: `Customer ${msg.userId}`,
                  email: `customer${msg.userId}@example.com`,
                  phone: `+254${String(msg.userId).padStart(9, '0')}`,
                  accountStatus: 'active',
                  creditScore: Math.floor(Math.random() * 300) + 600,
                  accountAge: `${Math.floor(Math.random() * 24) + 1} months`,
                  loanStatus: ['Active', 'Pending', 'Completed', 'None'][Math.floor(Math.random() * 4)]
                }
              });
              customersCreated++;
            }

            // Detect urgency
            const urgency = detectUrgency(msg.messageBody);

            // Find or create conversation
            let conversation = await prisma.conversation.findFirst({
              where: {
                customerId: customer.id,
                status: { in: ['OPEN', 'IN_PROGRESS'] }
              }
            });

            if (!conversation) {
              conversation = await prisma.conversation.create({
                data: {
                  customerId: customer.id,
                  lastMessageAt: msg.timestamp,
                  status: 'OPEN'
                }
              });
              conversationsCreated++;
            } else {
              // Update last message time
              await prisma.conversation.update({
                where: { id: conversation.id },
                data: { lastMessageAt: msg.timestamp }
              });
            }

            // Create message
            await prisma.message.create({
              data: {
                customerId: customer.id,
                conversationId: conversation.id,
                content: msg.messageBody,
                direction: 'INBOUND',
                urgencyScore: urgency.score,
                urgencyLevel: urgency.level,
                timestamp: msg.timestamp,
                status: 'UNREAD'
              }
            });
            messagesCreated++;
          }

          console.log(`✅ CSV import completed successfully!`);
          console.log(`   - Customers created: ${customersCreated}`);
          console.log(`   - Conversations created: ${conversationsCreated}`);
          console.log(`   - Messages created: ${messagesCreated}`);
          
          resolve();
        } catch (error) {
          console.error('❌ Error importing CSV:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ Error reading CSV file:', error);
        reject(error);
      });
  });
}
