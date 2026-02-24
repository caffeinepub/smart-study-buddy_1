import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const studyResponses: Record<string, string> = {
  photosynthesis: `Photosynthesis is how plants make their own food! 🌱

Here's the simple version:
1. Plants take in sunlight, water, and carbon dioxide (CO2)
2. Using chlorophyll (the green stuff in leaves), they convert these into glucose (sugar) and oxygen
3. The formula: 6CO2 + 6H2O + Light → C6H12O6 + 6O2

Think of it like cooking - plants use sunlight as their "stove" to cook up their food!`,

  quadratic: `Quadratic equations are equations with x² in them! 📐

To solve ax² + bx + c = 0, use the quadratic formula:
x = (-b ± √(b² - 4ac)) / 2a

Steps:
1. Identify a, b, and c from your equation
2. Plug them into the formula
3. Calculate the discriminant (b² - 4ac)
4. Solve for both + and - to get two answers

Example: x² + 5x + 6 = 0
a=1, b=5, c=6
x = (-5 ± √(25-24)) / 2 = (-5 ± 1) / 2
So x = -2 or x = -3`,

  worldwar: `World War 2 had several main causes: 🌍

1. Treaty of Versailles (1919) - Germany was punished harshly after WW1, creating resentment
2. Economic Depression - The 1930s depression caused hardship worldwide
3. Rise of Dictators - Hitler (Germany), Mussolini (Italy), and militarists in Japan gained power
4. Appeasement - Other countries tried to avoid war by giving in to demands
5. Invasion of Poland (1939) - This was the final trigger that started the war

Remember: Multiple factors combined to create the conditions for war!`,

  memorize: `Here are my top tips for memorizing formulas: 🧠

1. **Understand First** - Don't just memorize, understand WHY the formula works
2. **Use Mnemonics** - Create funny phrases or acronyms
3. **Practice Daily** - Write formulas 5 times each day
4. **Flashcards** - Use our flashcard feature to quiz yourself!
5. **Apply Them** - Solve problems using the formulas
6. **Teach Others** - Explaining to friends helps you remember
7. **Visual Aids** - Draw diagrams or color-code parts of formulas

Pro tip: Review formulas right before bed - your brain consolidates memory during sleep!`,
};

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for keywords and return appropriate response
    if (lowerMessage.includes('photosynthesis')) {
      return studyResponses.photosynthesis;
    } else if (lowerMessage.includes('quadratic') || lowerMessage.includes('equation')) {
      return studyResponses.quadratic;
    } else if (lowerMessage.includes('world war') || lowerMessage.includes('ww2')) {
      return studyResponses.worldwar;
    } else if (lowerMessage.includes('memorize') || lowerMessage.includes('formula')) {
      return studyResponses.memorize;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hi there! 👋 I'm your AI Study Assistant. I'm here to help you understand topics better. Ask me about:
- Science concepts (like photosynthesis)
- Math problems (like quadratic equations)
- History topics (like World War 2)
- Study tips and techniques

What would you like to learn about today?`;
    } else if (lowerMessage.includes('thank')) {
      return `You're welcome! 😊 I'm always here to help. Keep up the great work with your studies!`;
    } else {
      return `That's a great question! While I have specific knowledge about common topics like photosynthesis, quadratic equations, World War 2, and study techniques, I'd be happy to help you with those areas.

For other topics, I recommend:
1. Breaking down the question into smaller parts
2. Checking your textbook or class notes
3. Discussing with your teacher or classmates

Is there anything else I can help you with from my knowledge areas?`;
    }
  };

  const sendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate typing delay
    setIsTyping(true);
    setTimeout(() => {
      const response = getResponse(content);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return {
    messages,
    sendMessage,
    isTyping,
  };
}
