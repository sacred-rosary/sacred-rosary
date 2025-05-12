// Sacred Rosary - Main Configuration
const ROSARY_CONFIG = {
    // App Information
    appName: "The Sacred Rosary",
    appVersion: "1.1.13",
    
    // Visual Theme
    theme: {
        // Base Colors (Default theme)
        primaryColor: "#8B6C42",       // Rich light brown
        secondaryColor: "#5D4B35",     // Darker brown
        accentColor: "#D2B48C",        // Tan
        textColor: "#F5EFE0",          // Antique white
        backgroundColor: "#1A150F",    // Very dark brown
        overlayColor: "rgba(26, 21, 15, 0.85)", // Dark brown with transparency
        borderColor: "rgba(210, 180, 140, 0.3)", // Tan with transparency
        shadowColor: "rgba(0, 0, 0, 0.6)",
        glowColor: "rgba(255, 200, 100, 0.4)", // Candlelight glow
        
        // Theme presets
        presets: {
            default: {
                primaryColor: "#8B6C42",
                secondaryColor: "#5D4B35",
                accentColor: "#D2B48C",
                textColor: "#F5EFE0",
                backgroundColor: "#1A150F",
                overlayColor: "rgba(26, 21, 15, 0.85)",
                borderColor: "rgba(210, 180, 140, 0.3)",
                shadowColor: "rgba(0, 0, 0, 0.6)",
                glowColor: "rgba(255, 200, 100, 0.4)"
            },
            dark: {
                primaryColor: "#5D5D8D",
                secondaryColor: "#30305D",
                accentColor: "#9D9DCD",
                textColor: "#F5F5FF",
                backgroundColor: "#1A1A2F",
                overlayColor: "rgba(26, 26, 47, 0.85)",
                borderColor: "rgba(157, 157, 205, 0.3)",
                shadowColor: "rgba(0, 0, 0, 0.6)",
                glowColor: "rgba(157, 157, 255, 0.3)"
            },
            light: {
                primaryColor: "#8D785D",
                secondaryColor: "#5D4E30",
                accentColor: "#D3B88C",
                textColor: "#1A1A1A",
                backgroundColor: "#F5F5F0",
                overlayColor: "rgba(245, 245, 240, 0.85)",
                borderColor: "rgba(141, 120, 93, 0.3)",
                shadowColor: "rgba(0, 0, 0, 0.2)",
                glowColor: "rgba(211, 184, 140, 0.4)"
            },
            sepia: {
                primaryColor: "#8D5D3B",
                secondaryColor: "#5D3D20",
                accentColor: "#D38D58",
                textColor: "#33200D",
                backgroundColor: "#F5E8D8",
                overlayColor: "rgba(245, 232, 216, 0.85)",
                borderColor: "rgba(141, 93, 59, 0.3)",
                shadowColor: "rgba(0, 0, 0, 0.2)",
                glowColor: "rgba(211, 141, 88, 0.4)"
            },
            mourning: {
                primaryColor: "#4a4a4a",
                secondaryColor: "#333333",
                accentColor: "#999999",
                textColor: "#f5f5f5",
                backgroundColor: "#000000",
                overlayColor: "rgba(0, 0, 0, 0.9)",
                borderColor: "rgba(100, 100, 100, 0.3)",
                shadowColor: "rgba(0, 0, 0, 0.8)",
                glowColor: "rgba(150, 150, 150, 0.3)"
            }
        },
        
        // Animation Settings
        animations: {
            enabled: true,
            transitionSpeed: 800, // ms
            candleFlickerSpeed: 8, // seconds
        },
        
        // Background Settings
        backgroundParticlesCount: 30, // Dust particles
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
        autoAdvanceDelay: 1000, // ms to wait after audio finishes before advancing
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
    
    // Display Settings
    display: {
        theme: "default",
    },
    
    // Admin Settings - The site owner can edit these values directly in this file
    admin: {
        // Mourning Mode Settings
        mourning: {
            enabled: false,              // Set to true to enable mourning mode site-wide
            message: "We are in a month of mourning for Pope Francis. Please pray for the repose of his soul.",  // Change to your specific message
            startDate: "2025-04-21",     // Format: YYYY-MM-DD (when mourning begins)
            endDate: "2025-05-21",       // Format: YYYY-MM-DD (when mourning ends)
            overrideUserTheme: true,     // If true, forces black theme even if user selected another theme
            showBanner: true             // Whether to show the announcement banner
        },
        
        // Site Version - Increment this to force cache refresh
        version: "1.1.13",
        
        // Site Messages - Announcements that will show to all users
        announcements: [
            // Uncomment and edit to show an announcement
             {
                 enabled: true,
                 title: "Site Maintenance",
                 message: "The Sacred Rosary will be undergoing maintenance on May 15.",
                 startDate: "2025-05-10",
                 endDate: "2025-05-14"
             }
        ]
    }
};
