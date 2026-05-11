import krishna from "@/assets/story-krishna.jpg";
import hanuman from "@/assets/story-hanuman.jpg";
import sage from "@/assets/story-sage.jpg";
import rama from "@/assets/story-rama.jpg";
import ganesha from "@/assets/story-ganesha.jpg";
import arjuna from "@/assets/story-arjuna.jpg";
import draupadi from "@/assets/story-draupadi.jpg";
import eklavya from "@/assets/story-eklavya.jpg";
import savitri from "@/assets/story-savitri.jpg";
import prahlad from "@/assets/story-prahlad.jpg";

export type Choice = {
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
};

export type StoryPage = {
  text: string;
  image?: string;
  choice?: Choice;
  wisdom?: string;
};

export type AgeStage = "Little" | "Curious" | "Seeker";

export const AGE_STAGES: { id: AgeStage; label: string; range: string }[] = [
  { id: "Little", label: "Little Ones", range: "ages 4–6" },
  { id: "Curious", label: "Curious Hearts", range: "ages 7–9" },
  { id: "Seeker", label: "Young Seekers", range: "ages 10+" },
];

export type Character = {
  name: string;
  emoji: string;
  blurb: string;
};

export type Story = {
  slug: string;
  title: string;
  realm: string;
  duration: string;
  image: string;
  blurb: string;
  lesson: string;
  pages: StoryPage[];
  level: 1 | 2 | 3;
  ageStage: AgeStage;
  character: Character;
};

