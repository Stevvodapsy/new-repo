// Mock Gemini chat service for demo/testing
export async function startChat(agent, property) {
  return {
    text: `Hello! This is ${
      agent?.name || "the agent"
    }. How can I help you with ${property?.title || "this property"}?`,
  };
}

export async function* sendMessageStream(message) {
  // Simulate streaming response
  const responses = ["Thanks for your message! ", "I'll get back to you soon."];
  for (const text of responses) {
    await new Promise((r) => setTimeout(r, 500));
    yield { text };
  }
}
