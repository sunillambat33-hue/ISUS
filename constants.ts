import { ResourceItem } from './types';

export const CLASSES = [
  '12', '11', '10', '9',
  '8', '7', '6', '5',
  '4', '3', '2', '1'
];

export const SPECIAL_CLASSES = ['GATE', 'Dropper'];

export const BOARDS = [
  'NCERT', 'CBSE', 'Bihar', 'UP', 'Chhattisgarh',
  'Gujarat', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Punjab', 'Rajasthan', 'Tamilnadu',
  'ICSE', 'Odisha Board', 'West Bengal', 
  'Andhra Pradesh', 'Telangana', 'Haryana', 'Jharkhand'
];

export const EXAMS = [
  'JEE', 'NEET', 'KVPY', 'CUET (UG)'
];

export const RESOURCES: ResourceItem[] = [
  { id: '1', title: 'NCERT TextBooks', icon: 'book', color: 'bg-white' },
  { id: '2', title: 'NCERT Solution', icon: 'check-circle', color: 'bg-white' },
  { id: '3', title: 'NCERT Notes', icon: 'file-text', color: 'bg-white' },
  { id: '4', title: 'NCERT Exemplar', icon: 'award', color: 'bg-white' },
  { id: '5', title: 'CBSE Syllabus', icon: 'list', color: 'bg-white' },
  { id: '6', title: 'CBSE Sample Paper', icon: 'file', color: 'bg-white' },
  { id: '7', title: 'Previous Year Qs', icon: 'clock', color: 'bg-white' },
  { id: '8', title: 'Mock Tests', icon: 'edit', color: 'bg-white' },
];

export const MOCK_QUESTIONS = [
  {
    id: 1,
    text: "An A.C. circuit consists of a resistance and a choke in series. The resistance is of 220 Ω and choke is of 0.7 henry. The power absorbed from 220 volts and 50 Hz, source connected with the circuit, is?",
    options: [
      "120.08 watt",
      "109.97 watt",
      "100.08 watt",
      "98.08 watt"
    ],
    correctAnswer: 1,
    explanation: "Power P = V_rms * I_rms * cos(phi). First calculate impedance Z, then I_rms = V/Z, then Power."
  },
  {
    id: 2,
    text: "Which of the following is the unit of electric flux?",
    options: [
      "Weber",
      "Volt-meter",
      "Newton/Coulomb",
      "Joule/Coulomb"
    ],
    correctAnswer: 1,
    explanation: "Electric flux Φ = E * A. Unit of E is V/m, A is m^2. So V/m * m^2 = Volt-meter."
  }
];

