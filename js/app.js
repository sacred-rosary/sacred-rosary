// Sacred Rosary - Main Application
document.addEventListener('DOMContentLoaded', function() {
    // Main application object
    const SacredRosary = {
        // Configuration (loaded from config.js)
        config: ROSARY_CONFIG,
        
        // Application state
        state: {
            currentPrayerIndex: 0,
            currentMysteryType: 'joyful',
            isPlaying: true, // Start playing automatically
            isAutoAdvanceEnabled: true, // Auto-advance enabled by default
            isAppInitialized: false,
            activeLanguage: 'en',
            loadingProgress: 0,
            prayerData: null, // Will hold the active language prayer data
            mysteryData: null, // Will hold the active language mystery data
            rosarySequence: [], // Will hold the current rosary sequence
            totalPrayers: 0,    // Total number of prayers in the sequence
            settingsVisible: false, // Settings panel visibility
        },
        
        // DOM Elements
        elements: {},
        
        // Audio objects
        audio: {
            backgroundMusic: null,
            prayerAudio: null,
            effects: {},
        },
        
        // Initialize the application
        init: function() {
            console.log("Initializing Sacred Rosary Application");
            
            // Register DOM elements
            this.registerDOMElements();
            
            // Load user settings
            this.loadUserSettings();
            
            // Check for mourning period
            this.checkMourningPeriod();
            
            // Apply theme based on settings
            this.applyTheme(this.config.display.theme);
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Set font size
            this.applyFontSize(this.config.display.fontSize);
            
            // Set up all language translations
            this.setLanguage(this.config.language.default);
            
            // Start loading assets
            this.loadAssets();
            
            // Make the object available globally for debugging
            window.SacredRosary = this;
        },
        
        // Register DOM elements
        registerDOMElements: function() {
            try {
                // Main sections
                this.elements.appContainer = document.querySelector('.app-container');
                this.elements.loadingOverlay = document.querySelector('.loading-overlay');
                this.elements.loadingBar = document.querySelector('.loading-bar');
                this.elements.landingPage = document.querySelector('.landing-page');
                this.elements.mainContent = document.querySelector('.main-content');
                this.elements.prayerSection = document.querySelector('.prayer-section');
                this.elements.visualSection = document.querySelector('.visual-section');
                
                // Background effects
                this.elements.backgroundEffects = document.querySelector('.background-effects');
                this.elements.candleOverlay = document.querySelector('.candle-overlay');
                this.elements.lightRays = document.querySelector('.light-rays');
                this.elements.particlesContainer = document.querySelector('.particles-container');
                
                // Prayer elements
                this.elements.prayerScroll = document.querySelector('.prayer-scroll');
                this.elements.prayerTitle = document.querySelector('.prayer-title');
                this.elements.prayerInstructions = document.querySelector('.prayer-instructions');
                this.elements.prayerText = document.querySelector('.prayer-text');
                this.elements.progressTitle = document.querySelector('.progress-title');
                
                // New progress elements
                this.elements.progressBar = document.querySelector('.progress-fill');
                this.elements.progressText = document.querySelector('.progress-text');
                this.elements.currentPrayerType = document.querySelector('.current-prayer-type');
                this.elements.prayerIcon = document.querySelector('.prayer-icon');
                this.elements.prayerName = document.querySelector('.prayer-name');
                
                // Controls
                this.elements.prayerControls = document.querySelector('.prayer-controls');
                this.elements.prevBtn = document.querySelector('.prev-btn');
                this.elements.playBtn = document.querySelector('.play-btn');
                this.elements.nextBtn = document.querySelector('.next-btn');
                
                // Mystery info
                this.elements.mysteryInfo = document.querySelector('.mystery-info');
                
                // Landing page elements
                this.elements.languageBtns = document.querySelectorAll('.language-btn');
                this.elements.mysteryBtns = document.querySelectorAll('.mystery-btn');
                this.elements.startBtn = document.querySelector('.start-btn');
                
                // Notification
                this.elements.notification = document.querySelector('.notification');
                this.elements.notificationTitle = document.querySelector('.notification-title');
                this.elements.notificationMessage = document.querySelector('.notification-message');
                this.elements.notificationClose = document.querySelector('.notification-close');
                
                // Settings elements
                this.elements.settingsPanel = document.getElementById('settings-panel');
                this.elements.settingsToggleBtn = document.getElementById('settings-toggle-btn');
                this.elements.prayerSettingsBtn = document.getElementById('prayer-settings-btn');
                this.elements.settingsCloseBtn = document.getElementById('settings-close-btn');
                this.elements.settingsSaveBtn = document.getElementById('settings-save-btn');
                this.elements.settingsResetBtn = document.getElementById('settings-reset-btn');
                
                // Settings inputs
                this.elements.themeSelect = document.getElementById('theme-select');
                this.elements.fontSizeRange = document.getElementById('font-size');
                this.elements.fontSizeValue = document.getElementById('font-size-value');
                this.elements.bgMusicToggle = document.getElementById('bg-music-toggle');
                this.elements.bgMusicVolume = document.getElementById('bg-music-volume');
                this.elements.bgMusicVolumeValue = document.getElementById('bg-music-volume-value');
                this.elements.effectsToggle = document.getElementById('effects-toggle');
                this.elements.autoAdvanceToggle = document.getElementById('auto-advance-toggle');
                this.elements.meditationDuration = document.getElementById('meditation-duration');
                
                // Mourning elements
                this.elements.mourningToggle = document.getElementById('mourning-toggle');
                this.elements.mourningDetails = document.querySelector('.mourning-details');
                this.elements.mourningMessage = document.getElementById('mourning-message-input');
                this.elements.mourningStartDate = document.getElementById('mourning-start-date');
                this.elements.mourningEndDate = document.getElementById('mourning-end-date');
                this.elements.mourningAnnouncement = document.getElementById('mourning-announcement');
                this.elements.mourningCloseBtn = document.getElementById('mourning-close-btn');
            } catch (error) {
                console.error('Error registering DOM elements:', error);
            }
        },
        
        // Apply theme
        applyTheme: function(themeName) {
            if (!themeName) themeName = 'default';
            
            const root = document.documentElement;
            const body = document.body;
            
            // Remove any existing theme classes
            body.classList.remove('theme-default', 'theme-dark', 'theme-light', 'theme-sepia', 'theme-mourning');
            
            // Add the new theme class
            body.classList.add(`theme-${themeName}`);
            
            // Get theme colors
            const theme = this.config.theme.presets[themeName] || this.config.theme.presets.default;
            
            // Set CSS variables
            root.style.setProperty('--primary-color', theme.primaryColor);
            root.style.setProperty('--secondary-color', theme.secondaryColor);
            root.style.setProperty('--accent-color', theme.accentColor);
            root.style.setProperty('--text-color', theme.textColor);
            root.style.setProperty('--background-color', theme.backgroundColor);
            root.style.setProperty('--overlay-color', theme.overlayColor);
            root.style.setProperty('--border-color', theme.borderColor);
            root.style.setProperty('--shadow-color', theme.shadowColor);
            root.style.setProperty('--glow-color', theme.glowColor);
            
            // Set animation speeds
            root.style.setProperty('--transition-slow', `${this.config.theme.animations.transitionSpeed}ms`);
            root.style.setProperty('--transition-medium', `${this.config.theme.animations.transitionSpeed * 0.6}ms`);
            root.style.setProperty('--transition-fast', `${this.config.theme.animations.transitionSpeed * 0.3}ms`);
            
            // Update settings select if it exists
            if (this.elements.themeSelect) {
                this.elements.themeSelect.value = themeName;
            }
            
            // Save the current theme
            this.config.display.theme = themeName;
        },
        
        // Apply font size
        applyFontSize: function(size) {
            if (!size) size = 100;
            
            document.body.style.fontSize = `${size}%`;
            
            // Update range input if it exists
            if (this.elements.fontSizeRange) {
                this.elements.fontSizeRange.value = size;
                this.elements.fontSizeValue.textContent = `${size}%`;
            }
            
            // Save the current font size
            this.config.display.fontSize = size;
        },
        
        // Set up event listeners
        setupEventListeners: function() {
            const self = this;
            
            // Language selection
            this.elements.languageBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    if (this.classList.contains('disabled')) return;
                    
                    self.elements.languageBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    self.setLanguage(this.dataset.language);
                });
            });
            
            // Mystery selection
            this.elements.mysteryBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    self.elements.mysteryBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    self.state.currentMysteryType = this.dataset.mystery;
                });
            });
            
            // Start button
            this.elements.startBtn.addEventListener('click', function() {
                self.startRosary();
            });
            
            // Prayer navigation buttons
            this.elements.prevBtn.addEventListener('click', function() {
                self.prevPrayer();
            });
            
            this.elements.nextBtn.addEventListener('click', function() {
                self.nextPrayer();
            });
            
            this.elements.playBtn.addEventListener('click', function() {
                self.togglePlay();
            });
            
            // Notification close button
            this.elements.notificationClose.addEventListener('click', function() {
                self.hideNotification();
            });
            
            // Settings toggle buttons
            if (this.elements.settingsToggleBtn) {
                this.elements.settingsToggleBtn.addEventListener('click', function() {
                    self.toggleSettings();
                });
            }
            
            if (this.elements.prayerSettingsBtn) {
                this.elements.prayerSettingsBtn.addEventListener('click', function() {
                    self.toggleSettings();
                });
            }
            
            // Settings close button
            if (this.elements.settingsCloseBtn) {
                this.elements.settingsCloseBtn.addEventListener('click', function() {
                    self.toggleSettings(false);
                });
            }
            
            // Settings save button
            if (this.elements.settingsSaveBtn) {
                this.elements.settingsSaveBtn.addEventListener('click', function() {
                    self.saveSettings();
                });
            }
            
            // Settings reset button
            if (this.elements.settingsResetBtn) {
                this.elements.settingsResetBtn.addEventListener('click', function() {
                    self.resetSettings();
                });
            }
            
            // Theme select change
            if (this.elements.themeSelect) {
                this.elements.themeSelect.addEventListener('change', function() {
                    self.applyTheme(this.value);
                });
            }
            
            // Font size range change
            if (this.elements.fontSizeRange) {
                this.elements.fontSizeRange.addEventListener('input', function() {
                    self.applyFontSize(this.value);
                });
            }
            
            // Background music toggle
            if (this.elements.bgMusicToggle) {
                this.elements.bgMusicToggle.addEventListener('change', function() {
                    self.config.audio.backgroundMusic.enabled = this.checked;
                    if (this.checked) {
                        if (self.audio.backgroundMusic) self.audio.backgroundMusic.play();
                    } else {
                        if (self.audio.backgroundMusic) self.audio.backgroundMusic.pause();
                    }
                });
            }
            
            // Background music volume
            if (this.elements.bgMusicVolume) {
                this.elements.bgMusicVolume.addEventListener('input', function() {
                    const volume = this.value / 100;
                    self.config.audio.backgroundMusic.volume = volume;
                    if (self.audio.backgroundMusic) self.audio.backgroundMusic.volume(volume);
                    self.elements.bgMusicVolumeValue.textContent = `${this.value}%`;
                });
            }
            
            // Effects toggle
            if (this.elements.effectsToggle) {
                this.elements.effectsToggle.addEventListener('change', function() {
                    self.config.audio.effects.enabled = this.checked;
                });
            }
            
            // Auto-advance toggle
            if (this.elements.autoAdvanceToggle) {
                this.elements.autoAdvanceToggle.addEventListener('change', function() {
                    self.config.prayer.autoAdvance = this.checked;
                    self.state.isAutoAdvanceEnabled = this.checked;
                });
            }
            
            // Meditation duration change
            if (this.elements.meditationDuration) {
                this.elements.meditationDuration.addEventListener('change', function() {
                    self.config.prayer.defaultMeditationDuration = this.value;
                });
            }
            
            // Mourning toggle
            if (this.elements.mourningToggle) {
                this.elements.mourningToggle.addEventListener('change', function() {
                    self.elements.mourningDetails.style.display = this.checked ? 'block' : 'none';
                    self.config.mourning.enabled = this.checked;
                    
                    if (this.checked) {
                        self.applyTheme('mourning');
                    } else {
                        self.applyTheme(self.config.display.theme);
                    }
                });
            }
            
            // Mourning message input
            if (this.elements.mourningMessage) {
                this.elements.mourningMessage.addEventListener('input', function() {
                    self.config.mourning.message = this.value;
                    
                    // Update the announcement if visible
                    const messageElement = document.getElementById('mourning-message');
                    if (messageElement) {
                        messageElement.textContent = this.value;
                    }
                });
            }
            
            // Mourning date inputs
            if (this.elements.mourningStartDate) {
                this.elements.mourningStartDate.addEventListener('change', function() {
                    self.config.mourning.startDate = this.value;
                    self.checkMourningPeriod();
                });
            }
            
            if (this.elements.mourningEndDate) {
                this.elements.mourningEndDate.addEventListener('change', function() {
                    self.config.mourning.endDate = this.value;
                    self.checkMourningPeriod();
                });
            }
            
            // Mourning announcement close button
            if (this.elements.mourningCloseBtn) {
                this.elements.mourningCloseBtn.addEventListener('click', function() {
                    self.elements.mourningAnnouncement.classList.remove('visible');
                });
            }
            
            // Window resize event
            window.addEventListener('resize', function() {
                // Resize handling if needed
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                // Don't handle keyboard when typing in inputs
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                switch (e.key) {
                    case ' ': // Space bar
                        self.togglePlay();
                        e.preventDefault();
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        self.nextPrayer();
                        e.preventDefault();
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        self.prevPrayer();
                        e.preventDefault();
                        break;
                    case 'Escape':
                        if (self.state.settingsVisible) {
                            self.toggleSettings(false);
                            e.preventDefault();
                        }
                        break;
                }
            });
        },
        
        // Toggle settings panel
        toggleSettings: function(show) {
            if (show === undefined) {
                show = !this.state.settingsVisible;
            }
            
            this.state.settingsVisible = show;
            
            if (show) {
                this.elements.settingsPanel.classList.add('visible');
                this.updateSettingsUI();
            } else {
                this.elements.settingsPanel.classList.remove('visible');
            }
        },
        
        // Update settings UI to match current config
        updateSettingsUI: function() {
            // Theme
            this.elements.themeSelect.value = this.config.display.theme;
            
            // Font size
            this.elements.fontSizeRange.value = this.config.display.fontSize;
            this.elements.fontSizeValue.textContent = `${this.config.display.fontSize}%`;
            
            // Background music
            this.elements.bgMusicToggle.checked = this.config.audio.backgroundMusic.enabled;
            
            // Background music volume
            const volumePercent = Math.round(this.config.audio.backgroundMusic.volume * 100);
            this.elements.bgMusicVolume.value = volumePercent;
            this.elements.bgMusicVolumeValue.textContent = `${volumePercent}%`;
            
            // Effects
            this.elements.effectsToggle.checked = this.config.audio.effects.enabled;
            
            // Auto-advance
            this.elements.autoAdvanceToggle.checked = this.config.prayer.autoAdvance;
            
            // Meditation duration
            this.elements.meditationDuration.value = this.config.prayer.defaultMeditationDuration;
            
            // Mourning settings
            this.elements.mourningToggle.checked = this.config.mourning.enabled;
            this.elements.mourningDetails.style.display = this.config.mourning.enabled ? 'block' : 'none';
            this.elements.mourningMessage.value = this.config.mourning.message;
            this.elements.mourningStartDate.value = this.config.mourning.startDate;
            this.elements.mourningEndDate.value = this.config.mourning.endDate;
        },
        
        // Save settings
        saveSettings: function() {
            // Save settings to localStorage
            localStorage.setItem('sacredRosarySettings', JSON.stringify({
                display: this.config.display,
                audio: this.config.audio,
                prayer: {
                    autoAdvance: this.config.prayer.autoAdvance,
                    defaultMeditationDuration: this.config.prayer.defaultMeditationDuration
                },
                mourning: this.config.mourning
            }));
            
            // Show notification
            this.showNotification('Settings Saved', 'Your settings have been saved successfully.');
            
            // Close settings panel
            this.toggleSettings(false);
        },
        
        // Reset settings to default
        resetSettings: function() {
            // Reset config
            this.config.display = {
                theme: 'default',
                fontSize: 100
            };
            
            this.config.audio = {
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
            };
            
            this.config.prayer = {
                autoAdvanceDelay: 1000,
                autoAdvance: true,
                meditationDurations: {
                    none: 0,
                    short: 5000,
                    medium: 10000,
                    long: 15000
                },
                defaultMeditationDuration: "short",
                showScripture: true
            };
            
            this.config.mourning = {
                enabled: false,
                message: "We are in a period of mourning.",
                startDate: "",
                endDate: ""
            };
            
            // Apply reset settings
            this.applyTheme('default');
            this.applyFontSize(100);
            
            // Update state
            this.state.isAutoAdvanceEnabled = true;
            
            // Update settings UI
            this.updateSettingsUI();
            
            // Clear localStorage
            localStorage.removeItem('sacredRosarySettings');
            
            // Show notification
            this.showNotification('Settings Reset', 'Your settings have been reset to default.');
        },
        
        // Load user settings from localStorage
        loadUserSettings: function() {
            try {
                const savedSettings = localStorage.getItem('sacredRosarySettings');
                
                if (savedSettings) {
                    const settings = JSON.parse(savedSettings);
                    
                    // Apply saved settings
                    if (settings.display) {
                        this.config.display = settings.display;
                    }
                    
                    if (settings.audio) {
                        this.config.audio = {...this.config.audio, ...settings.audio};
                    }
                    
                    if (settings.prayer) {
                        this.config.prayer.autoAdvance = settings.prayer.autoAdvance;
                        this.config.prayer.defaultMeditationDuration = settings.prayer.defaultMeditationDuration;
                        this.state.isAutoAdvanceEnabled = settings.prayer.autoAdvance;
                    }
                    
                    if (settings.mourning) {
                        this.config.mourning = settings.mourning;
                    }
                    
                    console.log("User settings loaded from localStorage");
                }
            } catch (error) {
                console.error("Error loading user settings:", error);
                // Use default settings
            }
        },
        
        // Check if we're in a mourning period
        checkMourningPeriod: function() {
            if (!this.config.mourning.enabled) return false;
            
            const today = new Date();
            let startDate = null;
            let endDate = null;
            
            if (this.config.mourning.startDate) {
                startDate = new Date(this.config.mourning.startDate);
            }
            
            if (this.config.mourning.endDate) {
                endDate = new Date(this.config.mourning.endDate);
                // Set to end of day
                endDate.setHours(23, 59, 59, 999);
            }
            
            const isInMourningPeriod = (!startDate || today >= startDate) && 
                                      (!endDate || today <= endDate);
            
            if (isInMourningPeriod) {
                // Apply mourning theme
                this.applyTheme('mourning');
                
                // Show announcement
                if (this.elements.mourningAnnouncement) {
                    document.getElementById('mourning-message').textContent = this.config.mourning.message;
                    this.elements.mourningAnnouncement.classList.add('visible');
                }
                
                return true;
            }
            
            return false;
        },
        
        // Set language
        setLanguage: function(languageCode) {
            this.state.activeLanguage = languageCode;
            
            // Set prayer and mystery data based on language
            switch (languageCode) {
                case 'en':
                    this.state.prayerData = PRAYERS_EN;
                    this.state.mysteryData = MYSTERIES_EN;
                    break;
                case 'es':
                    this.state.prayerData = PRAYERS_ES;
                    this.state.mysteryData = MYSTERIES_ES;
                    break;
                case 'la':
                    // Latin would be implemented here when available
                    this.showNotification('Coming Soon', 'Latin prayers are coming soon. Using English for now.');
                    this.state.prayerData = PRAYERS_EN;
                    this.state.mysteryData = MYSTERIES_EN;
                    break;
                default:
                    this.state.prayerData = PRAYERS_EN;
                    this.state.mysteryData = MYSTERIES_EN;
            }
            
            // Update any displayed texts based on the new language
            this.updateMysteryButtonLabels();
        },
        
        // Update mystery button labels based on language
        updateMysteryButtonLabels: function() {
            // This would update the labels of the mystery buttons based on the selected language
            // For now we're keeping the default English labels
        },
        
        // Load assets
        loadAssets: function() {
            // Start the loading timer to prevent getting stuck
            const loadingTimeout = setTimeout(() => {
                console.log("Loading timeout reached - forcing completion");
                
                // Hide loading overlay
                this.elements.loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    this.elements.loadingOverlay.style.display = 'none';
                }, this.config.theme.animations.transitionSpeed);
                
                this.state.isAppInitialized = true;
            }, 5000); // Reduced from 15000ms since we don't have 3D assets
            
            // Set up audio
            this.setupAudio();
            
            // Add background particles if enabled
            if (this.config.theme.backgroundParticlesCount > 0) {
                this.createBackgroundParticles();
            }
            
            // Hide loading overlay after a short delay
            setTimeout(() => {
                this.elements.loadingBar.style.width = '100%';
                
                setTimeout(() => {
                    clearTimeout(loadingTimeout);
                    this.elements.loadingOverlay.style.opacity = '0';
                    setTimeout(() => {
                        this.elements.loadingOverlay.style.display = 'none';
                    }, this.config.theme.animations.transitionSpeed);
                    
                    this.state.isAppInitialized = true;
                }, 1000);
            }, 2000);
        },
        
        // Create background particles
        createBackgroundParticles: function() {
            const container = this.elements.particlesContainer;
            const count = this.config.theme.backgroundParticlesCount;
            
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random position
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                
                // Random size
                const size = Math.random() * 4 + 1;
                
                // Random opacity
                const opacity = Math.random() * 0.3 + 0.1;
                
                // Set styles
                particle.style.left = `${x}%`;
                particle.style.top = `${y}%`;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.opacity = opacity;
                
                // Random animation delay
                particle.style.animationDelay = `${Math.random() * 10}s`;
                
                // Add to container
                container.appendChild(particle);
            }
        },
        
        // Set up audio
        setupAudio: function() {
            console.log("Setting up audio...");
            
            // Create audio objects if Howler.js is available
            if (typeof Howl !== 'undefined') {
                // Check if audio is enabled in settings
                if (this.config.audio.backgroundMusic.enabled && this.config.audio.backgroundMusic.src) {
                    console.log("Creating background music with source:", this.config.audio.backgroundMusic.src);
                    
                    try {
                        this.audio.backgroundMusic = new Howl({
                            src: [this.config.audio.backgroundMusic.src],
                            loop: true,
                            volume: this.config.audio.backgroundMusic.volume,
                            autoplay: false,
                            preload: true,
                            html5: true, // Use HTML5 Audio for better compatibility
                            onload: () => {
                                console.log("Background music loaded successfully");
                            },
                            onloaderror: (id, error) => {
                                console.error("Background music load error:", error);
                                this.showNotification('Audio Notice', 'Using silent background. Check audio file path.', 'info');
                                
                                // Create a silent audio object as fallback
                                this.createSilentAudio();
                            }
                        });
                    } catch (error) {
                        console.error("Error creating background music:", error);
                        this.createSilentAudio();
                    }
                } else {
                    // Create silent audio if background music is disabled
                    this.createSilentAudio();
                }
                
                // Prayer audio (will be set dynamically)
                this.audio.prayerAudio = new Howl({
                    src: [''], // Empty source initially
                    volume: this.config.audio.prayerAudio.volume,
                    autoplay: false,
                    preload: false,
                    onend: () => {
                        if (this.state.isAutoAdvanceEnabled && this.state.isPlaying) {
                            setTimeout(() => {
                                this.nextPrayer();
                            }, this.config.prayer.autoAdvanceDelay);
                        }
                    }
                });
                
                // Set up sound effects
                this.setupEffectSounds();
            } else {
                console.warn('Howler.js not loaded. Audio features disabled.');
                this.showNotification('Warning', 'Audio library not loaded. Sound features are disabled.', 'warning');
            }
        },
        
        // Set up effect sounds
        setupEffectSounds: function() {
            try {
                // Only set up effects if enabled
                if (!this.config.audio.effects.enabled) return;
                
                // Click sound
                this.audio.effects.click = new Howl({
                    src: ['assets/audio/effects/click.mp3'],
                    volume: this.config.audio.effects.volume,
                    preload: true,
                    html5: true,
                    onloaderror: () => {
                        console.warn("Could not load click sound effect");
                    }
                });
                
                // Transition sound
                this.audio.effects.transition = new Howl({
                    src: ['assets/audio/effects/transition.mp3'],
                    volume: this.config.audio.effects.volume,
                    preload: true,
                    html5: true,
                    onloaderror: () => {
                        console.warn("Could not load transition sound effect");
                    }
                });
            } catch (error) {
                console.error("Error setting up sound effects:", error);
            }
        },
        
        // Create a silent audio object as fallback
        createSilentAudio: function() {
            console.log("Creating silent audio fallback");
            
            // Create a dummy object that implements the same interface but does nothing
            this.audio.backgroundMusic = {
                play: function() { console.log("Silent audio 'playing'"); },
                pause: function() { console.log("Silent audio 'paused'"); },
                stop: function() { console.log("Silent audio 'stopped'"); },
                playing: function() { return false; },
                volume: function() { return 0; }
            };
        },
        
        // Create the rosary sequence
        createRosarySequence: function() {
            const sequence = [];
            
            // Start with the Sign of the Cross and Apostles' Creed
            sequence.push({prayer: 'signOfCross', type: 'prayer', decade: null, bead: null});
            sequence.push({prayer: 'apostlesCreed', type: 'prayer', decade: null, bead: null});
            
            // First Our Father
            sequence.push({prayer: 'ourFather', type: 'prayer', decade: 0, bead: 'opening-our-father'});
            
            // First three Hail Marys
            for (let i = 0; i < 3; i++) {
                sequence.push({prayer: 'hailMary', type: 'prayer', decade: 0, bead: `opening-hail-mary-${i+1}`});
            }
            
            // Glory Be
            sequence.push({prayer: 'gloryBe', type: 'prayer', decade: 0, bead: null});
            
            // Five decades
            for (let decade = 0; decade < 5; decade++) {
                // Announce mystery
                sequence.push({
                    type: 'mystery',
                    mysteryIndex: decade,
                    mysteryType: this.state.currentMysteryType,
                    decade: decade+1,
                    bead: null
                });
                
                // Our Father
                sequence.push({prayer: 'ourFather', type: 'prayer', decade: decade+1, bead: `decade-${decade+1}-our-father`});
                
                // 10 Hail Marys
                for (let bead = 0; bead < 10; bead++) {
                    sequence.push({prayer: 'hailMary', type: 'prayer', decade: decade+1, bead: `decade-${decade+1}-hail-mary-${bead+1}`});
                }
                
                // Glory Be and Fatima Prayer
                sequence.push({prayer: 'gloryBe', type: 'prayer', decade: decade+1, bead: null});
                sequence.push({prayer: 'fatimaPrayer', type: 'prayer', decade: decade+1, bead: null});
            }
            
            // Conclude with Hail Holy Queen and final prayer
            sequence.push({prayer: 'hailHolyQueen', type: 'prayer', decade: null, bead: null});
            sequence.push({prayer: 'finalPrayer', type: 'prayer', decade: null, bead: null});
            sequence.push({prayer: 'signOfCross', type: 'prayer', decade: null, bead: null});
            
            this.state.rosarySequence = sequence;
            this.state.totalPrayers = sequence.length;
            return sequence;
        },
        
        // Start the rosary prayer
        startRosary: function() {
            // Create the rosary sequence
            this.createRosarySequence();
            
            // Reset prayer index
            this.state.currentPrayerIndex = 0;
            
            // Hide landing page
            this.elements.landingPage.style.opacity = '0';
            this.elements.landingPage.style.transform = 'translateY(-20px)';
            
            // Play transition sound
            if (this.audio.effects.transition && this.config.audio.effects.enabled) {
                try {
                    this.audio.effects.transition.play();
                } catch (error) {
                    console.warn("Could not play transition sound:", error);
                }
            }
            
            // Start background music if enabled
            if (this.config.audio.backgroundMusic.enabled && this.audio.backgroundMusic) {
                try {
                    console.log("Attempting to play background music");
                    this.audio.backgroundMusic.play();
                } catch (error) {
                    console.error("Error playing background music:", error);
                }
            }
            
            setTimeout(() => {
                this.elements.landingPage.style.display = 'none';
                this.elements.mainContent.style.display = 'flex';
                
                // Auto-start playing
                this.state.isPlaying = true;
                this.elements.playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                
                // Display first prayer
                this.updatePrayerDisplay();
                
                // Start auto-advance timer
                if (this.state.isAutoAdvanceEnabled) {
                    this.startPrayerTimer();
                }
            }, this.config.theme.animations.transitionSpeed);
        },
        
        // Start prayer auto-advance timer
        startPrayerTimer: function() {
            if (!this.state.isPlaying || !this.state.isAutoAdvanceEnabled) return;
            
            const currentItem = this.state.rosarySequence[this.state.currentPrayerIndex];
            let duration = 5000; // Default duration
            
            if (currentItem.type === 'prayer') {
                const prayer = this.state.prayerData[currentItem.prayer];
                duration = prayer.duration || 5000;
            } else if (currentItem.type === 'mystery') {
                const mystery = this.state.mysteryData[currentItem.mysteryType][currentItem.mysteryIndex];
                duration = mystery.duration || 15000;
                
                // Add meditation time based on settings
                if (this.config.prayer.meditationDurations) {
                    duration += this.config.prayer.meditationDurations[this.config.prayer.defaultMeditationDuration] || 0;
                }
            }
            
            // Clear any existing timer
            clearTimeout(this.prayerTimer);
            
            // Set new timer
            this.prayerTimer = setTimeout(() => {
                if (this.state.isPlaying && this.state.isAutoAdvanceEnabled) {
                    this.nextPrayer();
                }
            }, duration);
        },
        
        // Update prayer display with improved progress indicator
        updatePrayerDisplay: function() {
            const currentItem = this.state.rosarySequence[this.state.currentPrayerIndex];
            
            // Fade out current content
            this.elements.prayerScroll.style.opacity = '0';
            
            setTimeout(() => {
                // Update content based on prayer type
                if (currentItem.type === 'prayer') {
                    const prayer = this.state.prayerData[currentItem.prayer];
                    this.elements.prayerTitle.textContent = prayer.title;
                    this.elements.prayerInstructions.textContent = prayer.instructions;
                    this.elements.prayerText.innerHTML = `<p>${prayer.text}</p>`;
                    
                    // Update prayer icon and name
                    this.updatePrayerTypeIndicator(currentItem.prayer);
                } else if (currentItem.type === 'mystery') {
                    const mystery = this.state.mysteryData[currentItem.mysteryType][currentItem.mysteryIndex];
                    this.elements.prayerTitle.textContent = mystery.title;
                    this.elements.prayerInstructions.textContent = 'Meditate on this mystery';
                    
                    // Add description and scripture if enabled
                    let content = `<p>${mystery.description}</p>`;
                    
                    if (this.config.prayer.showScripture) {
                        content += `<p class="scripture">${mystery.scripture}</p>`;
                    }
                    
                    content += `<p class="fruits">${mystery.fruits}</p>`;
                    this.elements.prayerText.innerHTML = content;
                    
                    // Update mystery info panel
                    if (this.elements.mysteryInfo) {
                        this.elements.mysteryInfo.querySelector('.mystery-title').textContent = mystery.title;
                        this.elements.mysteryInfo.querySelector('.mystery-description').textContent = mystery.description;
                        this.elements.mysteryInfo.querySelector('.mystery-fruits').textContent = mystery.fruits;
                    }
                    
                    // Update prayer icon and name for mysteries
                    this.updatePrayerTypeIndicator('mystery');
                }
                
                // Update progress indicators
                this.updateProgressIndicators();
                
                // Fade in new content
                this.elements.prayerScroll.style.opacity = '1';
                
                // Start auto-advance timer if needed
                if (this.state.isPlaying && this.state.isAutoAdvanceEnabled) {
                    this.startPrayerTimer();
                }
            }, 300);
        },
        
        // Update prayer type indicator (icon and name)
        updatePrayerTypeIndicator: function(prayerType) {
            let icon = '';
            let name = '';
            
            switch (prayerType) {
                case 'signOfCross':
                    icon = '<i class="fas fa-cross"></i>';
                    name = 'Sign of the Cross';
                    break;
                case 'apostlesCreed':
                    icon = '<i class="fas fa-book"></i>';
                    name = 'Apostles\' Creed';
                    break;
                case 'ourFather':
                    icon = '<i class="fas fa-hands-praying"></i>';
                    name = 'Our Father';
                    break;
                case 'hailMary':
                    icon = '<i class="fas fa-heart"></i>';
                    name = 'Hail Mary';
                    break;
                case 'gloryBe':
                    icon = '<i class="fas fa-sun"></i>';
                    name = 'Glory Be';
                    break;
                case 'fatimaPrayer':
                    icon = '<i class="fas fa-pray"></i>';
                    name = 'Fatima Prayer';
                    break;
                case 'hailHolyQueen':
                    icon = '<i class="fas fa-crown"></i>';
                    name = 'Hail, Holy Queen';
                    break;
                case 'finalPrayer':
                    icon = '<i class="fas fa-dove"></i>';
                    name = 'Closing Prayer';
                    break;
                case 'mystery':
                    icon = '<i class="fas fa-star"></i>';
                    name = 'Mystery';
                    break;
                default:
                    icon = '<i class="fas fa-pray"></i>';
                    name = 'Prayer';
            }
            
            this.elements.prayerIcon.innerHTML = icon;
            this.elements.prayerName.textContent = name;
        },
        
        // Update progress indicators with simplified linear progress
        updateProgressIndicators: function() {
            // Calculate progress percentage
            const progress = ((this.state.currentPrayerIndex + 1) / this.state.totalPrayers) * 100;
            
            // Update progress bar
            this.elements.progressBar.style.width = `${progress}%`;
            
            // Update progress text
            this.elements.progressText.textContent = `Prayer ${this.state.currentPrayerIndex + 1} of ${this.state.totalPrayers}`;
            
            // Update decade title
            const currentItem = this.state.rosarySequence[this.state.currentPrayerIndex];
            let currentDecade = 0;
            
            if (currentItem.decade !== null) {
                currentDecade = currentItem.decade;
            }
            
            // Update progress title
            if (currentDecade === 0) {
                this.elements.progressTitle.textContent = 'Opening Prayers';
            } else if (currentDecade > 5) {
                this.elements.progressTitle.textContent = 'Closing Prayers';
            } else {
                const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
                this.elements.progressTitle.textContent = `${ordinals[currentDecade - 1]} Decade`;
            }
        },
        
        // Navigate to the next prayer
        nextPrayer: function() {
            if (this.state.currentPrayerIndex < this.state.rosarySequence.length - 1) {
                // Play click sound
                if (this.audio.effects.click && this.config.audio.effects.enabled) {
                    this.audio.effects.click.play();
                }
                
                // Stop current timer
                clearTimeout(this.prayerTimer);
                
                this.state.currentPrayerIndex++;
                this.updatePrayerDisplay();
            } else {
                // End of rosary reached
                if (this.audio.effects.transition && this.config.audio.effects.enabled) {
                    this.audio.effects.transition.play();
                }
                
                // Stop auto-advance
                clearTimeout(this.prayerTimer);
                this.state.isPlaying = false;
                this.elements.playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
                
                this.showNotification('Rosary Complete', 'You have completed praying the rosary. God bless you!');
            }
        },
        
        // Navigate to the previous prayer
        prevPrayer: function() {
            if (this.state.currentPrayerIndex > 0) {
                // Play click sound
                if (this.audio.effects.click && this.config.audio.effects.enabled) {
                    this.audio.effects.click.play();
                }
                
                // Stop current timer
                clearTimeout(this.prayerTimer);
                
                this.state.currentPrayerIndex--;
                this.updatePrayerDisplay();
            }
        },
        
        // Toggle play/pause
        togglePlay: function() {
            this.state.isPlaying = !this.state.isPlaying;
            
            if (this.state.isPlaying) {
                this.elements.playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                
                // Start auto-advance timer if enabled
                if (this.state.isAutoAdvanceEnabled) {
                    this.startPrayerTimer();
                }
            } else {
                this.elements.playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
                
                // Stop auto-advance timer
                clearTimeout(this.prayerTimer);
            }
        },
        
        // Show notification
        showNotification: function(title, message, type = 'info') {
            // Set notification content
            this.elements.notificationTitle.textContent = title;
            this.elements.notificationMessage.textContent = message;
            
            // Apply notification type
            this.elements.notification.className = 'notification';
            this.elements.notification.classList.add(`notification-${type}`);
            
            // Show notification
            this.elements.notification.classList.add('visible');
            
            // Hide after delay
            setTimeout(() => {
                this.hideNotification();
            }, 4000);
        },
        
        // Hide notification
        hideNotification: function() {
            this.elements.notification.classList.remove('visible');
        }
    };
    
    // Initialize the application
    SacredRosary.init();
});
