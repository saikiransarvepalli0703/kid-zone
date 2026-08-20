/* Smart Kids Learning World - Comprehensive Learning Content Data */

window.appData = {
  // Alphabets A to Z
  alphabets: [
    { letter: 'A', word: 'Apple', emoji: '🍎', desc: 'A crunchy red fruit that grows on trees!', example: 'A is for Apple. An apple a day keeps the doctor away!' },
    { letter: 'B', word: 'Ball', emoji: '⚽', desc: 'A round toy for bouncing and playing games!', example: 'B is for Ball. Let us kick the bouncy soccer ball!' },
    { letter: 'C', word: 'Cat', emoji: '🐱', desc: 'A cute furry pet that says Meow!', example: 'C is for Cat. The playful kitty loves to chase yarn.' },
    { letter: 'D', word: 'Dog', emoji: '🐶', desc: 'A friendly pet that wags its tail and barks Woof!', example: 'D is for Dog. Spot is a happy puppy!' },
    { letter: 'E', word: 'Elephant', emoji: '🐘', desc: 'A giant animal with a long trunk and big ears!', example: 'E is for Elephant. The elephant swings its long trunk.' },
    { letter: 'F', word: 'Fish', emoji: '🐟', desc: 'A colorful animal that swims happily in water!', example: 'F is for Fish. Fish splish and splash in the blue sea.' },
    { letter: 'G', word: 'Giraffe', emoji: '🦒', desc: 'A tall animal with a super long neck to reach high leaves!', example: 'G is for Giraffe. The giraffe nibbles leaves from high trees.' },
    { letter: 'H', word: 'House', emoji: '🏠', desc: 'A cozy home where families live together!', example: 'H is for House. Welcome to our warm and happy house.' },
    { letter: 'I', word: 'Ice Cream', emoji: '🍦', desc: 'A sweet cold treat on a hot sunny day!', example: 'I is for Ice Cream. Yummy strawberry ice cream in a cone!' },
    { letter: 'J', word: 'Juice', emoji: '🧃', desc: 'A healthy delicious drink made from fresh fruit!', example: 'J is for Juice. Orange juice gives us energy!' },
    { letter: 'K', word: 'Kite', emoji: '🪁', desc: 'A light colorful toy that flies high in the sky!', example: 'K is for Kite. Look at the kite dancing in the wind!' },
    { letter: 'L', word: 'Lion', emoji: '🦁', desc: 'The brave King of the Jungle with a big golden mane!', example: 'L is for Lion. The lion roars proudly!' },
    { letter: 'M', word: 'Monkey', emoji: '🐒', desc: 'A silly animal that loves bananas and swings on vines!', example: 'M is for Monkey. The silly monkey swings through the trees.' },
    { letter: 'N', word: 'Nest', emoji: '🪹', desc: 'A cozy home built by birds high up in a tree!', example: 'N is for Nest. Little baby birds sleep safely in their nest.' },
    { letter: 'O', word: 'Owl', emoji: '🦉', desc: 'A wise bird with big eyes that stays awake at night!', example: 'O is for Owl. The owl says Whoo Whoo at night.' },
    { letter: 'P', word: 'Panda', emoji: '🐼', desc: 'A cute black and white bear that loves eating bamboo!', example: 'P is for Panda. The sleepy panda munches green bamboo.' },
    { letter: 'Q', word: 'Queen', emoji: '👑', desc: 'A royal ruler who wears a sparkling shiny crown!', example: 'Q is for Queen. The queen wears a crown full of jewels.' },
    { letter: 'R', word: 'Rainbow', emoji: '🌈', desc: 'A beautiful arch of seven bright colors in the sky!', example: 'R is for Rainbow. Look at the magic rainbow after the rain!' },
    { letter: 'S', word: 'Sun', emoji: '☀️', desc: 'The bright warm star that lights up our daytime sky!', example: 'S is for Sun. The golden sun shines brightly today!' },
    { letter: 'T', word: 'Tree', emoji: '🌳', desc: 'A tall green plant with thick branches and green leaves!', example: 'T is for Tree. Trees give us fresh air and shady spots.' },
    { letter: 'U', word: 'Umbrella', emoji: '☂️', desc: 'A handy canopy that protects us from rain drops!', example: 'U is for Umbrella. Open your umbrella when it rains!' },
    { letter: 'V', word: 'Violin', emoji: '🎻', desc: 'A wooden musical instrument that plays sweet music!', example: 'V is for Violin. She plays sweet melodies on her violin.' },
    { letter: 'W', word: 'Watermelon', emoji: '🍉', desc: 'A juicy green fruit with sweet red inside and black seeds!', example: 'W is for Watermelon. Cold watermelon is super refreshing!' },
    { letter: 'X', word: 'Xylophone', emoji: '🎼', desc: 'A musical toy with colorful bars you strike to make sounds!', example: 'X is for Xylophone. Tap the bars to play a happy tune!' },
    { letter: 'Y', word: 'Yacht', emoji: '⛵', desc: 'A fancy boat that sails across blue ocean waves!', example: 'Y is for Yacht. The white yacht sails on calm waters.' },
    { letter: 'Z', word: 'Zebra', emoji: '🦓', desc: 'A wild horse with black and white stripes all over!', example: 'Z is for Zebra. Zebras have unique black and white stripes!' }
  ],

  // Categorized Object Names
  objects: {
    fruits: [
      { name: 'Apple', emoji: '🍎', desc: 'Red & sweet fruit' },
      { name: 'Banana', emoji: '🍌', desc: 'Yellow long fruit rich in potassium' },
      { name: 'Orange', emoji: '🍊', desc: 'Juicy citrus fruit rich in Vitamin C' },
      { name: 'Grapes', emoji: '🍇', desc: 'Sweet small purple and green berries' },
      { name: 'Strawberry', emoji: '🍓', desc: 'Bright red berry with tiny seeds' },
      { name: 'Mango', emoji: '🥭', desc: 'Sweet tropical King of Fruits' },
      { name: 'Pineapple', emoji: '🍍', desc: 'Spiky outside with delicious yellow inside' }
    ],
    animals: [
      { name: 'Dog', emoji: '🐶', desc: 'Friendly loyal pet animal' },
      { name: 'Cat', emoji: '🐱', desc: 'Soft furry purring pet' },
      { name: 'Elephant', emoji: '🐘', desc: 'Gigantic land mammal with trunk' },
      { name: 'Lion', emoji: '🦁', desc: 'Roaring King of the Forest' },
      { name: 'Rabbit', emoji: '🐰', desc: 'Hoppy bunny with long ears' },
      { name: 'Duck', emoji: '🦆', desc: 'Quacking water bird' },
      { name: 'Tiger', emoji: '🐯', desc: 'Wild striped big cat' }
    ],
    vehicles: [
      { name: 'Car', emoji: '🚗', desc: 'Four wheeled vehicle for families' },
      { name: 'Bus', emoji: '🚌', desc: 'Big vehicle carrying many passengers' },
      { name: 'Airplane', emoji: '✈️', desc: 'Flies high up above the clouds' },
      { name: 'Train', emoji: '🚂', desc: 'Chugga chugga choo choo on tracks!' },
      { name: 'Bicycle', emoji: '🚲', desc: 'Two wheels powered by pedaling' },
      { name: 'Rocket', emoji: '🚀', desc: 'Zooms far out into outer space!' },
      { name: 'Helicopter', emoji: '🚁', desc: 'Flies with rotating blades on top' }
    ],
    colors: [
      { name: 'Red', emoji: '🔴', desc: 'The color of apples and hearts' },
      { name: 'Blue', emoji: '🔵', desc: 'The color of sky and ocean' },
      { name: 'Yellow', emoji: '🟡', desc: 'The color of sunshine and bananas' },
      { name: 'Green', emoji: '🟢', desc: 'The color of fresh grass and leaves' },
      { name: 'Purple', emoji: '🟣', desc: 'The color of grapes and royalty' },
      { name: 'Orange', emoji: '🟠', desc: 'The color of oranges and sunsets' },
      { name: 'Pink', emoji: '🩷', desc: 'The color of sweet cotton candy' }
    ],
    shapes: [
      { name: 'Circle', emoji: '⚪', desc: 'Round like a coin or clock' },
      { name: 'Square', emoji: '⏹️', desc: 'Four equal straight sides' },
      { name: 'Triangle', emoji: '🔺', desc: 'Three pointy corners' },
      { name: 'Star', emoji: '⭐', desc: 'Five points shining brightly' },
      { name: 'Heart', emoji: '❤️', desc: 'Symbol of love and affection' },
      { name: 'Diamond', emoji: '🔷', desc: 'Sparkling tilted square shape' }
    ],
    toys: [
      { name: 'Teddy Bear', emoji: '🧸', desc: 'Soft cozy cuddle friend' },
      { name: 'Building Blocks', emoji: '🧱', desc: 'Stack them to build towers' },
      { name: 'Doll', emoji: '🪆', desc: 'Pretend play companion' },
      { name: 'Toy Car', emoji: '🏎️', desc: 'Speedy mini racing car' },
      { name: 'Yo-Yo', emoji: '🪀', desc: 'Spins up and down on a string' }
    ],
    household: [
      { name: 'Clock', emoji: '⏰', desc: 'Tells us what time it is' },
      { name: 'Lamp', emoji: '💡', desc: 'Provides bright cozy light' },
      { name: 'Bed', emoji: '🛏️', desc: 'Comfy place for sweet dreams' },
      { name: 'Chair', emoji: '🪑', desc: 'Seat to sit down nicely' },
      { name: 'Door', emoji: '🚪', desc: 'Opens and closes to enter rooms' }
    ]
  },

  // Good Eating Habits
  eatingHabits: [
    { title: 'Wash Hands First', emoji: '🧼', text: 'Always wash your hands with soap and water for 20 seconds before touching food!', rule: 'Keep germs away!' },
    { title: 'Eat Fresh Veggies & Fruits', emoji: '🥦', text: 'Munch crisp apples, carrots, and green broccoli to grow strong and healthy!', rule: 'Super food power!' },
    { title: 'Avoid Junk Food', emoji: '🚫🍟', text: 'Too many chips, sodas, and candies can cause tummy aches. Choose healthy snacks instead!', rule: 'Healthy tummy!' },
    { title: 'Drink Plenty of Water', emoji: '💧', text: 'Water keeps your body hydrated, energetic, and fresh all day long!', rule: 'Sip fresh water!' },
    { title: 'Chew Food Slowly', emoji: '🪑', text: 'Sit down comfortably at the dining table and chew your food nicely without rushing.', rule: 'Polite eating!' }
  ],

  // Good Behavior and Manners
  manners: [
    { title: 'Say Please & Thank You', emoji: '🙏', text: 'Use magic words like "Please" when asking for help and "Thank You" when receiving things.', rule: 'Magic Manners' },
    { title: 'Respect Elders & Teachers', emoji: '👵', text: 'Listen kindly to parents, grandparents, and teachers. Greet them with a big smile!', rule: 'Kind Hearts' },
    { title: 'Share Toys & Treats', emoji: '🎁', text: 'Sharing toys with friends and siblings makes playtime double the fun for everyone!', rule: 'Sharing is Caring' },
    { title: 'Help Friends in Need', emoji: '🤝', text: 'If a friend falls down or needs help holding something, lend a helping hand!', rule: 'Friendship First' },
    { title: 'Keep Surroundings Clean', emoji: '🧹', text: 'Put toys back in their boxes after playing and throw wrappers into the dustbin.', rule: 'Clean & Tidy' },
    { title: 'Speak Politely & Softly', emoji: '😊', text: 'Use a gentle inside voice when talking to others. Do not shout or interrupt.', rule: 'Sweet Voice' }
  ],

  // Nursery Rhymes with Karaoke lines
  rhymes: [
    {
      id: 'twinkle',
      title: 'Twinkle Twinkle Little Star',
      emoji: '⭐',
      lines: [
        'Twinkle, twinkle, little star,',
        'How I wonder what you are!',
        'Up above the world so high,',
        'Like a diamond in the sky.',
        'Twinkle, twinkle, little star,',
        'How I wonder what you are!'
      ]
    },
    {
      id: 'macdonald',
      title: 'Old MacDonald Had a Farm',
      emoji: '🚜',
      lines: [
        'Old MacDonald had a farm, E-I-E-I-O!',
        'And on his farm he had some ducks, E-I-E-I-O!',
        'With a quack-quack here, and a quack-quack there,',
        'Here a quack, there a quack, everywhere a quack-quack!',
        'Old MacDonald had a farm, E-I-E-I-O!'
      ]
    },
    {
      id: 'itsy',
      title: 'Itsy Bitsy Spider',
      emoji: '🕷️',
      lines: [
        'The itsy bitsy spider climbed up the waterspout.',
        'Down came the rain and washed the spider out.',
        'Out came the sun and dried up all the rain,',
        'And the itsy bitsy spider climbed up the spout again!'
      ]
    },
    {
      id: 'bus',
      title: 'Wheels on the Bus',
      emoji: '🚌',
      lines: [
        'The wheels on the bus go round and round,',
        'Round and round, round and round.',
        'The wheels on the bus go round and round,',
        'All through the town!'
      ]
    },
    {
      id: 'abc',
      title: 'The ABC Song',
      emoji: '🔤',
      lines: [
        'A B C D E F G,',
        'H I J K L M N O P,',
        'Q R S, T U V,',
        'W X Y and Z.',
        'Now I know my ABCs,',
        'Next time won\'t you sing with me!'
      ]
    }
  ],

  // Reward Shop Stickers
  stickers: [
    { id: 'stk_1', name: 'Super Star', emoji: '🌟', price: 10, unlocked: false },
    { id: 'stk_2', name: 'Cool Dino', emoji: '🦕', price: 15, unlocked: false },
    { id: 'stk_3', name: 'Space Rocket', emoji: '🚀', price: 20, unlocked: false },
    { id: 'stk_4', name: 'Golden Trophy', emoji: '🏆', price: 25, unlocked: false },
    { id: 'stk_5', name: 'Unicorn', emoji: '🦄', price: 30, unlocked: false },
    { id: 'stk_6', name: 'Magic Crown', emoji: '👑', price: 35, unlocked: false }
  ]
};
