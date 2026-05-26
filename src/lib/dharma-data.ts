/**
 * Story images: public-domain paintings sourced from Wikimedia Commons.
 *
 * All images are from the Raja Ravi Varma collection or comparable 19th-century
 * Indian paintings with expired copyright (artist died 1906; well over 100 years
 * in the public domain in all jurisdictions).
 *
 * WHY external URLs instead of bundled assets:
 *   - AI-generated placeholder images were factually unreliable.
 *   - Wikimedia serves these via its global CDN — fast, reliable, always-on.
 *   - Keeping them external means the app bundle stays small (no 10MB of JPEGs).
 *   - Each Story has an `attribution` field displayed in the UI for proper credit.
 *
 * URL format: https://upload.wikimedia.org/wikipedia/commons/thumb/[a]/[ab]/[filename]/900px-[filename]
 * where [a]/[ab] is the first char / first two chars of the MD5 of the normalised filename.
 */

// Verified public-domain Wikimedia Commons URLs (900px thumbnails)
const IMAGES = {
  // Pahari school, c.1800 — Krishna lifts Govardhan hill to shelter villagers
  krishna:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Krishna_Holding_Mount_Govardhan.jpg/900px-Krishna_Holding_Mount_Govardhan.jpg",

  // Ravi Varma Press, c.1910s — Hanuman carrying the mountain of healing herbs
  hanuman:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Hanuman_fetches_the_herb-bearing_mountain%2C_in_a_print_from_the_Ravi_Varma_Press%2C_1910%27s.jpg/900px-Hanuman_fetches_the_herb-bearing_mountain%2C_in_a_print_from_the_Ravi_Varma_Press%2C_1910%27s.jpg",

  // Raja Ravi Varma — Sage Vishwamitra, c.1890s
  sage:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Raja_Ravi_Varma_-_Sage_Vishwamitra.jpg/900px-Raja_Ravi_Varma_-_Sage_Vishwamitra.jpg",

  // Raja Ravi Varma — Ravana, Sita and Jatayu (Rama & Sita forest exile scene)
  rama:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Ravi_Varma-Ravana_Sita_Jathayu.jpg/900px-Ravi_Varma-Ravana_Sita_Jathayu.jpg",

  // Ravi Varma Press — Ganesha with Riddhi and Siddhi
  ganesha:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ganesh_Ravi_Varma.jpg/900px-Ganesh_Ravi_Varma.jpg",

  // Traditional Indian painting — Arjuna and Krishna on the chariot
  arjuna:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Arjuna_and_krishna.jpg/900px-Arjuna_and_krishna.jpg",

  // Raja Ravi Varma — Draupadi
  draupadi:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Raja_Ravi_Varma_-_Draupadi.jpg/900px-Raja_Ravi_Varma_-_Draupadi.jpg",

  // Traditional Indian painting — Eklavya practising archery
  eklavya:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Eklavya.jpg/900px-Eklavya.jpg",

  // Raja Ravi Varma — Savitri and Satyavan
  savitri:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Raja_Ravi_Varma_-_Savitri_and_Satyavan.jpg/900px-Raja_Ravi_Varma_-_Savitri_and_Satyavan.jpg",

  // Traditional Indian painting — Prahlada and Narasimha
  prahlad:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Prahlada.jpg/900px-Prahlada.jpg",

  // Ravi Varma Press, c.1910s — devotional figure (Dhruva)
  dhruva:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ravivarma1910s.jpg/900px-Ravivarma1910s.jpg",

  // Traditional Indian painting — Nachiketa before Yama
  nachiketa:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Yama-Nachiketa.jpg/900px-Yama-Nachiketa.jpg",

  // Ravi Varma Press — Markandeya
  markandeya:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ravivarma_markendeya.jpg/900px-Ravivarma_markendeya.jpg",
} as const;

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
  /**
   * A line spoken in the character's voice on this specific page.
   * Use {name} as a placeholder — replaced at render time with the child's
   * first name. Only shown on pages after the first (page 0 lets the story open).
   */
  speakerLine?: string;
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

/**
 * Badge: earned on story completion.
 * "virtue" is the named quality this badge represents — used in badge blurbs
 * and the badge shelf in Sanctuary. The icon is an emoji rendered in the
 * BadgeRing component on the finish screen.
 */
export type Badge = {
  name: string;
  icon: string;
  virtue: string;
  /** A short line in the character's voice, shown on the badge card. */
  characterQuote: string;
};

/**
 * Mantra: story-specific chant shown on the finish screen.
 * syllables is used by ChantCard to highlight each syllable as the child chants.
 */
export type Mantra = {
  text: string;
  meaning: string;
  syllables: string[];
};

export type Story = {
  slug: string;
  title: string;
  realm: string;
  duration: string;
  image: string;
  /** Attribution text shown in the UI. All images are public domain. */
  attribution: string;
  /** Dominant scene color — used as the story background behind the text card. */
  sceneColor: string;
  blurb: string;
  lesson: string;
  pages: StoryPage[];
  level: 1 | 2 | 3;
  ageStage: AgeStage;
  character: Character;
  badge: Badge;
  mantra: Mantra;
};