export const SYLLABUS_DATA: Record<string, { subject: string, chapters: string[] }[]> = {
    '12': [
        { 
            subject: 'Physics', 
            chapters: [
                'Chapter 1: Electric Charges and Fields',
                'Chapter 2: Electrostatic Potential and Capacitance',
                'Chapter 3: Current Electricity',
                'Chapter 4: Moving Charges and Magnetism',
                'Chapter 5: Magnetism and Matter',
                'Chapter 6: Electromagnetic Induction',
                'Chapter 7: Alternating Current',
                'Chapter 8: Electromagnetic Waves',
                'Chapter 9: Ray Optics and Optical Instruments',
                'Chapter 10: Wave Optics'
            ]
        },
        { 
            subject: 'Chemistry', 
            chapters: [
                'Chapter 1: Solutions',
                'Chapter 2: Electrochemistry',
                'Chapter 3: Chemical Kinetics',
                'Chapter 4: The d- and f- Block Elements',
                'Chapter 5: Coordination Compounds',
                'Chapter 6: Haloalkanes and Haloarenes',
                'Chapter 7: Alcohols, Phenols and Ethers'
            ]
        },
        { 
            subject: 'Mathematics', 
            chapters: [
                'Chapter 1: Relations and Functions',
                'Chapter 2: Inverse Trigonometric Functions',
                'Chapter 3: Matrices',
                'Chapter 4: Determinants',
                'Chapter 5: Continuity and Differentiability',
                'Chapter 6: Application of Derivatives',
                'Chapter 7: Integrals'
            ]
        },
        { 
            subject: 'Biology', 
            chapters: [
                'Chapter 1: Sexual Reproduction in Flowering Plants',
                'Chapter 2: Human Reproduction',
                'Chapter 3: Reproductive Health',
                'Chapter 4: Principles of Inheritance and Variation',
                'Chapter 5: Molecular Basis of Inheritance'
            ]
        }
    ],
    '11': [
        {
            subject: 'Physics',
            chapters: [
                'Chapter 1: Units and Measurements',
                'Chapter 2: Motion in a Straight Line',
                'Chapter 3: Motion in a Plane',
                'Chapter 4: Laws of Motion',
                'Chapter 5: Work, Energy and Power',
                'Chapter 6: System of Particles and Rotational Motion',
                'Chapter 7: Gravitation',
                'Chapter 8: Mechanical Properties of Solids'
            ]
        },
        {
            subject: 'Chemistry',
            chapters: [
                'Chapter 1: Some Basic Concepts of Chemistry',
                'Chapter 2: Structure of Atom',
                'Chapter 3: Classification of Elements and Periodicity',
                'Chapter 4: Chemical Bonding and Molecular Structure',
                'Chapter 5: Thermodynamics',
                'Chapter 6: Equilibrium'
            ]
        },
        {
            subject: 'Mathematics',
            chapters: [
                'Chapter 1: Sets',
                'Chapter 2: Relations and Functions',
                'Chapter 3: Trigonometric Functions',
                'Chapter 4: Complex Numbers and Quadratic Equations',
                'Chapter 5: Linear Inequalities',
                'Chapter 6: Permutations and Combinations',
                'Chapter 7: Binomial Theorem'
            ]
        },
        {
            subject: 'Biology',
            chapters: [
                'Chapter 1: The Living World',
                'Chapter 2: Biological Classification',
                'Chapter 3: Plant Kingdom',
                'Chapter 4: Animal Kingdom',
                'Chapter 5: Morphology of Flowering Plants'
            ]
        }
    ],
    '10': [
         { 
            subject: 'Mathematics', 
            chapters: [
                'Chapter 1: Real Numbers',
                'Chapter 2: Polynomials',
                'Chapter 3: Pair of Linear Equations in Two Variables',
                'Chapter 4: Quadratic Equations',
                'Chapter 5: Arithmetic Progressions',
                'Chapter 6: Triangles',
                'Chapter 7: Coordinate Geometry',
                'Chapter 8: Introduction to Trigonometry'
            ]
        },
        { 
            subject: 'Science', 
            chapters: [
                'Chapter 1: Chemical Reactions and Equations',
                'Chapter 2: Acids, Bases and Salts',
                'Chapter 3: Metals and Non-metals',
                'Chapter 4: Carbon and its Compounds',
                'Chapter 5: Life Processes',
                'Chapter 6: Control and Coordination',
                'Chapter 7: How do Organisms Reproduce?'
            ]
        },
        { 
            subject: 'Social Science', 
            chapters: [
                'History - Chapter 1: The Rise of Nationalism in Europe',
                'History - Chapter 2: Nationalism in India',
                'Geography - Chapter 1: Resources and Development',
                'Geography - Chapter 2: Forest and Wildlife Resources',
                'Civics - Chapter 1: Power Sharing',
                'Economics - Chapter 1: Development'
            ]
        },
        {
            subject: 'English',
            chapters: [
                'A Letter to God',
                'Nelson Mandela: Long Walk to Freedom',
                'Two Stories about Flying',
                'From the Diary of Anne Frank',
                'The Hundred Dresses - I'
            ]
        }
    ],
    '9': [
        {
            subject: 'Mathematics',
            chapters: [
                'Chapter 1: Number Systems',
                'Chapter 2: Polynomials',
                'Chapter 3: Coordinate Geometry',
                'Chapter 4: Linear Equations in Two Variables',
                'Chapter 5: Introduction to Euclids Geometry',
                'Chapter 6: Lines and Angles'
            ]
        },
        {
            subject: 'Science',
            chapters: [
                'Chapter 1: Matter in Our Surroundings',
                'Chapter 2: Is Matter Around Us Pure',
                'Chapter 3: Atoms and Molecules',
                'Chapter 4: Structure of the Atom',
                'Chapter 5: The Fundamental Unit of Life'
            ]
        },
        {
            subject: 'Social Science',
            chapters: [
                'History - The French Revolution',
                'History - Socialism in Europe and the Russian Revolution',
                'Geography - India – Size and Location',
                'Geography - Physical Features of India',
                'Civics - What is Democracy? Why Democracy?'
            ]
        }
    ],
    '8': [
        {
            subject: 'Mathematics',
            chapters: ['Rational Numbers', 'Linear Equations in One Variable', 'Understanding Quadrilaterals', 'Data Handling', 'Squares and Square Roots']
        },
        {
            subject: 'Science',
            chapters: ['Crop Production and Management', 'Microorganisms: Friend and Foe', 'Synthetic Fibres and Plastics', 'Materials: Metals and Non-Metals', 'Coal and Petroleum']
        },
        {
            subject: 'Social Science',
            chapters: ['History - How, When and Where', 'History - From Trade to Territory', 'Geography - Resources', 'Geography - Land, Soil, Water', 'Civics - The Indian Constitution']
        },
        { subject: 'English', chapters: ['The Best Christmas Present in the World', 'The Tsunami', 'Glimpses of the Past'] },
        { subject: 'Hindi', chapters: ['Dhwan', 'Laakh Ki Chudiyan', 'Bus Ki Yatra'] }
    ],
    '7': [
        {
            subject: 'Mathematics',
            chapters: ['Integers', 'Fractions and Decimals', 'Data Handling', 'Simple Equations', 'Lines and Angles']
        },
        {
            subject: 'Science',
            chapters: ['Nutrition in Plants', 'Nutrition in Animals', 'Fibre to Fabric', 'Heat', 'Acids, Bases and Salts']
        },
        {
            subject: 'Social Science',
            chapters: ['History - Tracing Changes Through A Thousand Years', 'Geography - Environment', 'Civics - On Equality']
        },
        { subject: 'English', chapters: ['Three Questions', 'A Gift of Chappals', 'Gopal and the Hilsa Fish'] },
        { subject: 'Hindi', chapters: ['Hum Panchhi Unmukt Gagan Ke', 'Dadi Maa', 'Himalaya Ki Betiyan'] }
    ],
    '6': [
        {
            subject: 'Mathematics',
            chapters: ['Knowing Our Numbers', 'Whole Numbers', 'Playing with Numbers', 'Basic Geometrical Ideas', 'Understanding Elementary Shapes']
        },
        {
            subject: 'Science',
            chapters: ['Food: Where Does It Come From?', 'Components of Food', 'Fibre to Fabric', 'Sorting Materials into Groups', 'Separation of Substances']
        },
        {
            subject: 'Social Science',
            chapters: ['History - What, Where, How and When?', 'Geography - The Earth in the Solar System', 'Civics - Understanding Diversity']
        },
        { subject: 'English', chapters: ['Who Did Patrick’s Homework?', 'How the Dog Found Himself a New Master!', 'Taro’s Reward'] },
        { subject: 'Hindi', chapters: ['Woh Chidiya Jo', 'Bachpan', 'Nadan Dost'] }
    ],
    '5': [
        {
            subject: 'Mathematics (Math Magic)',
            chapters: ['The Fish Tale', 'Shapes and Angles', 'How Many Squares?', 'Parts and Wholes', 'Does it Look the Same?']
        },
        {
            subject: 'EVS (Looking Around)',
            chapters: ['Super Senses', 'A Snake Charmers Story', 'From Tasting to Digesting', 'Mangoes Round the Year', 'Seeds and Seeds']
        },
        {
            subject: 'English (Marigold)',
            chapters: ['Ice-cream Man', 'Wonderful Waste!', 'Teamwork', 'Flying Together', 'My Shadow']
        },
        { subject: 'Hindi (Rimjhim)', chapters: ['Rakh Ki Rassi', 'Faslon Ke Tyohar', 'Khilonewala'] }
    ],
    '4': [
        {
            subject: 'Mathematics (Math Magic)',
            chapters: ['Building with Bricks', 'Long and Short', 'A Trip to Bhopal', 'Tick-Tick-Tick', 'The Way The World Looks']
        },
        {
            subject: 'EVS (Looking Around)',
            chapters: ['Going to School', 'Ear to Ear', 'A Day with Nandu', 'The Story of Amrita', 'Anita and the Honeybees']
        },
        {
            subject: 'English (Marigold)',
            chapters: ['Wake Up!', 'Neha’s Alarm Clock', 'Noses', 'The Little Fir Tree']
        },
        { subject: 'Hindi (Rimjhim)', chapters: ['Mann Ke Bhole Bhale Badal', 'Jaisa Sawal Waisa Jawab', 'Kirmich Ki Gend'] }
    ],
    '3': [
        {
            subject: 'Mathematics (Math Magic)',
            chapters: ['Where to Look From', 'Fun with Numbers', 'Give and Take', 'Long and Short', 'Shapes and Designs']
        },
        {
            subject: 'EVS (Looking Around)',
            chapters: ['Poonam’s Day Out', 'The Plant Fairy', 'Water O’ Water!', 'Our First School', 'Chhotu’s House']
        },
        {
            subject: 'English (Marigold)',
            chapters: ['Good Morning', 'The Magic Garden', 'Bird Talk', 'Nina and the Baby Sparrows']
        },
        { subject: 'Hindi (Rimjhim)', chapters: ['Kakku', 'ShekhiBaaz Makkhi', 'Chaand Wali Amma'] }
    ],
    '2': [
        {
            subject: 'Mathematics (Joyful Mathematics)',
            chapters: ['What is Long, What is Round?', 'Counting in Groups', 'How Much Can You Carry?', 'Counting in Tens', 'Patterns']
        },
        {
            subject: 'English (Mridang)',
            chapters: ['First Day at School', 'Haldis Adventure', 'I am Lucky!', 'I Want']
        },
        {
            subject: 'Hindi (Sarangi)',
            chapters: ['Oont Chala', 'Bhalu Ne Kheli Football', 'Myaun, Myaun!!', 'Adhik Balwan Kaun?']
        }
    ],
    '1': [
        {
            subject: 'English (Mridang)',
            chapters: [
                'Unit 1: My Family and Me',
                'Unit 2: Life Around Us',
                'Unit 3: Food',
                'Unit 4: Seasons'
            ]
        },
        {
            subject: 'Mathematics (Joyful Mathematics)',
            chapters: [
                'Chapter 1: Finding the Furry Cat!',
                'Chapter 2: What is Long? What is Round?',
                'Chapter 3: Mango Treat',
                'Chapter 4: Making 10',
                'Chapter 5: How Many?',
                'Chapter 6: Vegetable Farm',
                'Chapter 7: Lina’s Family',
                'Chapter 8: Fun with Numbers',
                'Chapter 9: Utsav',
                'Chapter 10: How do I Spend my Day?',
                'Chapter 11: How Many Times?',
                'Chapter 12: Money',
                'Chapter 13: So Many Toys'
            ]
        },
        {
            subject: 'Hindi (Sarangi)',
            chapters: [
                'Unit 1: Parivaar',
                'Unit 2: Jagat',
                'Unit 3: Hamara Khan-Paan',
                'Unit 4: Tyohar aur Mele',
                'Unit 5: Hare-Bhare Jungle'
            ]
        }
    ]
};