// Tech stack icons mapping
const techIcons = {
    'PHP': 'fab fa-php',
    'MySQL': 'fas fa-database',
    'HTML': 'fab fa-html5',
    'CSS': 'fab fa-css3-alt',
    'JavaScript': 'fab fa-js-square',
    'React': 'fab fa-react',
    'Node.js': 'fab fa-node-js',
    'MongoDB': 'fas fa-leaf',
    'Express': 'fas fa-server',
    'Python': 'fab fa-python',
    'Machine Learning': 'fas fa-brain',
    'Flask': 'fas fa-flask',
    'Scikit-learn': 'fas fa-chart-line',
    'Arduino': 'fas fa-microchip',
    'ESP32': 'fas fa-wifi',
    'Sensors': 'fas fa-satellite-dish',
    'Mobile App': 'fas fa-mobile-alt',
    'Raspberry Pi': 'fas fa-raspberry-pi',
    'OpenCV': 'fas fa-eye',
    'TensorFlow': 'fas fa-network-wired',
    'NLTK': 'fas fa-language'
};

// Get tech icon
function getTechIcon(tech) {
    return techIcons[tech] || 'fas fa-code';
}

// Project Data
const projects = [
    {
        id: "PROJ001",
        title: "Online Voting System",
        category: "Software",
        stack: ["PHP", "MySQL", "HTML", "CSS"],
        price: 3499,
        shortDesc: "Secure online voting platform with OTP verification and admin panel.",
        desc: "A comprehensive online voting system designed for secure and transparent elections. Features include voter registration, OTP-based authentication, real-time vote counting, candidate management, and detailed reporting. The system ensures data integrity and prevents duplicate voting through advanced security measures.",
        wa: "919876543210"
    },
    {
        id: "PROJ002",
        title: "Smart Home Automation",
        category: "IoT",
        stack: ["Arduino", "ESP32", "Sensors", "Mobile App"],
        price: 2499,
        shortDesc: "IoT-based home automation system with smartphone control.",
        desc: "Complete home automation solution enabling remote control of household appliances through a mobile application. Includes temperature and humidity monitoring, motion detection, automated lighting, security alerts, and energy consumption tracking. The system provides real-time notifications and scheduling capabilities.",
        wa: "919876543210"
    },
    {
        id: "PROJ003",
        title: "Disease Prediction System",
        category: "AIML",
        stack: ["Python", "Machine Learning", "Flask", "Scikit-learn"],
        price: 1999,
        shortDesc: "AI-powered disease prediction using machine learning algorithms.",
        desc: "An intelligent healthcare system that predicts potential diseases based on patient symptoms using advanced machine learning algorithms. The system includes data preprocessing, feature selection, model training with multiple algorithms, and a user-friendly web interface for healthcare professionals.",
        wa: "919876543210"
    },
    {
        id: "PROJ004",
        title: "E-Commerce Platform",
        category: "Software",
        stack: ["React", "Node.js", "MongoDB", "Express"],
        price: 2199,
        shortDesc: "Full-stack e-commerce solution with payment integration.",
        desc: "A complete e-commerce platform built with modern web technologies. Features include user authentication, product catalog, shopping cart, order processing, payment gateway integration, inventory management, and comprehensive admin dashboard. Responsive design ensures optimal user experience across all devices.",
        wa: "919876543210"
    },
    {
        id: "PROJ005",
        title: "Traffic Management System",
        category: "IoT",
        stack: ["Raspberry Pi", "OpenCV", "Python", "Sensors"],
        price: 2799,
        shortDesc: "Intelligent traffic control system using computer vision.",
        desc: "Smart traffic management solution that uses computer vision to analyze traffic density and automatically optimize signal timing. The system includes vehicle detection, emergency vehicle prioritization, traffic flow analysis, and real-time monitoring dashboard for traffic authorities.",
        wa: "919876543210"
    },
    {
        id: "PROJ006",
        title: "NLP Chatbot System",
        category: "AIML",
        stack: ["Python", "NLTK", "TensorFlow", "Flask"],
        price: 1799,
        shortDesc: "Advanced chatbot with natural language processing.",
        desc: "Sophisticated chatbot system powered by natural language processing and machine learning. Features include intent recognition, entity extraction, context management, sentiment analysis, and multi-turn conversation handling. The system can be integrated into websites and mobile applications.",
        wa: "919876543210"
    }
];