export const stories: Story[] = [
  {
    slug: "boy-who-held-the-mountain",
    title: "The Boy Who Held the Mountain",
    realm: "Vrindavan",
    duration: "3 min",
    image: krishna,
    blurb:
      "Discover how young Krishna protected his village from a mighty storm — a story about caring for those we love.",
    lesson: "True strength is used to protect, not to harm.",
    level: 1,
    pages: [
      {
        text: "Long ago in a green village called Vrindavan, a boy named Krishna sat under a flowering tree, playing his flute.",
        image: krishna,
      },
      {
        text: "One day, dark clouds gathered. Rain poured down so hard the cows could not find shelter and the children began to cry.",
        choice: {
          question: "What do you think Krishna felt when he saw his village in trouble?",
          options: ["💛 He wanted to help", "😴 He didn't notice", "😠 He felt angry"],
          correctIndex: 0,
          feedback: "Yes — Krishna felt love. Love is what makes us want to protect others.",
        },
      },
      {
        text: "Krishna smiled gently. He walked to the great Govardhan hill and lifted it up with one little finger — like an umbrella over his whole village.",
      },
      {
        text: "For seven days he held the mountain high. The villagers stayed warm and dry, and the cows stood close to him.",
      },
      {
        text: "When the storm passed, Krishna placed the hill back down. 'We are strong,' he said, 'when we keep each other safe.'",
        wisdom: "True strength is used to protect, not to harm.",
      },
    ],
  },
  {
    slug: "leap-to-lanka",
    title: "Hanuman's Great Leap",
    realm: "The Wide Ocean",
    duration: "4 min",
    image: hanuman,
    blurb:
      "Hanuman stands at the edge of the world. Inside him, a quiet power waits to be remembered.",
    lesson: "Believe in yourself — your strength is bigger than you know.",
    level: 1,
    pages: [
      {
        text: "Hanuman stood at the very edge of the ocean. Far, far away was an island where his friend Sita waited to be found.",
        image: hanuman,
      },
      {
        text: "'I am only a small monkey,' he thought. 'How can I cross such a wide sea?'",
        choice: {
          question: "What gave Hanuman the courage to leap?",
          options: ["🙏 Remembering who he truly was", "💪 His muscles alone", "🍌 A tasty snack"],
          correctIndex: 0,
          feedback: "Yes! Sometimes courage means remembering the strength already inside us.",
        },
      },
      {
        text: "An old wise bear came near. 'Hanuman,' he whispered, 'you have forgotten who you are. You are made of wind and courage.'",
      },
      {
        text: "Hanuman closed his eyes. He took a deep breath. He remembered. Then he leaped — high over the clouds!",
      },
      {
        text: "He landed safely on the far shore. Sometimes the bravest thing is to remember how strong we already are.",
        wisdom: "True devotion gives us the courage to do the impossible.",
      },
    ],
  },
  {
    slug: "sage-and-the-river",
    title: "The Sage and the River",
    realm: "Quiet Hermitage",
    duration: "3 min",
    image: sage,
    blurb:
      "Why does the wisest master in the village spend every morning simply watching the water flow?",
    lesson: "Stillness teaches us what hurry hides.",
    level: 2,
    pages: [
      { text: "In a quiet hermitage by a clear river lived an old sage with a long white beard.", image: sage },
      {
        text: "Every morning, he would sit very still and watch the water. The village children wondered, 'Why doesn't he do anything?'",
        choice: {
          question: "What was the sage really doing?",
          options: ["🧘 Listening with his whole heart", "😴 Falling asleep", "🐟 Counting fish"],
          correctIndex: 0,
          feedback: "Yes! Stillness is its own kind of action — it lets us truly hear.",
        },
      },
      { text: "One day a small girl asked him. He smiled. 'Come sit with me. Watch the river for ten breaths.'" },
      { text: "She sat. She breathed. Slowly, her busy thoughts floated away like leaves on the water." },
      {
        text: "'Now you know,' said the sage. 'When the mind is still, the heart can listen.'",
        wisdom: "When the mind is still, the heart can hear what hurry hides.",
      },
    ],
  },
  {
    slug: "rama-and-the-deer",
    title: "Rama in the Forest",
    realm: "The Forest of Dandaka",
    duration: "3 min",
    image: rama,
    blurb:
      "Even princes must learn from the forest — about kindness, patience, and keeping a promise.",
    lesson: "A promise kept is worth more than a crown.",
    level: 2,
    pages: [
      { text: "Prince Rama walked through a great forest. He had given up his kingdom to keep a promise to his father.", image: rama },
      { text: "A small deer stepped out from the trees. It was hungry and afraid." },
      {
        text: "Rama knelt down. He shared his food and spoke softly until the deer was no longer afraid.",
        choice: {
          question: "Why did Rama help the little deer?",
          options: ["💛 Kindness, even with no one watching", "👀 To impress someone", "🏆 To win a prize"],
          correctIndex: 0,
          feedback: "Yes — true kindness is who we are when no one is looking.",
        },
      },
      { text: "'A true prince,' he thought, 'is gentle even when no one is watching.'" },
      {
        text: "Keeping our word — to others and to ourselves — makes the heart strong.",
        wisdom: "A promise kept — even a small one — makes the heart strong.",
      },
    ],
  },
  {
    slug: "ganesha-and-the-mouse",
    title: "Ganesha and the Little Mouse",
    realm: "Garden of Lotuses",
    duration: "3 min",
    image: ganesha,
    blurb:
      "How a tiny mouse became the best friend of a great elephant — a story about not judging by size.",
    lesson: "Big or small, every friend matters.",
    level: 1,
    pages: [
      { text: "In a garden of pink lotuses lived Ganesha — kind, wise, and shaped like a friendly elephant.", image: ganesha },
      {
        text: "One day a tiny mouse squeaked, 'Will you be my friend? I'm too small to matter.'",
        choice: {
          question: "What did Ganesha think when he saw the tiny mouse?",
          options: ["✨ Every being is precious", "🙄 Too small to matter", "🤷 He didn't care"],
          correctIndex: 0,
          feedback: "Yes — to a kind heart, no one is too small.",
        },
      },
      { text: "Ganesha laughed warmly. 'Small things move mountains. You will be my dearest friend and my swiftest helper.'" },
      { text: "And so the mouse rode on Ganesha's shoulder, and together they helped everyone in the village." },
      {
        text: "We are never too small to be needed. We are never too big to need a friend.",
        wisdom: "Big or small, every friend matters.",
      },
    ],
  },
  {
    slug: "arjunas-choice",
    title: "Arjuna's Choice",
    realm: "Field of Kurukshetra",
    duration: "4 min",
    image: arjuna,
    blurb:
      "Two armies. One brave heart. And a quiet question whispered between them: what is the right thing to do?",
    lesson: "Dharma means doing what is right, even when it is difficult.",
    level: 3,
    pages: [
      {
        text: "Two great armies stood facing each other on the wide field of Kurukshetra. The morning was very still.",
        image: arjuna,
      },
      {
        text: "Arjuna, the greatest archer in the world, looked across and saw his teachers, his uncles, his cousins — people he loved.",
        choice: {
          question: "What do you think Arjuna's heart felt?",
          options: ["💔 A deep sadness", "😡 Pure anger", "😴 Nothing at all"],
          correctIndex: 0,
          feedback: "Yes — even great heroes feel sadness. Feeling deeply is part of being brave.",
        },
      },
      {
        text: "Arjuna lowered his bow. 'Krishna,' he whispered, 'I cannot fight. These are my own family.'",
      },
      {
        text: "Krishna smiled gently. 'Arjuna, your dharma is to protect what is right. Do not run from what must be done — out of love or out of fear.'",
        wisdom: "Dharma means doing what is right, even when it is difficult.",
      },
    ],
  },
  {
    slug: "draupadis-courage",
    title: "Draupadi's Quiet Courage",
    realm: "The Great Hall",
    duration: "3 min",
    image: draupadi,
    blurb:
      "When no one else dared to speak, one princess stood very still — and let the truth be heard.",
    lesson: "Courage is speaking the truth, even when your voice trembles.",
    level: 3,
    pages: [
      {
        text: "Draupadi was a princess known not for her crown, but for her wisdom and her clear, brave heart.",
        image: draupadi,
      },
      {
        text: "One day in the great hall, she was treated unfairly. Many wise men sat around her — but no one said a word.",
        choice: {
          question: "What did Draupadi do?",
          options: ["🔥 She spoke up", "🤫 She stayed silent", "🏃 She ran away"],
          correctIndex: 0,
          feedback: "Yes! Speaking the truth, gently and bravely, is one of the greatest acts of dharma.",
        },
      },
      {
        text: "She looked at the gathered kings and asked, 'Is there not one person here with the courage to speak the truth?'",
      },
      {
        text: "Her words shook the whole hall. Even the silent felt ashamed. One brave voice can change everything.",
        wisdom: "Courage is speaking the truth — even when your voice trembles.",
      },
    ],
  },
  {
    slug: "eklavyas-practice",
    title: "Eklavya's Quiet Practice",
    realm: "Forest Hermitage",
    duration: "3 min",
    image: eklavya,
    blurb:
      "A boy with no teacher, no school, no help — and yet he became one of the greatest archers of all.",
    lesson: "Dedication is the greatest teacher.",
    level: 2,
    pages: [
      {
        text: "Eklavya was a boy from a forest village who dreamed of becoming a great archer. But no teacher would take him as a student.",
        image: eklavya,
      },
      {
        text: "Instead of giving up, he made a small statue of the great teacher Dronacharya from clay.",
        choice: {
          question: "What did Eklavya do every single day?",
          options: ["🏹 Practiced — alone", "📺 Watched others", "😢 Felt sorry for himself"],
          correctIndex: 0,
          feedback: "Yes! Practicing — even when no one is watching — is the greatest teacher.",
        },
      },
      {
        text: "Every morning and every evening, he practiced his archery in front of the statue. Year after year.",
      },
      {
        text: "He became so skilled that he passed every student at the royal academy — without ever stepping inside.",
        wisdom: "Dedication and quiet practice can take you farther than any classroom.",
      },
    ],
  },
  {
    slug: "savitri-and-the-stars",
    title: "Savitri and the Quiet Walk",
    realm: "Twilight Forest",
    duration: "4 min",
    image: savitri,
    blurb:
      "When a great being came to take what she loved, Savitri did the bravest thing of all — she simply followed.",
    lesson: "Love and wisdom together can soften any heart.",
    level: 3,
    pages: [
      {
        text: "Savitri was a princess so wise and so loving that even the stars were said to listen when she spoke.",
        image: savitri,
      },
      {
        text: "One twilight, a great being came to take her beloved away. Savitri did not weep. She simply followed.",
        choice: {
          question: "What did Savitri do as she walked?",
          options: ["💬 She asked wise questions", "😢 She cried loudly", "🏃 She tried to fight"],
          correctIndex: 0,
          feedback: "Yes! Quiet wisdom and gentle questions can move even the strongest hearts.",
        },
      },
      {
        text: "She walked and walked, asking gentle questions, until the great being said, 'You impress me. Ask for any gift.'",
      },
      {
        text: "Savitri smiled. With one clever wish, she asked for something only her beloved being alive could give. Her love and her cleverness brought him back.",
        wisdom: "Love joined with wisdom can soften even the hardest heart.",
      },
    ],
  },
  {
    slug: "prahlads-faith",
    title: "Prahlad's Quiet Faith",
    realm: "The Old Kingdom",
    duration: "3 min",
    image: prahlad,
    blurb:
      "A small boy whose heart was so full of love that nothing could shake him.",
    lesson: "True faith is gentle, steady, and made of love.",
    level: 2,
    pages: [
      {
        text: "Prahlad was a young boy whose father was a powerful king who did not believe in the divine.",
        image: prahlad,
      },
      {
        text: "But Prahlad loved the divine with his whole heart, and quietly prayed every day.",
        choice: {
          question: "What kept Prahlad steady when others tried to scare him?",
          options: ["💛 His love", "💪 His strength", "🏰 His palace"],
          correctIndex: 0,
          feedback: "Yes! Love is a quiet kind of strength — softer than steel, and stronger.",
        },
      },
      {
        text: "His father tried many things to stop him. But Prahlad simply smiled and said, 'The divine is in everything — even in you, Father.'",
      },
      {
        text: "His quiet, loving faith protected him. The whole kingdom learned that gentleness can be the greatest power.",
        wisdom: "True faith is gentle, steady, and made of love.",
      },
    ],
  },
];

