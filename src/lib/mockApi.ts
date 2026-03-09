const mockReplies: string[] = [
  "That's a great point! Let me add to that — in everyday English, people often say \"I'm good\" instead of \"I'm doing well.\" Both are perfectly acceptable in casual conversation.",
  "Nice try! Just a small correction: instead of \"I go to the store yesterday,\" you should say \"I went to the store yesterday.\" The past tense of 'go' is 'went.' Keep practicing!",
  "Excellent question! The difference between 'make' and 'do' can be tricky. We say 'make a decision' and 'do homework.' Generally, 'make' is for creating something, while 'do' is for tasks.",
  "You're improving so much! Here's a useful phrase for you: \"Could you say that again?\" — it's a polite way to ask someone to repeat themselves in a conversation.",
  "Great sentence structure! One tip: in English, we usually put the time at the end of the sentence. So instead of \"Yesterday I to the park went,\" say \"I went to the park yesterday.\"",
  "That's a common mistake, don't worry! 'Their,' 'there,' and 'they're' sound the same but have different meanings. 'Their' = possession, 'there' = place, 'they're' = they are.",
  "Well done! Your pronunciation is getting better. A helpful tip: the 'th' sound in English is made by putting your tongue between your teeth. Try saying 'think' and 'this' slowly.",
  "Interesting topic! Let's practice some vocabulary. In a restaurant, you can say: \"Could I have the menu, please?\" or \"I'd like to order the pasta.\" Want to try a role-play?",
  "You used the present perfect correctly! 'I have been studying English for two years' — perfect! The present perfect is used for actions that started in the past and continue to now.",
  "Here's a fun idiom for you: \"Break a leg!\" — it actually means \"Good luck!\" English has many idioms that don't mean what they literally say. Want to learn more?",
  "Your fluency is really coming along! Let me share a tip about intonation: in English, your voice goes up at the end of yes/no questions, like \"Are you ready?\" ⬆️",
  "That was a great attempt at using conditionals! Remember: \"If I had more time, I would travel more.\" This is the second conditional — we use it for hypothetical situations.",
];

function getRandomDelay(): number {
  return 1500 + Math.random() * 1000; // 1.5s to 2.5s
}

export async function fetchMockReply(_input: string | Blob): Promise<string> {
  const delay = getRandomDelay();
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockReplies.length);
      resolve(mockReplies[randomIndex]);
    }, delay);
  });
}