export const stories: Story[] = [
  {
    slug: "boy-who-held-the-mountain",
    title: "The Boy Who Held the Mountain",
    realm: "Vrindavan",
    duration: "3 min",
    image: IMAGES.krishna,
    attribution: "Pahari school, c.1800 — public domain, Wikimedia Commons",
    sceneColor: "#1a237e",
    blurb: "Discover how young Krishna protected his village from a mighty storm — a story about caring for those we love.",
    lesson: "True strength is used to protect, not to harm.",
    level: 1,
    ageStage: "Little",
    character: { name: "Krishna", emoji: "🪈", blurb: "The flute-player who lifted a mountain to keep his village safe." },
    badge: {
      name: "Protector's Heart",
      icon: "🏔️",
      virtue: "Protective Love",
      characterQuote: "Krishna says: You too can be a shelter for someone today.",
    },
    mantra: {
      text: "Hare Krishna Hare Krishna",
      meaning: "I call to Krishna, the source of all joy and protection.",
      syllables: ["Ha-re", "Krish-na", "Ha-re", "Krish-na"],
    },
    pages: [
      { text: "Long ago in a green village called Vrindavan, a boy named Krishna sat under a flowering tree, playing his flute.", image: IMAGES.krishna },
      {
        text: "One day, dark clouds gathered. Rain poured down so hard the cows could not find shelter and the children began to cry.",
        speakerLine: "Krishna says: {name}, did you know that love can make you strong enough to hold up a mountain?",
        choice: {
          question: "What do you think Krishna felt when he saw his village in trouble?",
          options: ["💛 He wanted to help", "😴 He didn't notice", "😠 He felt angry"],
          correctIndex: 0,
          feedback: "Yes — Krishna felt love. Love is what makes us want to protect others.",
        },
      },
      {
        text: "Krishna smiled gently. He walked to the great Govardhan hill and lifted it up with one little finger — like an umbrella over his whole village.",
        speakerLine: "Krishna says: When was the last time you protected someone you love?",
      },
      {
        text: "For seven days he held the mountain high. The villagers stayed warm and dry, and the cows stood close to him.",
        speakerLine: "Krishna says: Can you think of someone you protect or care for today, {name}?",
      },
      {
        text: "When the storm passed, Krishna placed the hill back down. 'We are strong,' he said, 'when we keep each other safe.'",
        wisdom: "True strength is used to protect, not to harm.",
        speakerLine: "Krishna says: {name}, that strength lives inside you too.",
      },
    ],
  },
  {
    slug: "leap-to-lanka",
    title: "Hanuman's Great Leap",
    realm: "The Wide Ocean",
    duration: "4 min",
    image: IMAGES.hanuman,
    attribution: "Ravi Varma Press, c.1910s — public domain, Wikimedia Commons",
    sceneColor: "#1b5e20",
    blurb: "Hanuman stands at the edge of the world. Inside him, a quiet power waits to be remembered.",
    lesson: "Believe in yourself — your strength is bigger than you know.",
    level: 1,
    ageStage: "Curious",
    character: { name: "Hanuman", emoji: "🐒", blurb: "The brave one made of wind and devotion." },
    badge: {
      name: "Loyal Guardian",
      icon: "🐒",
      virtue: "Devotion",
      characterQuote: "Hanuman says: True strength comes from the love we carry inside.",
    },
    mantra: {
      text: "Jai Hanuman Gyan Gun Sagar",
      meaning: "Victory to Hanuman, ocean of wisdom and virtue.",
      syllables: ["Jai", "Ha-nu-man", "Gyan", "Gun", "Sa-gar"],
    },
    pages: [
      { text: "Hanuman stood at the very edge of the ocean. Far, far away was an island where his friend Sita waited to be found.", image: IMAGES.hanuman },
      {
        text: "'I am only a small monkey,' he thought. 'How can I cross such a wide sea?'",
        speakerLine: "Hanuman says: {name}, have you ever forgotten how brave you really are?",
        choice: {
          question: "What gave Hanuman the courage to leap?",
          options: ["🙏 Remembering who he truly was", "💪 His muscles alone", "🍌 A tasty snack"],
          correctIndex: 0,
          feedback: "Yes! Sometimes courage means remembering the strength already inside us.",
        },
      },
      {
        text: "An old wise bear came near. 'Hanuman,' he whispered, 'you have forgotten who you are. You are made of wind and courage.'",
        speakerLine: "Hanuman says: The wise bear is right. We forget our own strength. Shall we remember together?",
      },
      {
        text: "Hanuman closed his eyes. He took a deep breath. He remembered. Then he leaped — high over the clouds!",
        speakerLine: "Hanuman says: Take a deep breath with me, {name}.",
      },
      {
        text: "He landed safely on the far shore. Sometimes the bravest thing is to remember how strong we already are.",
        wisdom: "True devotion gives us the courage to do the impossible.",
        speakerLine: "Hanuman says: {name}, what is your ocean? What feels impossible — but maybe isn't?",
      },
    ],
  },
  {
    slug: "sage-and-the-river",
    title: "The Sage and the River",
    realm: "Quiet Hermitage",
    duration: "3 min",
    image: IMAGES.sage,
    attribution: "Raja Ravi Varma — public domain, Wikimedia Commons",
    sceneColor: "#37474f",
    blurb: "Why does the wisest master in the village spend every morning simply watching the water flow?",
    lesson: "Stillness teaches us what hurry hides.",
    level: 2,
    ageStage: "Curious",
    character: { name: "The Old Sage", emoji: "🧘", blurb: "A quiet teacher who listens to the river." },
    badge: {
      name: "Still Waters",
      icon: "🌊",
      virtue: "Stillness",
      characterQuote: "The Sage says: In your quiet moments, wisdom finds a way in.",
    },
    mantra: {
      text: "Om Shanti Shanti Shanti",
      meaning: "Peace — in my mind, in my heart, and in the world around me.",
      syllables: ["Om", "Shan-ti", "Shan-ti", "Shan-ti"],
    },
    pages: [
      { text: "In a quiet hermitage by a clear river lived an old sage with a long white beard.", image: IMAGES.sage },
      {
        text: "Every morning, he would sit very still and watch the water. The village children wondered, 'Why doesn't he do anything?'",
        speakerLine: "The Sage says: {name}, what do you hear when everything is quiet?",
        choice: {
          question: "What was the sage really doing?",
          options: ["🧘 Listening with his whole heart", "😴 Falling asleep", "🐟 Counting fish"],
          correctIndex: 0,
          feedback: "Yes! Stillness is its own kind of action — it lets us truly hear.",
        },
      },
      {
        text: "One day a small girl asked him. He smiled. 'Come sit with me. Watch the river for ten breaths.'",
        speakerLine: "The Sage says: Come. Sit with me, {name}. Ten breaths. Just ten.",
      },
      {
        text: "She sat. She breathed. Slowly, her busy thoughts floated away like leaves on the water.",
        speakerLine: "The Sage says: {name}, you just did it. You listened. How did that feel?",
      },
      {
        text: "'Now you know,' said the sage. 'When the mind is still, the heart can listen.'",
        wisdom: "When the mind is still, the heart can hear what hurry hides.",
        speakerLine: "The Sage says: The river never stops, and neither does your quiet heart.",
      },
    ],
  },
  {
    slug: "rama-and-the-deer",
    title: "Rama in the Forest",
    realm: "The Forest of Dandaka",
    duration: "3 min",
    image: IMAGES.rama,
    attribution: "Raja Ravi Varma — public domain, Wikimedia Commons",
    sceneColor: "#bf360c",
    blurb: "Even princes must learn from the forest — about kindness, patience, and keeping a promise.",
    lesson: "A promise kept is worth more than a crown.",
    level: 2,
    ageStage: "Little",
    character: { name: "Rama", emoji: "🏹", blurb: "A prince who keeps every promise, even small ones." },
    badge: {
      name: "Keeper of Words",
      icon: "🏹",
      virtue: "Integrity",
      characterQuote: "Rama says: A small promise kept is worth more than a great one broken.",
    },
    mantra: {
      text: "Om Sri Ramaya Namaha",
      meaning: "I honor Lord Rama, the ideal of goodness and integrity.",
      syllables: ["Om", "Sri", "Ra-ma-ya", "Na-ma-ha"],
    },
    pages: [
      { text: "Prince Rama walked through a great forest. He had given up his kingdom to keep a promise to his father.", image: IMAGES.rama },
      {
        text: "A small deer stepped out from the trees. It was hungry and afraid.",
        speakerLine: "Rama says: {name}, I gave up my crown to keep a promise. What promises matter most to you?",
      },
      {
        text: "Rama knelt down. He shared his food and spoke softly until the deer was no longer afraid.",
        speakerLine: "Rama says: True kindness asks for nothing in return.",
        choice: {
          question: "Why did Rama help the little deer?",
          options: ["💛 Kindness, even with no one watching", "👀 To impress someone", "🏆 To win a prize"],
          correctIndex: 0,
          feedback: "Yes — true kindness is who we are when no one is looking.",
        },
      },
      {
        text: "'A true prince,' he thought, 'is gentle even when no one is watching.'",
        speakerLine: "Rama says: {name}, can you think of one small promise to keep this week?",
      },
      {
        text: "Keeping our word — to others and to ourselves — makes the heart strong.",
        wisdom: "A promise kept — even a small one — makes the heart strong.",
        speakerLine: "Rama says: A promise kept is worth more than any crown, {name}.",
      },
    ],
  },
  {
    slug: "ganesha-and-the-mouse",
    title: "Ganesha and the Little Mouse",
    realm: "Garden of Lotuses",
    duration: "3 min",
    image: IMAGES.ganesha,
    attribution: "Ravi Varma Press — public domain, Wikimedia Commons",
    sceneColor: "#e65100",
    blurb: "How a tiny mouse became the best friend of a great elephant — a story about not judging by size.",
    lesson: "Big or small, every friend matters.",
    level: 1,
    ageStage: "Little",
    character: { name: "Ganesha", emoji: "🐘", blurb: "The kind elephant who sees every friend, big or small." },
    badge: {
      name: "Open Heart",
      icon: "🐘",
      virtue: "Inclusion",
      characterQuote: "Ganesha says: No one is too small to matter. No one is too big to need a friend.",
    },
    mantra: {
      text: "Om Gam Ganapataye Namaha",
      meaning: "I honor Ganesha, the remover of obstacles and friend to all.",
      syllables: ["Om", "Gam", "Ga-na-pa-ta-ye", "Na-ma-ha"],
    },
    pages: [
      { text: "In a garden of pink lotuses lived Ganesha — kind, wise, and shaped like a friendly elephant.", image: IMAGES.ganesha },
      {
        text: "One day a tiny mouse squeaked, 'Will you be my friend? I'm too small to matter.'",
        speakerLine: "Ganesha says: Hello, {name}! I see every friend — big or small. Do you?",
        choice: {
          question: "What did Ganesha think when he saw the tiny mouse?",
          options: ["✨ Every being is precious", "🙄 Too small to matter", "🤷 He didn't care"],
          correctIndex: 0,
          feedback: "Yes — to a kind heart, no one is too small.",
        },
      },
      {
        text: "Ganesha laughed warmly. 'Small things move mountains. You will be my dearest friend and my swiftest helper.'",
        speakerLine: "Ganesha says: {name}, is there someone who feels small or left out that you could befriend today?",
      },
      {
        text: "And so the mouse rode on Ganesha's shoulder, and together they helped everyone in the village.",
        speakerLine: "Ganesha says: You are never too small to matter, {name}.",
      },
      {
        text: "We are never too small to be needed. We are never too big to need a friend.",
        wisdom: "Big or small, every friend matters.",
        speakerLine: "Ganesha says: {name}, who will you make feel seen today?",
      },
    ],
  },
  {
    slug: "arjunas-choice",
    title: "Arjuna's Choice",
    realm: "Field of Kurukshetra",
    duration: "4 min",
    image: IMAGES.arjuna,
    attribution: "Traditional Indian painting — public domain, Wikimedia Commons",
    sceneColor: "#1a237e",
    blurb: "Two armies. One brave heart. And a quiet question whispered between them: what is the right thing to do?",
    lesson: "Dharma means doing what is right, even when it is difficult.",
    level: 3,
    ageStage: "Seeker",
    character: { name: "Arjuna", emoji: "🎯", blurb: "A great archer who learned that feeling deeply is part of being brave." },
    badge: {
      name: "Courageous Heart",
      icon: "🎯",
      virtue: "Dharma",
      characterQuote: "Arjuna says: Feeling afraid does not mean you are weak — it means you truly care.",
    },
    mantra: {
      text: "Om Namo Bhagavate Vasudevaya",
      meaning: "I bow to Lord Krishna, who lives in all hearts and guides us to do what is right.",
      syllables: ["Om", "Na-mo", "Bha-ga-va-te", "Va-su-de-va-ya"],
    },
    pages: [
      { text: "Two great armies stood facing each other on the wide field of Kurukshetra. The morning was very still.", image: IMAGES.arjuna },
      {
        text: "Arjuna, the greatest archer in the world, looked across and saw his teachers, his uncles, his cousins — people he loved.",
        speakerLine: "Arjuna says: {name}, have you ever had to do something hard because it was right?",
        choice: {
          question: "What do you think Arjuna's heart felt?",
          options: ["💔 A deep sadness", "😡 Pure anger", "😴 Nothing at all"],
          correctIndex: 0,
          feedback: "Yes — even great heroes feel sadness. Feeling deeply is part of being brave.",
        },
      },
      {
        text: "Arjuna lowered his bow. 'Krishna,' he whispered, 'I cannot fight. These are my own family.'",
        speakerLine: "Arjuna says: Even the greatest warriors feel afraid. That is not weakness — that is love.",
      },
      {
        text: "Krishna smiled gently. 'Arjuna, your dharma is to protect what is right. Do not run from what must be done — out of love or out of fear.'",
        wisdom: "Dharma means doing what is right, even when it is difficult.",
        speakerLine: "Arjuna says: {name}, Krishna's words changed my life. What do they say to yours?",
      },
    ],
  },
  {
    slug: "draupadis-courage",
    title: "Draupadi's Quiet Courage",
    realm: "The Great Hall",
    duration: "3 min",
    image: IMAGES.draupadi,
    attribution: "Raja Ravi Varma — public domain, Wikimedia Commons",
    sceneColor: "#880e4f",
    blurb: "When no one else dared to speak, one princess stood very still — and let the truth be heard.",
    lesson: "Courage is speaking the truth, even when your voice trembles.",
    level: 3,
    ageStage: "Seeker",
    character: { name: "Draupadi", emoji: "👑", blurb: "A princess whose quiet voice could shake a hall." },
    badge: {
      name: "Voice of Truth",
      icon: "👑",
      virtue: "Courage",
      characterQuote: "Draupadi says: One brave voice, however quiet, can change what everyone thinks is possible.",
    },
    mantra: {
      text: "Om Dum Durgayei Namaha",
      meaning: "I honor Durga, the goddess of strength and courage.",
      syllables: ["Om", "Dum", "Dur-ga-yei", "Na-ma-ha"],
    },
    pages: [
      { text: "Draupadi was a princess known not for her crown, but for her wisdom and her clear, brave heart.", image: IMAGES.draupadi },
      {
        text: "One day in the great hall, she was treated unfairly. Many wise men sat around her — but no one said a word.",
        speakerLine: "Draupadi says: {name}, a brave voice doesn't always shout. It simply speaks the truth.",
        choice: {
          question: "What did Draupadi do?",
          options: ["🔥 She spoke up", "🤫 She stayed silent", "🏃 She ran away"],
          correctIndex: 0,
          feedback: "Yes! Speaking the truth, gently and bravely, is one of the greatest acts of dharma.",
        },
      },
      {
        text: "She looked at the gathered kings and asked, 'Is there not one person here with the courage to speak the truth?'",
        speakerLine: "Draupadi says: {name}, if you were in that hall — what would you have said?",
      },
      {
        text: "Her words shook the whole hall. Even the silent felt ashamed. One brave voice can change everything.",
        wisdom: "Courage is speaking the truth — even when your voice trembles.",
        speakerLine: "Draupadi says: Your voice matters too, {name}. Even when it trembles.",
      },
    ],
  },
  {
    slug: "eklavyas-practice",
    title: "Eklavya's Quiet Practice",
    realm: "Forest Hermitage",
    duration: "3 min",
    image: IMAGES.eklavya,
    attribution: "Traditional Indian painting — public domain, Wikimedia Commons",
    sceneColor: "#33691e",
    blurb: "A boy with no teacher, no school, no help — and yet he became one of the greatest archers of all.",
    lesson: "Dedication is the greatest teacher.",
    level: 2,
    ageStage: "Curious",
    character: { name: "Eklavya", emoji: "🪶", blurb: "A boy who taught himself with patience and clay." },
    badge: {
      name: "Dedicated Spirit",
      icon: "🪶",
      virtue: "Discipline",
      characterQuote: "Eklavya says: The student who practices when no one is watching becomes the teacher everyone admires.",
    },
    mantra: {
      text: "Om Namo Narayanaya",
      meaning: "I bow to the divine in all things — the teacher within and without.",
      syllables: ["Om", "Na-mo", "Na-ra-ya-na-ya"],
    },
    pages: [
      { text: "Eklavya was a boy from a forest village who dreamed of becoming a great archer. But no teacher would take him as a student.", image: IMAGES.eklavya },
      {
        text: "Instead of giving up, he made a small statue of the great teacher Dronacharya from clay.",
        speakerLine: "Eklavya says: {name}, I had no teacher, no school. What did I have instead? Myself — and time.",
        choice: {
          question: "What did Eklavya do every single day?",
          options: ["🏹 Practiced — alone", "📺 Watched others", "😢 Felt sorry for himself"],
          correctIndex: 0,
          feedback: "Yes! Practicing — even when no one is watching — is the greatest teacher.",
        },
      },
      {
        text: "Every morning and every evening, he practiced his archery in front of the statue. Year after year.",
        speakerLine: "Eklavya says: Discipline is a quiet river, {name}. It doesn't rush. It just keeps going.",
      },
      {
        text: "He became so skilled that he passed every student at the royal academy — without ever stepping inside.",
        wisdom: "Dedication and quiet practice can take you farther than any classroom.",
        speakerLine: "Eklavya says: {name}, what would you practice today — even if nobody was watching?",
      },
    ],
  },
  {
    slug: "savitri-and-the-stars",
    title: "Savitri and the Quiet Walk",
    realm: "Twilight Forest",
    duration: "4 min",
    image: IMAGES.savitri,
    attribution: "Raja Ravi Varma — public domain, Wikimedia Commons",
    sceneColor: "#4a148c",
    blurb: "When a great being came to take what she loved, Savitri did the bravest thing of all — she simply followed.",
    lesson: "Love and wisdom together can soften any heart.",
    level: 3,
    ageStage: "Seeker",
    character: { name: "Savitri", emoji: "🌙", blurb: "A wise princess who walked beside the stars." },
    badge: {
      name: "Wisdom Seeker",
      icon: "🌙",
      virtue: "Wisdom",
      characterQuote: "Savitri says: Ask the right question and the whole universe leans in to answer.",
    },
    mantra: {
      text: "Om Aim Saraswatyei Namaha",
      meaning: "I honor Saraswati, goddess of wisdom and light.",
      syllables: ["Om", "Aim", "Sa-ras-wa-tyei", "Na-ma-ha"],
    },
    pages: [
      { text: "Savitri was a princess so wise and so loving that even the stars were said to listen when she spoke.", image: IMAGES.savitri },
      {
        text: "One twilight, a great being came to take her beloved away. Savitri did not weep. She simply followed.",
        speakerLine: "Savitri says: {name}, the bravest thing I ever did was simply keep walking and keep asking.",
        choice: {
          question: "What did Savitri do as she walked?",
          options: ["💬 She asked wise questions", "😢 She cried loudly", "🏃 She tried to fight"],
          correctIndex: 0,
          feedback: "Yes! Quiet wisdom and gentle questions can move even the strongest hearts.",
        },
      },
      {
        text: "She walked and walked, asking gentle questions, until the great being said, 'You impress me. Ask for any gift.'",
        speakerLine: "Savitri says: {name}, what question have you been afraid to ask?",
      },
      {
        text: "Savitri smiled. With one clever wish, she asked for something only her beloved being alive could give. Her love and her cleverness brought him back.",
        wisdom: "Love joined with wisdom can soften even the hardest heart.",
        speakerLine: "Savitri says: Love and wisdom together — {name}, you carry both already.",
      },
    ],
  },
  {
    slug: "prahlads-faith",
    title: "Prahlad's Quiet Faith",
    realm: "The Old Kingdom",
    duration: "3 min",
    image: IMAGES.prahlad,
    attribution: "Traditional Indian painting — public domain, Wikimedia Commons",
    sceneColor: "#311b92",
    blurb: "A small boy whose heart was so full of love that nothing could shake him.",
    lesson: "True faith is gentle, steady, and made of love.",
    level: 2,
    ageStage: "Curious",
    character: { name: "Prahlad", emoji: "🪷", blurb: "A small boy whose loving heart could not be shaken." },
    badge: {
      name: "Unshakeable Faith",
      icon: "🪷",
      virtue: "Faith",
      characterQuote: "Prahlad says: Love is the quietest kind of courage — and the strongest.",
    },
    mantra: {
      text: "Om Namo Narayanaya",
      meaning: "I bow to Vishnu, the protector who is always near.",
      syllables: ["Om", "Na-mo", "Na-ra-ya-na-ya"],
    },
    pages: [
      { text: "Prahlad was a young boy whose father was a powerful king who did not believe in the divine.", image: IMAGES.prahlad },
      {
        text: "But Prahlad loved the divine with his whole heart, and quietly prayed every day.",
        speakerLine: "Prahlad says: {name}, love is the quietest kind of courage.",
        choice: {
          question: "What kept Prahlad steady when others tried to scare him?",
          options: ["💛 His love", "💪 His strength", "🏰 His palace"],
          correctIndex: 0,
          feedback: "Yes! Love is a quiet kind of strength — softer than steel, and stronger.",
        },
      },
      {
        text: "His father tried many things to stop him. But Prahlad simply smiled and said, 'The divine is in everything — even in you, Father.'",
        speakerLine: "Prahlad says: {name}, what do you love so much that nothing could shake it?",
      },
      {
        text: "His quiet, loving faith protected him. The whole kingdom learned that gentleness can be the greatest power.",
        wisdom: "True faith is gentle, steady, and made of love.",
        speakerLine: "Prahlad says: Gentleness is not weakness, {name}. It is the strongest thing I know.",
      },
    ],
  },
  {
    slug: "dhruva-and-the-pole-star",
    title: "Dhruva and the Pole Star",
    realm: "The Eternal Sky",
    duration: "4 min",
    image: IMAGES.dhruva,
    attribution: "Ravi Varma Press, c.1910s — public domain, Wikimedia Commons",
    sceneColor: "#0d47a1",
    blurb: "A small boy walks alone into the forest with one quiet wish — and the whole sky listens.",
    lesson: "A steady heart shines longer than the brightest star.",
    level: 2,
    ageStage: "Curious",
    character: { name: "Dhruva", emoji: "⭐", blurb: "A boy whose quiet devotion became a star that never moves." },
    badge: {
      name: "Steadfast Star",
      icon: "⭐",
      virtue: "Perseverance",
      characterQuote: "Dhruva says: Stay still and steady long enough, and the whole sky will know your name.",
    },
    mantra: {
      text: "Om Vishnave Namaha",
      meaning: "I honor Vishnu, who holds all things steady.",
      syllables: ["Om", "Vish-na-ve", "Na-ma-ha"],
    },
    pages: [
      { text: "Dhruva was a small boy with a big sadness in his heart. He wished, more than anything, to be truly seen and loved.", image: IMAGES.dhruva },
      {
        text: "He walked alone into the forest. There, a wise sage taught him a single word to whisper, and a way of breathing slowly.",
        speakerLine: "Dhruva says: {name}, I was sad and lonely once too. I sat very still. Want to try it with me?",
        choice: {
          question: "What did Dhruva do, all alone in the forest?",
          options: ["🧘 He sat very still and prayed", "😢 He gave up", "🏃 He ran home"],
          correctIndex: 0,
          feedback: "Yes — quiet, steady practice can move even the stars.",
        },
      },
      {
        text: "Days became months. Dhruva sat so still that birds rested on his shoulders. He never stopped his quiet whisper.",
        speakerLine: "Dhruva says: Stillness is not emptiness, {name}. It is a very full kind of quiet.",
      },
      {
        text: "The sky itself began to shine for him. A soft voice said, 'Dhruva, your steady heart has touched the heavens.'",
        speakerLine: "Dhruva says: The stars listened, {name}. They always do.",
      },
      {
        text: "Dhruva was placed in the night sky as the Pole Star — the one star that never moves, guiding every traveler home.",
        wisdom: "A steady heart shines longer than the brightest star.",
        speakerLine: "Dhruva says: {name}, what will you be steady about — like the Pole Star?",
      },
    ],
  },
  {
    slug: "nachiketas-questions",
    title: "Nachiketa's Big Questions",
    realm: "The Eternal Sky",
    duration: "4 min",
    image: IMAGES.nachiketa,
    attribution: "Traditional Indian painting — public domain, Wikimedia Commons",
    sceneColor: "#004d40",
    blurb: "A curious boy walks straight up to the keeper of all endings — just to ask the question grown-ups are afraid to ask.",
    lesson: "Asking real questions is the beginning of real wisdom.",
    level: 3,
    ageStage: "Seeker",
    character: { name: "Nachiketa", emoji: "❓", blurb: "A bright boy whose questions opened the doors of wisdom." },
    badge: {
      name: "Seeker of Truth",
      icon: "❓",
      virtue: "Curiosity",
      characterQuote: "Nachiketa says: Never be afraid to ask the question no one else dares to ask.",
    },
    mantra: {
      text: "Asato Ma Sad Gamaya",
      meaning: "Lead me from the unreal to the real — from darkness to light.",
      syllables: ["A-sa-to", "Ma", "Sad", "Ga-ma-ya"],
    },
    pages: [
      { text: "Nachiketa was a bright boy who loved his father very much. One day, he asked a question his father didn't want to answer.", image: IMAGES.nachiketa },
      {
        text: "Instead of being upset, Nachiketa walked all the way to the great hall of Yama, the gentle keeper of endings, and waited politely for three days.",
        speakerLine: "Nachiketa says: {name}, I asked a question grown-ups were afraid to ask. Are you that curious?",
        choice: {
          question: "What did Nachiketa ask Yama for?",
          options: ["📜 The truth about life", "🪙 Lots of gold", "🏰 A big kingdom"],
          correctIndex: 0,
          feedback: "Yes! He cared more about understanding than about treasure.",
        },
      },
      {
        text: "Yama smiled. 'I will give you anything you wish — gold, kingdoms, long life. Just don't ask me your hard question.'",
        speakerLine: "Nachiketa says: {name}, he offered me gold and kingdoms. What would you have chosen?",
      },
      {
        text: "But Nachiketa shook his head gently. 'I don't want gold. I want to understand what is true.'",
        speakerLine: "Nachiketa says: The best questions are the ones that make wise people stop and think, {name}.",
      },
      {
        text: "Yama was so moved that he taught the boy the deepest secrets — that what is real inside us never ends.",
        wisdom: "Asking real questions, with a kind heart, opens the deepest doors.",
        speakerLine: "Nachiketa says: {name}, what is the one question you would ask if you could ask anything?",
      },
    ],
  },
  {
    slug: "markandeya-and-time",
    title: "Markandeya and the River of Time",
    realm: "The Eternal Sky",
    duration: "3 min",
    image: IMAGES.markandeya,
    attribution: "Ravi Varma Press — public domain, Wikimedia Commons",
    sceneColor: "#37474f",
    blurb: "When even Time itself came knocking, one small boy held on to what he loved — and discovered something stronger than endings.",
    lesson: "Love is the one thing that time cannot take.",
    level: 3,
    ageStage: "Seeker",
    character: { name: "Markandeya", emoji: "⏳", blurb: "A small boy whose love was older than time itself." },
    badge: {
      name: "Timeless Love",
      icon: "⏳",
      virtue: "Love",
      characterQuote: "Markandeya says: Hold on to what you love. Time cannot reach it there.",
    },
    mantra: {
      text: "Om Namah Shivaya",
      meaning: "I bow to Shiva, the eternal — beyond time, beyond endings.",
      syllables: ["Om", "Na-mah", "Shi-va-ya"],
    },
    pages: [
      { text: "Markandeya was a kind little boy who loved sitting in the temple, hugging the smooth stone of Shiva, singing softly.", image: IMAGES.markandeya },
      {
        text: "One day, the gentle figure of Time came to take him away. Markandeya didn't run. He held on tighter to the stone he loved.",
        speakerLine: "Markandeya says: {name}, I held on to what I loved. That is all I did.",
        choice: {
          question: "What gave Markandeya his courage?",
          options: ["💛 His love", "🏃 Running fast", "🤐 Hiding"],
          correctIndex: 0,
          feedback: "Yes — love is older and stronger than even time itself.",
        },
      },
      {
        text: "A great warmth filled the temple. Shiva himself appeared and said, 'A heart this loving cannot be carried away by time.'",
        speakerLine: "Markandeya says: {name}, what would you hold on to, no matter what?",
      },
      {
        text: "Markandeya was blessed to stay forever young. The river of time still flows — but love stands gently outside of it.",
        wisdom: "Love is the one thing that time cannot take.",
        speakerLine: "Markandeya says: Love is older than time, {name}. It always will be.",
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
  { id: "listen", title: "The Gift of Listening", description: "Sit with someone older in your family for a few minutes. Ask them about their favorite memory from when they were your age.", category: "Karma Yoga" },
  { id: "still", title: "Quiet Hands, Quiet Heart", description: "Find a comfy spot and sit perfectly still for one whole minute. Notice every sound you can hear.", category: "Stillness" },
  { id: "thanks", title: "Three Thank-Yous", description: "Say thank you to three different people today. Mean it deeply each time.", category: "Gratitude" },
  { id: "help", title: "Silent Helper", description: "Do one helpful thing for someone in your home today — without telling them you did it.", category: "Kindness" },
  { id: "breath", title: "Five Lotus Breaths", description: "Imagine a lotus opening in your chest. Breathe in slowly through your nose, then out softly through your mouth — five times.", category: "Pranayama" },
  { id: "kind-word", title: "One Kind Word", description: "Say something genuinely kind to someone today who might not be expecting it. Notice how it changes the air between you.", category: "Karma Yoga" },
  { id: "nature", title: "Five Minutes Outside", description: "Step outside. Look at the sky, touch the earth, notice what is alive around you. Be still for five whole minutes.", category: "Stillness" },
  { id: "share", title: "Share Something Small", description: "Share something you love — a snack, a song, a story — with someone around you today.", category: "Kindness" },
];

export type Chant = {
  id: string;
  name: string;
  meaning: string;
  text: string;
  duration: string;
};

export const chants: Chant[] = [
  { id: "om", name: "Om", meaning: "The first sound — a hum that calms everything inside.", text: "Om… Om… Om…", duration: "1:00" },
  { id: "gayatri", name: "Gayatri Mantra", meaning: "A morning prayer for a clear, kind, and shining mind.", text: "Om bhūr bhuvaḥ svaḥ\nTat savitur vareṇyaṃ\nBhargo devasya dhīmahi\nDhiyo yo naḥ pracodayāt", duration: "2:15" },
  { id: "shanti", name: "Om Shanti", meaning: "A wish for peace — for me, for you, for everyone.", text: "Om Shanti, Shanti, Shanti", duration: "1:30" },
];

export type JourneyNode = {
  storySlug: string;
  label: string;
};

export const journey: { realm: string; nodes: JourneyNode[] }[] = [
  { realm: "Vrindavan", nodes: [{ storySlug: "boy-who-held-the-mountain", label: "The Mountain" }, { storySlug: "ganesha-and-the-mouse", label: "The Mouse" }] },
  { realm: "The Forest of Epics", nodes: [{ storySlug: "rama-and-the-deer", label: "The Deer" }, { storySlug: "leap-to-lanka", label: "The Leap" }] },
  { realm: "Field of Kurukshetra", nodes: [{ storySlug: "arjunas-choice", label: "The Choice" }, { storySlug: "draupadis-courage", label: "The Voice" }, { storySlug: "eklavyas-practice", label: "The Practice" }] },
  { realm: "The Twilight Lands", nodes: [{ storySlug: "savitri-and-the-stars", label: "The Quiet Walk" }, { storySlug: "prahlads-faith", label: "The Faith" }] },
  { realm: "The Quiet Hermitage", nodes: [{ storySlug: "sage-and-the-river", label: "The River" }] },
  { realm: "The Eternal Sky", nodes: [{ storySlug: "dhruva-and-the-pole-star", label: "The Pole Star" }, { storySlug: "nachiketas-questions", label: "The Question" }, { storySlug: "markandeya-and-time", label: "The River of Time" }] },
];

// ─── DISCUSSION PROMPTS ───────────────────────────────────────────────────────
/**
 * Per-story discussion prompts for the parent dashboard.
 * Co-located with story data so adding a new story means adding its prompts
 * in one place, not hunting across route files.
 *
 * Structure: 2 specific prompts + 1 universal prompt per story (max 3).
 * Specific prompts follow recall → connection → extension structure.
 */
const DISCUSSION_PROMPTS: Record<string, string[]> = {
  "boy-who-held-the-mountain": [
    "Can you show me a time today when you protected or helped someone?",
    "If you could hold up an umbrella for your whole family, what would you protect them from?",
  ],
  "leap-to-lanka": [
    "What's one thing you think you can't do — but maybe you secretly can?",
    "Who helps you remember how strong you are when you forget?",
  ],
  "sage-and-the-river": [
    "Can we sit together for one whole minute and watch something quietly?",
    "What do you notice when you stop being busy and just listen?",
  ],
  "rama-and-the-deer": [
    "What's one promise you'd like to make this week — and keep?",
    "Was there a moment today when you were kind even when no one was watching?",
  ],
  "ganesha-and-the-mouse": [
    "Is there someone in your life who people might overlook — but who matters to you?",
    "How does it feel when someone notices you, even when you're small or quiet?",
  ],
  "arjunas-choice": [
    "Did you face a hard choice today? What did your heart tell you?",
    "What does 'doing what is right' mean to you right now?",
  ],
  "draupadis-courage": [
    "Was there a moment today when you wanted to speak up but didn't? What stopped you?",
    "What would you say if you were as brave as Draupadi?",
  ],
  "eklavyas-practice": [
    "What's something you'd love to get really good at, even if no one teaches you?",
    "Can we practice something together for 10 minutes this week?",
  ],
  "savitri-and-the-stars": [
    "What's the biggest question you've been wondering about lately?",
    "If you could ask a wise person anything, what would you ask?",
  ],
  "prahlads-faith": [
    "What's something you love so much it makes you feel brave?",
    "How do you stay yourself when someone tries to change you?",
  ],
  "dhruva-and-the-pole-star": [
    "What's one quiet thing you could do every day this week?",
    "What do you want to be steady and reliable about — like the Pole Star?",
  ],
  "nachiketas-questions": [
    "What's a big question you've been wondering about — even if it's scary to ask?",
    "What matters more to you: understanding something true, or getting something you want?",
  ],
  "markandeya-and-time": [
    "Who do you love so much that you'd hold on to them forever?",
    "What does 'love is stronger than time' mean to you?",
  ],
};

/** Returns up to 3 discussion prompts for a story (2 specific + 1 universal). */
export function getDiscussionPrompts(slug: string, characterName: string): string[] {
  const specific = DISCUSSION_PROMPTS[slug] ?? [];
  const universal = `What was your favorite moment in ${characterName}'s story, and why?`;
  return [...specific, universal].slice(0, 3);
}
