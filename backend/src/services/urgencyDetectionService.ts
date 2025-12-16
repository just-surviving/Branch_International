export interface UrgencyResult {
  score: number; // 1-10
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  keywords: string[];
}

const URGENCY_KEYWORDS = {
  CRITICAL: {
    keywords: [
      'urgent', 'emergency', 'immediately', 'asap', 'critical', 'stuck',
      'cant access', 'locked out', 'fraud', 'unauthorized', 'scam',
      'dispute', 'error', 'failed transaction', 'cant login', 'can\'t access',
      'can\'t login', 'blocked', 'hacked', 'stolen'
    ],
    score: 10
  },
  HIGH: {
    keywords: [
      'loan approval', 'disbursement', 'when will i receive', 'payment',
      'not received', 'pending', 'waiting', 'delay', 'overdue',
      'rejected', 'denied', 'problem', 'issue', 'not working',
      'late', 'due', 'crb', 'credit report', 'batch number',
      'haven\'t received', 'still waiting', 'why was'
    ],
    score: 8
  },
  MEDIUM: {
    keywords: [
      'how to', 'help', 'question', 'when', 'status', 'update',
      'change', 'modify', 'check', 'verify', 'confirm', 'please',
      'kindly', 'can i', 'what is', 'how long', 'why'
    ],
    score: 5
  },
  LOW: {
    keywords: [
      'thank', 'thanks', 'information', 'just checking', 'wondering',
      'curious', 'general question', 'fyi', 'ok', 'okay', 'alright',
      'appreciate', 'god bless', 'have a great'
    ],
    score: 3
  }
};

export function detectUrgency(messageContent: string): UrgencyResult {
  const lowerContent = messageContent.toLowerCase();
  let highestScore = 3; // Default to LOW
  let detectedLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  const matchedKeywords: string[] = [];

  // Check for CRITICAL keywords first
  for (const keyword of URGENCY_KEYWORDS.CRITICAL.keywords) {
    if (lowerContent.includes(keyword)) {
      matchedKeywords.push(keyword);
      if (URGENCY_KEYWORDS.CRITICAL.score > highestScore) {
        highestScore = URGENCY_KEYWORDS.CRITICAL.score;
        detectedLevel = 'CRITICAL';
      }
    }
  }

  // Check for HIGH keywords
  for (const keyword of URGENCY_KEYWORDS.HIGH.keywords) {
    if (lowerContent.includes(keyword)) {
      matchedKeywords.push(keyword);
      if (URGENCY_KEYWORDS.HIGH.score > highestScore) {
        highestScore = URGENCY_KEYWORDS.HIGH.score;
        detectedLevel = 'HIGH';
      }
    }
  }

  // Check for MEDIUM keywords
  for (const keyword of URGENCY_KEYWORDS.MEDIUM.keywords) {
    if (lowerContent.includes(keyword)) {
      matchedKeywords.push(keyword);
      if (URGENCY_KEYWORDS.MEDIUM.score > highestScore) {
        highestScore = URGENCY_KEYWORDS.MEDIUM.score;
        detectedLevel = 'MEDIUM';
      }
    }
  }

  // Check for LOW keywords (only if nothing else matched)
  if (detectedLevel === 'LOW') {
    for (const keyword of URGENCY_KEYWORDS.LOW.keywords) {
      if (lowerContent.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    }
  }

  // Check for multiple question marks or exclamation marks (indicates urgency)
  const multipleMarks = /[!?]{2,}/.test(messageContent);
  if (multipleMarks && highestScore < 8) {
    highestScore = Math.min(highestScore + 2, 10);
    if (highestScore >= 8) {
      detectedLevel = 'HIGH';
    }
  }

  // Check for ALL CAPS (indicates urgency)
  const hasAllCaps = /[A-Z]{5,}/.test(messageContent);
  if (hasAllCaps && highestScore < 7) {
    highestScore = Math.min(highestScore + 1, 10);
  }

  // Adjust level based on final score
  if (highestScore >= 9) {
    detectedLevel = 'CRITICAL';
  } else if (highestScore >= 7) {
    detectedLevel = 'HIGH';
  } else if (highestScore >= 4) {
    detectedLevel = 'MEDIUM';
  }

  return {
    score: Math.min(highestScore, 10),
    level: detectedLevel,
    keywords: matchedKeywords
  };
}
