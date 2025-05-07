// Sacred Rosary - Main Configuration
const ROSARY_CONFIG = {
    // App Information
    appName: "The Sacred Rosary",
    appVersion: "1.0.0",
    
    // Visual Theme
    theme: {
        // Base Colors
        primaryColor: "#8B6C42",       // Rich light brown
        secondaryColor: "#5D4B35",     // Darker brown
        accentColor: "#D2B48C",        // Tan
        textColor: "#F5EFE0",          // Antique white
        backgroundColor: "#1A150F",    // Very dark brown
        overlayColor: "rgba(26, 21, 15, 0.85)", // Dark brown with transparency
        borderColor: "rgba(210, 180, 140, 0.3)", // Tan with transparency
        shadowColor: "rgba(0, 0, 0, 0.6)",
        glowColor: "rgba(255, 200, 100, 0.4)", // Candlelight glow
        
        // Liturgical Season Colors (you can customize per season)
        liturgicalColors: {
            ordinary: {
                primaryColor: "#8B6C42",
                secondaryColor: "#5D4B35",
                accentColor: "#D2B48C", 
            },
            advent: {
                primaryColor: "#614B6C", // Purple-brown
                secondaryColor: "#483953",
                accentColor: "#C9A7DB", 
            },
            christmas: {
                primaryColor: "#B39247", // Gold-brown
                secondaryColor: "#7A6331",
                accentColor: "#F5E7C1",
            },
            lent: {
                primaryColor: "#6C3B5D", // Purple-red
                secondaryColor: "#49293F",
                accentColor: "#DBA7C9",
            },
            easter: {
                primaryColor: "#B3A247", // Gold
                secondaryColor: "#8C7E38",
                accentColor: "#F5F1C1",
            },
            feast: {
                primaryColor: "#8C4635", // Red-brown
                secondaryColor: "#6B2E26",
                accentColor: "#F0B7B7",
            }
        },
        
        // Animation Settings
        animations: {
            enabled: true,
            transitionSpeed: 800, // ms
            candleFlickerSpeed: 8, // seconds
            modelMovementAmount: 0.3, // how much the model moves
            modelMovementSpeed: 10 // seconds for full movement cycle
        },
        
        // Background Settings
        backgroundParticlesCount: 30, // Dust particles
    },
    
    // 3D Model Settings
    model: {
        // Change this URL to your GitHub-hosted model
        url: "https://raw.githubusercontent.com/sacred-rosary/sacred-rosary/main/assets/models/rosary.glb",
        scale: 1.0,
        autoRotate: false, // Set to false as requested
        rotationSpeed: 0.001, // Very slow for subtle movement
        ambient: {
            intensity: 0.7,
            color: "#FFF0D9" // Warm light
        },
        candle: {
            intensity: 1.2,
            color: "#FFCC88" // Candle light
        },
        shadow: true,
    },
    
    // Audio Settings
    audio: {
        backgroundMusic: {
            enabled: true,
            volume: 0.3,
            src: "assets/audio/background_piano.mp3"
        },
        prayerAudio: {
            enabled: true,
            volume: 0.7
        },
        effects: {
            enabled: true,
            volume: 0.5
        }
    },
    
    // Prayer Settings
    prayer: {
        autoAdvanceDelay: 1000, // ms to wait after audio finishes
        meditationDurations: {
            none: 0,
            short: 5000,
            medium: 10000,
            long: 15000
        },
        defaultMeditationDuration: "short",
        showScripture: true
    },
    
    // Language Settings
    language: {
        default: "en",
        available: [
            {code: "en", name: "English", enabled: true},
            {code: "es", name: "Español", enabled: true},
            {code: "la", name: "Latin", enabled: false, comingSoon: true}
        ]
    },
    
    // Liturgical Calendar Settings
    liturgicalCalendar: {
        // Format: month-day: season
        // 0 = Ordinary Time (green/brown)
        // 1 = Advent (purple)
        // 2 = Christmas (white/gold)
        // 3 = Lent (purple)
        // 4 = Easter (white/gold)
        // 5 = Feast days (red)
        
        // This is a simplified calendar - in a full app you'd want to
        // calculate these dates based on the current year
        
        // Advent (approximate - 4 Sundays before Christmas)
        "11-27": 1, "11-28": 1, "11-29": 1, "11-30": 1,
        "12-1": 1, "12-2": 1, "12-3": 1, "12-4": 1, "12-5": 1, "12-6": 1, "12-7": 1,
        "12-8": 1, "12-9": 1, "12-10": 1, "12-11": 1, "12-12": 1, "12-13": 1, "12-14": 1,
        "12-15": 1, "12-16": 1, "12-17": 1, "12-18": 1, "12-19": 1, "12-20": 1, "12-21": 1,
        "12-22": 1, "12-23": 1, "12-24": 1,
        
        // Christmas
        "12-25": 2, "12-26": 2, "12-27": 2, "12-28": 2, "12-29": 2, "12-30": 2, "12-31": 2,
        "1-1": 2, "1-2": 2, "1-3": 2, "1-4": 2, "1-5": 2, "1-6": 2, "1-7": 2, "1-8": 2, "1-9": 2,
        
        // Ash Wednesday and Lent (approximate - would need adjustment yearly)
        "2-17": 3, "2-18": 3, "2-19": 3, "2-20": 3, "2-21": 3, "2-22": 3, "2-23": 3,
        "2-24": 3, "2-25": 3, "2-26": 3, "2-27": 3, "2-28": 3, "2-29": 3, "3-1": 3,
        "3-2": 3, "3-3": 3, "3-4": 3, "3-5": 3, "3-6": 3, "3-7": 3, "3-8": 3,
        "3-9": 3, "3-10": 3, "3-11": 3, "3-12": 3, "3-13": 3, "3-14": 3, "3-15": 3,
        "3-16": 3, "3-17": 3, "3-18": 3, "3-19": 3, "3-20": 3, "3-21": 3, "3-22": 3,
        "3-23": 3, "3-24": 3, "3-25": 3, "3-26": 3, "3-27": 3, "3-28": 3, "3-29": 3,
        "3-30": 3, "3-31": 3, "4-1": 3, "4-2": 3,
        
        // Easter (approximate - would need adjustment yearly)
        "4-3": 4, "4-4": 4, "4-5": 4, "4-6": 4, "4-7": 4, "4-8": 4, "4-9": 4,
        "4-10": 4, "4-11": 4, "4-12": 4, "4-13": 4, "4-14": 4, "4-15": 4, "4-16": 4,
        "4-17": 4, "4-18": 4, "4-19": 4, "4-20": 4, "4-21": 4, "4-22": 4, "4-23": 4,
        
        // Some major feast days
        "3-19": 5, // St. Joseph
        "6-29": 5, // Sts. Peter and Paul
        "8-15": 5, // Assumption
        "11-1": 5, // All Saints
    }
};
