/**
 * Real-Time Demo Script for Branch Messaging Platform
 * 
 * This script simulates realistic customer interactions for demonstration purposes.
 * Run this alongside the agent portal to see real-time message delivery.
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Demo customer profiles with realistic scenarios
const demoScenarios = [
  {
    customer: {
      name: 'James Anderson',
      phoneNumber: '+1-555-0198',
      email: 'james.anderson@email.com'
    },
    messages: [
      {
        content: 'My loan payment is overdue and I\'m getting charged extra fees. I need immediate help!',
        delay: 0
      },
      {
        content: 'I tried calling but was on hold for 30 minutes. This is urgent!',
        delay: 15000
      },
      {
        content: 'My account number is BR-12345. Can someone please help me?',
        delay: 30000
      }
    ]
  },
  {
    customer: {
      name: 'Maria Garcia',
      phoneNumber: '+1-555-0199',
      email: 'maria.garcia@email.com'
    },
    messages: [
      {
        content: 'URGENT! My card was declined at the grocery store and I have no other payment method!',
        delay: 5000
      },
      {
        content: 'I have money in my account. Why is this happening?',
        delay: 20000
      }
    ]
  },
  {
    customer: {
      name: 'David Thompson',
      phoneNumber: '+1-555-0200',
      email: 'david.thompson@email.com'
    },
    messages: [
      {
        content: 'Hello, I\'d like to know more about your personal loan products and current interest rates.',
        delay: 10000
      },
      {
        content: 'What documents do I need to apply?',
        delay: 35000
      }
    ]
  },
  {
    customer: {
      name: 'Lisa Wong',
      phoneNumber: '+1-555-0201',
      email: 'lisa.wong@email.com'
    },
    messages: [
      {
        content: 'I submitted my loan application 3 days ago but haven\'t received any update. What\'s the status?',
        delay: 8000
      },
      {
        content: 'My application reference number is APP-2024-7891',
        delay: 25000
      }
    ]
  },
  {
    customer: {
      name: 'Robert Chen',
      phoneNumber: '+1-555-0202',
      email: 'robert.chen@email.com'
    },
    messages: [
      {
        content: 'I want to increase my credit limit. What\'s the process?',
        delay: 12000
      }
    ]
  },
  {
    customer: {
      name: 'Sarah Johnson',
      phoneNumber: '+1-555-0203',
      email: 'sarah.j@email.com'
    },
    messages: [
      {
        content: 'CRITICAL: I suspect fraudulent activity on my account. Several unauthorized transactions!',
        delay: 3000
      },
      {
        content: 'I need to freeze my account immediately!',
        delay: 18000
      }
    ]
  }
];

// Helper function to create or get customer
async function getOrCreateCustomer(customerData, index) {
  try {
    // Try to find existing customer by name
    const customersResponse = await fetch(`${API_BASE_URL}/customers`);
    const customers = await customersResponse.json();
    
    const existingCustomer = customers.find(c => c.name === customerData.name || c.phone === customerData.phoneNumber);
    
    if (existingCustomer) {
      console.log(`✓ Using existing customer: ${existingCustomer.name}`);
      return existingCustomer;
    }
    
    // Create new customer with userId
    const newCustomerData = {
      userId: 10000 + index, // Generate unique userId
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phoneNumber,
      accountStatus: 'active',
      creditScore: Math.floor(Math.random() * (800 - 600) + 600),
      loanStatus: 'ACTIVE'
    };
    
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomerData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create customer: ${response.statusText} - ${errorText}`);
    }
    
    const newCustomer = await response.json();
    console.log(`✓ Created new customer: ${newCustomer.name}`);
    return newCustomer;
  } catch (error) {
    console.error(`✗ Error with customer ${customerData.name}:`, error.message);
    return null;
  }
}

// Helper function to send a message
async function sendMessage(customerId, content) {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        content,
        direction: 'INBOUND'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
    
    const message = await response.json();
    console.log(`  → Sent: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`);
    return message;
  } catch (error) {
    console.error(`  ✗ Error sending message:`, error.message);
    return null;
  }
}

// Run a single scenario
async function runScenario(scenario, index) {
  console.log(`\n📧 Scenario ${index + 1}: ${scenario.customer.name}`);
  console.log('─'.repeat(60));
  
  // Create or get customer
  const customer = await getOrCreateCustomer(scenario.customer, index);
  if (!customer) {
    console.log('✗ Skipping scenario - customer creation failed');
    return;
  }
  
  // Send messages with delays
  for (const msg of scenario.messages) {
    if (msg.delay > 0) {
      console.log(`  ⏳ Waiting ${msg.delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, msg.delay));
    }
    
    await sendMessage(customer.id, msg.content);
  }
  
  console.log(`✓ Scenario ${index + 1} complete`);
}

// Run all scenarios
async function runDemo(mode = 'sequential') {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║     Branch Messaging Platform - Real-Time Demo Script     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`Mode: ${mode.toUpperCase()}`);
  console.log(`Scenarios: ${demoScenarios.length}`);
  console.log(`Total Messages: ${demoScenarios.reduce((sum, s) => sum + s.messages.length, 0)}`);
  
  const startTime = Date.now();
  
  if (mode === 'sequential') {
    // Run scenarios one after another
    for (let i = 0; i < demoScenarios.length; i++) {
      await runScenario(demoScenarios[i], i);
    }
  } else if (mode === 'parallel') {
    // Run all scenarios simultaneously
    const promises = demoScenarios.map((scenario, index) => runScenario(scenario, index));
    await Promise.all(promises);
  } else if (mode === 'staggered') {
    // Start scenarios with small delays between them
    const promises = demoScenarios.map((scenario, index) => {
      return new Promise(resolve => {
        setTimeout(async () => {
          await runScenario(scenario, index);
          resolve();
        }, index * 2000); // 2 second stagger
      });
    });
    await Promise.all(promises);
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    Demo Complete! ✓                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`Duration: ${duration}s`);
  console.log('\n📊 Check the Agent Portal to see all messages delivered in real-time!');
  console.log('🌐 Agent Portal: http://localhost:5173/login\n');
}

// Check if backend is running
async function checkBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/agents`);
    if (response.ok) {
      console.log('✓ Backend server is running');
      return true;
    }
  } catch (error) {
    console.error('✗ Cannot connect to backend server');
    console.error('  Make sure the backend is running on http://localhost:3000');
    console.error('  Run: cd backend && npm run dev');
    return false;
  }
}

// Main execution
(async () => {
  // Check for command line arguments
  const args = process.argv.slice(2);
  const mode = args[0] || 'staggered'; // sequential, parallel, or staggered
  
  console.log('Checking backend connection...');
  const backendRunning = await checkBackend();
  
  if (!backendRunning) {
    process.exit(1);
  }
  
  console.log('\n🚀 Starting demo in 3 seconds...');
  console.log('   Open Agent Portal: http://localhost:5173/login');
  console.log('   Login as: Michael Chen (michael.chen@branch.com)\n');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await runDemo(mode);
})();
