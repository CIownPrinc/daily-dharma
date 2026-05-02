import krishna from "@/assets/story-krishna.jpg";
import hanuman from "@/assets/story-hanuman.jpg";
import sage from "@/assets/story-sage.jpg";
import rama from "@/assets/story-rama.jpg";
import ganesha from "@/assets/story-ganesha.jpg";

export type Story = {
  slug: string;
  title: string;
  realm: string;
  duration: string;
  image: string;
  blurb: string;
  lesson: string;
  pages: { text: string; image?: string }[];
  level: 1 | 2 | 3;
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
      },
      {
        text: "Krishna smiled gently. He walked to the great Govardhan hill and lifted it up with one little finger — like an umbrella over his whole village.",
      },
      {
        text: "For seven days he held the mountain high. The villagers stayed warm and dry, and the cows stood close to him.",
      },
      {
        text: "When the storm passed, Krishna placed the hill back down. 'We are strong,' he said, 'when we keep each other safe.'",
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
      },
      {
        text: "An old wise bear came near. 'Hanuman,' he whispered, 'you have forgotten who you are. You are made of wind and courage.'",
      },
      {
        text: "Hanuman closed his eyes. He took a deep breath. He remembered. Then he leaped — high over the clouds!",
      },
      {
        text: "He landed safely on the far shore. Sometimes the bravest thing is to remember how strong we already are.",
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
      { text: "Every morning, he would sit very still and watch the water. The village children wondered, 'Why doesn't he do anything?'" },
      { text: "One day a small girl asked him. He smiled. 'Come sit with me. Watch the river for ten breaths.'" },
      { text: "She sat. She breathed. Slowly, her busy thoughts floated away like leaves on the water." },
      { text: "'Now you know,' said the sage. 'When the mind is still, the heart can listen.'" },
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
      { text: "Rama knelt down. He shared his food and spoke softly until the deer was no longer afraid." },
      { text: "'A true prince,' he thought, 'is gentle even when no one is watching.'" },
      { text: "Keeping our word — to others and to ourselves — makes the heart strong." },
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
      { text: "One day a tiny mouse squeaked, 'Will you be my friend? I'm too small to matter.'" },
      { text: "Ganesha laughed warmly. 'Small things move mountains. You will be my dearest friend and my swiftest helper.'" },
      { text: "And so the mouse rode on Ganesha's shoulder, and together they helped everyone in the village." },
      { text: "We are never too small to be needed. We are never too big to need a friend." },
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
    realm: "The Quiet Hermitage",
    nodes: [{ storySlug: "sage-and-the-river", label: "The River" }],
  },
];