export type Mission = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export const missions: Mission[] = [
  {
    id: "listen",
    title: "The Gift of Listening",
    description:
      "Sit with someone older in your family for a few minutes. Ask them about their favorite memory from when they were your age.",
    category: "Karma Yoga",
  },
  {
    id: "still",
    title: "Quiet Hands, Quiet Heart",
    description:
      "Find a comfy spot and sit perfectly still for one whole minute. Notice every sound you can hear.",
    category: "Stillness",
  },
  {
    id: "thanks",
    title: "Three Thank-Yous",
    description:
      "Say thank you to three different people today. Mean it deeply each time.",
    category: "Gratitude",
  },
  {
    id: "help",
    title: "Silent Helper",
    description:
      "Do one helpful thing for someone in your home today — without telling them you did it.",
    category: "Kindness",
  },
  {
    id: "breath",
    title: "Five Lotus Breaths",
    description:
      "Imagine a lotus opening in your chest. Breathe in slowly through your nose, then out softly through your mouth — five times.",
    category: "Pranayama",
  },
];

export type Chant = {
  id: string;
  name: string;
  meaning: string;
  text: string;
  duration: string;
};

export const chants: Chant[] = [
  {
    id: "om",
    name: "Om",
    meaning: "The first sound — a hum that calms everything inside.",
    text: "Om… Om… Om…",
    duration: "1:00",
  },
  {
    id: "gayatri",
    name: "Gayatri Mantra",
    meaning: "A morning prayer for a clear, kind, and shining mind.",
    text: "Om bhūr bhuvaḥ svaḥ\nTat savitur vareṇyaṃ\nBhargo devasya dhīmahi\nDhiyo yo naḥ pracodayāt",
    duration: "2:15",
  },
  {
    id: "shanti",
    name: "Om Shanti",
    meaning: "A wish for peace — for me, for you, for everyone.",
    text: "Om Shanti, Shanti, Shanti",
    duration: "1:30",
  },
];

export type JourneyNode = {
  storySlug: string;
  label: string;
};

export const journey: { realm: string; nodes: JourneyNode[] }[] = [
  {
    realm: "Vrindavan",
    nodes: [
      { storySlug: "boy-who-held-the-mountain", label: "The Mountain" },
      { storySlug: "ganesha-and-the-mouse", label: "The Mouse" },
    ],
  },
  {
    realm: "The Forest of Epics",
    nodes: [
      { storySlug: "rama-and-the-deer", label: "The Deer" },
      { storySlug: "leap-to-lanka", label: "The Leap" },
    ],
  },
  {
    realm: "Field of Kurukshetra",
    nodes: [
      { storySlug: "arjunas-choice", label: "The Choice" },
      { storySlug: "draupadis-courage", label: "The Voice" },
      { storySlug: "eklavyas-practice", label: "The Practice" },
    ],
  },
  {
    realm: "The Twilight Lands",
    nodes: [
      { storySlug: "savitri-and-the-stars", label: "The Quiet Walk" },
      { storySlug: "prahlads-faith", label: "The Faith" },
    ],
  },
  {
    realm: "The Quiet Hermitage",
    nodes: [{ storySlug: "sage-and-the-river", label: "The River" }],
  },
];
