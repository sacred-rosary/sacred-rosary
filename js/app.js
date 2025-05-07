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
            isPlaying: false,
            isAutoAdvanceEnabled: false,
            isModelLoaded: false,
            isAppInitialized: false,
            activeLanguage: 'en',
            liturgicalSeason: 'ordinary',
            loadingProgress: 0,
            prayerData: null, // Will hold the active language prayer data
            mysteryData: null, // Will hold the active language mystery data
            rosarySequence: [], // Will hold the current rosary sequence
        },
        
        // DOM Elements
        elements: {},
        
        // Three.js objects
        three: {
            scene: null,
            camera: null,
            renderer: null,
            model: null,
            lights: {},
            clock: null,
        },
        
        // Audio objects
        audio: {
            backgroundMusic: null,
            prayerAudio: null,
            effects: {},
        },
        
        // Initialize the application
        init: function() {
            // Register DOM elements
            this.registerDOMElements();
            
            // Apply theme from config
            this.applyTheme();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Show the date confirmation dialog
            this.showDateConfirmation();
            
            // Set up all language translations
            this.setLanguage(this.config.language.default);
            
            // Initialize the 3D scene
            this.initializeScene();
            
            // Start loading assets
            this.loadAssets();
        },
        
        // Register DOM elements
        registerDOMElements: function() {
            // Main sections
            this.elements.appContainer = document.querySelector('.app-container');
            this.elements.loadingOverlay = document.querySelector('.loading-overlay');
            this.elements.loadingBar = document.querySelector('.loading-bar');
            this.elements.dateConfirmationDialog = document.querySelector('.date-confirmation-dialog');
            this.elements.currentDateSpan = document.getElementById('current-date');
            this.elements.liturgicalSeasonSpan = document.getElementById('liturgical-season');
            this.elements.dateConfirmButton = document.getElementById('date-confirm-button');
            this.elements.landingPage = document.querySelector('.landing-page');
            this.elements.mainContent = document.querySelector('.main-content');
            this.elements.prayerSection = document.querySelector('.prayer-section');
            this.elements.modelSection = document.querySelector('.model-section');
            
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
            this.elements.decadeIndicator = document.querySelector('.decade-indicator');
            this.elements.decadeDots = document.querySelectorAll('.decade-dot');
            this.elements.beadIndicator = document.querySelector('.bead-indicator');
            
            // Controls
            this.elements.prayerControls = document.querySelector('.prayer-controls');
            this.elements.prevBtn = document.querySelector('.prev-btn');
            this.elements.playBtn = document.querySelector('.play-btn');
            this.elements.nextBtn = document.querySelector('.next-btn');
            
            // Model elements
            this.elements.modelCanvas = document.getElementById('model-canvas');
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
        },
        
        // Apply theme from config
        applyTheme: function() {
            const root = document.documentElement;
            const theme = this.config.theme;
            
            // Set base colors
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
            root.style.setProperty('--transition-slow', `${theme.animations.transitionSpeed}ms`);
            root.style.setProperty('--transition-medium', `${theme.animations.transitionSpeed * 0.6}ms`);
            root.style.setProperty('--transition-fast', `${theme.animations.transitionSpeed * 0.3}ms`);
        },
        
        // Set up event listeners
        setupEventListeners: function() {
            const self = this;
            
            // Date confirmation
            this.elements.dateConfirmButton.addEventListener('click', function() {
                self.elements.dateConfirmationDialog.classList.remove('visible');
            });
            
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
            
            // Window resize event
            window.addEventListener('resize', function() {
                if (self.three.camera && self.three.renderer) {
                    self.three.camera.aspect = self.elements.modelCanvas.clientWidth / self.elements.modelCanvas.clientHeight;
                    self.three.camera.updateProjectionMatrix();
                    self.three.renderer.setSize(self.elements.modelCanvas.clientWidth, self.elements.modelCanvas.clientHeight);
                }
            });
        },
        
        // Show date confirmation dialog
        showDateConfirmation: function() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = now.toLocaleDateString(undefined, options);
            
            this.elements.currentDateSpan.textContent = formattedDate;
            
            // Determine the liturgical season based on the date
            const month = now.getMonth() + 1; // getMonth() returns 0-11
            const day = now.getDate();
            const dateKey = `${month}-${day}`;
            
            // Default to Ordinary Time
            let seasonCode = this.config.liturgicalCalendar[dateKey] || 0;
            
            // Map season code to name
            const seasonNames = {
                0: 'Ordinary Time',
                1: 'Advent',
                2: 'Christmas',
                3: 'Lent',
                4: 'Easter',
                5: 'Feast Day'
            };
            
            this.state.liturgicalSeason = Object.keys(seasonNames)[seasonCode];
            this.elements.liturgicalSeasonSpan.textContent = seasonNames[seasonCode];
            
            // Set liturgical color based on season
            this.setLiturgicalColors(seasonCode);
            
            // Show the dialog
            this.elements.dateConfirmationDialog.classList.add('visible');
        },
        
        // Set liturgical colors based on season
        setLiturgicalColors: function(seasonCode) {
            const root = document.documentElement;
            const seasonKeys = ['ordinary', 'advent', 'christmas', 'lent', 'easter', 'feast'];
            const seasonKey = seasonKeys[seasonCode];
            
            // Get colors for this season from config
            const colors = this.config.theme.liturgicalColors[seasonKey];
            
            // Apply to CSS variables
            if (colors) {
                root.style.setProperty('--primary-color', colors.primaryColor);
                root.style.setProperty('--secondary-color', colors.secondaryColor);
                root.style.setProperty('--accent-color', colors.accentColor);
            }
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
        
        // Initialize the 3D scene
        initializeScene: function() {
            try {
                // Create scene
                this.three.scene = new THREE.Scene();
                this.three.scene.background = new THREE.Color(this.config.theme.backgroundColor);
                
                // Create camera
                this.three.camera = new THREE.PerspectiveCamera(
                    45,
                    this.elements.modelCanvas.clientWidth / this.elements.modelCanvas.clientHeight,
                    0.1,
                    1000
                );
                
                // Set initial camera position
                this.three.camera.position.set(0, 0, 5);
                
                // Create renderer
                this.three.renderer = new THREE.WebGLRenderer({
                    canvas: this.elements.modelCanvas,
                    antialias: true,
                    alpha: true
                });
                
                this.three.renderer.setSize(
                    this.elements.modelCanvas.clientWidth,
                    this.elements.modelCanvas.clientHeight
                );
                
                this.three.renderer.setPixelRatio(window.devicePixelRatio);
                this.three.renderer.shadowMap.enabled = true;
                
                // Add lights
                this.setupLights();
                
                // Create animation clock
                this.three.clock = new THREE.Clock();
                
                // Start the render loop
                this.animate();
            } catch (error) {
                console.error('Error initializing 3D scene:', error);
                this.showNotification('Error', 'Could not initialize 3D scene. Using fallback display.', 'error');
                
                // Hide the loading overlay anyway to prevent getting stuck
                setTimeout(() => {
                    this.elements.loadingOverlay.style.opacity = '0';
                    setTimeout(() => {
                        this.elements.loadingOverlay.style.display = 'none';
                    }, this.config.theme.animations.transitionSpeed);
                }, 2000);
            }
        },
        
        // Set up the lights
        setupLights: function() {
            // Add ambient light
            const ambientLight = new THREE.AmbientLight(
                this.config.model.ambient.color, 
                this.config.model.ambient.intensity
            );
            this.three.scene.add(ambientLight);
            this.three.lights.ambient = ambientLight;
            
            // Add directional light (main light)
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
            directionalLight.position.set(1, 1, 1);
            this.three.scene.add(directionalLight);
            this.three.lights.main = directionalLight;
            
            // Add candle-like point lights
            const candleLight1 = new THREE.PointLight(
                this.config.model.candle.color, 
                this.config.model.candle.intensity, 
                10, 
                2
            );
            candleLight1.position.set(2, 1, 2);
            this.three.scene.add(candleLight1);
            this.three.lights.candle1 = candleLight1;
            
            const candleLight2 = new THREE.PointLight(
                this.config.model.candle.color, 
                this.config.model.candle.intensity, 
                10, 
                2
            );
            candleLight2.position.set(-2, 1, -2);
            this.three.scene.add(candleLight2);
            this.three.lights.candle2 = candleLight2;
            
            // Animate candle lights for flickering effect
            this.animateCandleLights();
        },
        
        // Animate candle lights for flickering effect
        animateCandleLights: function() {
            const self = this;
            
            const updateLight = (light) => {
                if (!light) return;
                
                // Random intensity fluctuation
                const baseIntensity = this.config.model.candle.intensity;
                const fluctuation = 0.3;
                const newIntensity = baseIntensity + (Math.random() * fluctuation - fluctuation / 2);
                light.intensity = newIntensity;
                
                // Subtle position fluctuation
                const positionFluctuation = 0.05;
                light.position.x += (Math.random() * positionFluctuation - positionFluctuation / 2);
                light.position.y += (Math.random() * positionFluctuation - positionFluctuation / 2);
                light.position.z += (Math.random() * positionFluctuation - positionFluctuation / 2);
            };
            
            // Update every 100ms for subtle flickering
            setInterval(() => {
                if (this.config.theme.animations.enabled && this.three.lights) {
                    updateLight(this.three.lights.candle1);
                    updateLight(this.three.lights.candle2);
                }
            }, 100);
        },
        
        // Animation loop
        animate: function() {
            const self = this;
            
            function loop() {
                requestAnimationFrame(loop);
                
                if (self.three.renderer && self.three.scene && self.three.camera) {
                    // Animate the model with subtle floating motion
                    if (self.three.model && self.config.theme.animations.enabled) {
                        const time = Date.now() * 0.001;
                        const amplitude = self.config.theme.modelMovementAmount;
                        
                        self.three.model.position.y = Math.sin(time * (2 * Math.PI / self.config.theme.modelMovementSpeed)) * amplitude;
                        self.three.model.rotation.y = Math.sin(time * (Math.PI / self.config.theme.modelMovementSpeed)) * amplitude * 0.2;
                    }
                    
                    // Render scene
                    self.three.renderer.render(self.three.scene, self.three.camera);
                }
            }
            
            loop();
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
                
                // Create fallback model if needed
                if (!this.state.isModelLoaded) {
                    this.createFallbackModel();
                }
                
                this.state.isAppInitialized = true;
            }, 15000);
            
            // Set up audio
            this.setupAudio();
            
            // Load 3D model
            this.loadModel();
            
            // Hide loading overlay after a short delay (or when model is loaded)
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
            }, 3000);
        },
        
        // Set up audio
        setupAudio: function() {
            // Create audio objects if Howler.js is available
            if (typeof Howl !== 'undefined') {
                // Background music
                this.audio.backgroundMusic = new Howl({
                    src: [this.config.audio.backgroundMusic.src],
                    loop: true,
                    volume: this.config.audio.backgroundMusic.volume,
                    autoplay: false,
                    preload: true
                });
                
                // Prayer audio (will be set dynamically)
                this.audio.prayerAudio = new Howl({
                    src: [''],
                    volume: this.config.audio.prayerAudio.volume,
                    autoplay: false,
                    preload: true,
                    onend: () => {
                        if (this.state.isAutoAdvanceEnabled && this.state.isPlaying) {
                            setTimeout(() => {
                                this.nextPrayer();
                            }, this.config.prayer.autoAdvanceDelay);
                        }
                    }
                });
                
                // Effect sounds
                this.audio.effects.click = new Howl({
                    src: ['assets/audio/effects/click.mp3'],
                    volume: this.config.audio.effects.volume,
                    preload: true
                });
                
                this.audio.effects.transition = new Howl({
                    src: ['assets/audio/effects/transition.mp3'],
                    volume: this.config.audio.effects.volume,
                    preload: true
                });
            } else {
                console.warn('Howler.js not loaded. Audio features disabled.');
            }
        },
        
        // Replace your loadModel function with this simpler version
loadModel: function() {
    const self = this;
    
    // Skip model loading if no URL specified
    if (!this.config.model.url) {
        console.log('No model URL specified. Please set a valid model URL in config.js');
        this.showNotification('Model Configuration', 'Please specify a 3D model URL in config.js', 'warning');
        return;
    }
    
    // Create a simple placeholder while loading
    const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
    const material = new THREE.MeshStandardMaterial({ 
        color: this.config.theme.accentColor,
        metalness: 0.5,
        roughness: 0.5
    });
    const placeholderModel = new THREE.Mesh(geometry, material);
    this.three.scene.add(placeholderModel);
    this.three.model = placeholderModel;
    
    try {
        // Import directly into the global scope to make GLTFLoader available
        const scriptElement = document.createElement('script');
        scriptElement.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js";
        scriptElement.async = false; // We want this to load synchronously
        
        // Add event listeners for the script
        scriptElement.onload = function() {
            console.log("GLTFLoader loaded successfully");
            
            // Now that we know GLTFLoader is loaded, create and use it
            if (typeof THREE.GLTFLoader === 'function') {
                const loader = new THREE.GLTFLoader();
                
                // Log the URL we're trying to load
                console.log("Attempting to load model from:", self.config.model.url);
                
                // Create a XMLHttpRequest to check if the file exists first
                const request = new XMLHttpRequest();
                request.open('HEAD', self.config.model.url, true);
                
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            // File exists, try to load it
                            console.log("Model file exists, loading...");
                            
                            loader.load(
                                self.config.model.url,
                                function(gltf) {
                                    console.log("Model loaded successfully!");
                                    
                                    // Remove placeholder
                                    self.three.scene.remove(placeholderModel);
                                    
                                    // Add the new model
                                    self.three.model = gltf.scene;
                                    self.three.scene.add(gltf.scene);
                                    
                                    // Apply scale
                                    gltf.scene.scale.set(
                                        self.config.model.scale,
                                        self.config.model.scale,
                                        self.config.model.scale
                                    );
                                    
                                    // Center the model
                                    const box = new THREE.Box3().setFromObject(gltf.scene);
                                    const center = box.getCenter(new THREE.Vector3());
                                    gltf.scene.position.x = -center.x;
                                    gltf.scene.position.y = -center.y;
                                    gltf.scene.position.z = -center.z;
                                    
                                    // Enable shadows
                                    gltf.scene.traverse(function(node) {
                                        if (node.isMesh) {
                                            node.castShadow = true;
                                            node.receiveShadow = true;
                                        }
                                    });
                                    
                                    self.state.isModelLoaded = true;
                                    self.showNotification('Success', 'Your 3D model has been loaded successfully.', 'success');
                                },
                                function(xhr) {
                                    // Loading progress
                                    if (xhr.total > 0) {
                                        const percentComplete = (xhr.loaded / xhr.total) * 100;
                                        console.log("Loading progress: " + percentComplete.toFixed(2) + "%");
                                        if (self.elements.loadingBar) {
                                            self.elements.loadingBar.style.width = `${percentComplete}%`;
                                        }
                                    }
                                },
                                function(error) {
                                    console.error('Error loading model:', error);
                                    self.showNotification('Error', 'Could not load the 3D model. Error: ' + error.message, 'error');
                                }
                            );
                        } else {
                            // File doesn't exist
                            console.error("Model file doesn't exist at URL:", self.config.model.url);
                            self.showNotification('File Not Found', 'The 3D model file could not be found at the specified URL. Check the path and try again.', 'error');
                        }
                    }
                };
                
                request.onerror = function() {
                    console.error("Error checking model file existence");
                    self.showNotification('Network Error', 'Could not connect to the model URL. Check your internet connection and the URL.', 'error');
                };
                
                request.send();
            } else {
                console.error("THREE.GLTFLoader is still not defined after loading the script");
                self.showNotification('Error', 'Could not initialize the model loader. Try refreshing the page.', 'error');
            }
        };
        
        scriptElement.onerror = function() {
            console.error("Failed to load GLTFLoader script");
            self.showNotification('Error', 'Failed to load required 3D model libraries. Check your internet connection.', 'error');
        };
        
        // Add the script to the document
        document.head.appendChild(scriptElement);
        
    } catch (error) {
        console.error('Error in model loading process:', error);
        this.showNotification('Error', 'An unexpected error occurred while loading the 3D model: ' + error.message, 'error');
    }
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
            if (this.audio.effects.transition) {
                this.audio.effects.transition.play();
            }
            
            // Start background music if enabled
            if (this.config.audio.backgroundMusic.enabled && this.audio.backgroundMusic) {
                this.audio.backgroundMusic.play();
            }
            
            setTimeout(() => {
                this.elements.landingPage.style.display = 'none';
                this.elements.mainContent.style.display = 'flex';
                
                // Set up beads display
                this.setupBeadIndicator();
                
                // Display first prayer
                this.updatePrayerDisplay();
            }, this.config.theme.animations.transitionSpeed);
        },
        
        // Set up bead indicator
        setupBeadIndicator: function() {
            // Clear existing beads
            this.elements.beadIndicator.innerHTML = '';
            
            // Create 10 beads for a decade
            for (let i = 0; i < 10; i++) {
                const bead = document.createElement('div');
                bead.className = 'bead';
                this.elements.beadIndicator.appendChild(bead);
            }
        },
        
        // Update prayer display
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
                    this.elements.mysteryInfo.querySelector('.mystery-title').textContent = mystery.title;
                    this.elements.mysteryInfo.querySelector('.mystery-description').textContent = mystery.description;
                    this.elements.mysteryInfo.querySelector('.mystery-fruits').textContent = mystery.fruits;
                    this.elements.mysteryInfo.classList.add('visible');
                    
                    // Hide mystery info after a delay
                    setTimeout(() => {
                        this.elements.mysteryInfo.classList.remove('visible');
                    }, 5000);
                }
                
                // Update progress indicators
                this.updateProgressIndicators();
                
                // Fade in new content
                this.elements.prayerScroll.style.opacity = '1';
            }, 300);
        },
        
        // Update progress indicators (beads and decade dots)
        updateProgressIndicators: function() {
            const currentItem = this.state.rosarySequence[this.state.currentPrayerIndex];
            
            // Determine current decade and bead
            let currentDecade = 0;
            
            if (currentItem.decade !== null) {
                currentDecade = currentItem.decade;
            }
            
            // Update decade dots
            this.elements.decadeDots.forEach((dot, index) => {
                dot.classList.remove('active', 'completed');
                
                if (index < currentDecade) {
                    dot.classList.add('completed');
                } else if (index === currentDecade) {
                    dot.classList.add('active');
                }
            });
            
            // Update progress title
            if (currentDecade === 0) {
                this.elements.progressTitle.textContent = 'Opening Prayers';
            } else if (currentDecade > 5) {
                this.elements.progressTitle.textContent = 'Closing Prayers';
            } else {
                const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
                this.elements.progressTitle.textContent = `${ordinals[currentDecade - 1]} Decade`;
            }
            
            // Update bead indicators
            const beads = document.querySelectorAll('.bead');
            
            if (currentItem.prayer === 'hailMary') {
                // Count how many Hail Marys we've seen in this decade
                let hailMaryCount = 0;
                
                for (let i = 0; i <= this.state.currentPrayerIndex; i++) {
                    const item = this.state.rosarySequence[i];
                    if (item.prayer === 'hailMary' && item.decade === currentItem.decade) {
                        hailMaryCount++;
                    }
                }
                
                // Update bead display
                beads.forEach((bead, index) => {
                    bead.classList.remove('active', 'completed', 'larger');
                    
                    if (index < hailMaryCount - 1) {
                        bead.classList.add('completed');
                    } else if (index === hailMaryCount - 1) {
                        bead.classList.add('active');
                    }
                });
            } else if (currentItem.prayer === 'ourFather') {
                // For Our Father, just show one active bead
                beads.forEach((bead, index) => {
                    bead.classList.remove('active', 'completed');
                    
                    if (index === 0) {
                        bead.classList.add('larger', 'active');
                    }
                });
            } else {
                // For other prayers, no active beads
                beads.forEach(bead => {
                    bead.classList.remove('active', 'completed', 'larger');
                });
            }
        },
        
        // Navigate to the next prayer
        nextPrayer: function() {
            if (this.state.currentPrayerIndex < this.state.rosarySequence.length - 1) {
                // Play click sound
                if (this.audio.effects.click) {
                    this.audio.effects.click.play();
                }
                
                // Stop current audio if playing
                if (this.state.isPlaying && this.audio.prayerAudio) {
                    this.audio.prayerAudio.stop();
                }
                
                this.state.currentPrayerIndex++;
                this.updatePrayerDisplay();
                
                // Start audio for new prayer if auto-playing
                if (this.state.isPlaying && this.config.audio.prayerAudio.enabled) {
                    this.playPrayerAudio();
                }
            } else {
                // End of rosary reached
                if (this.audio.effects.transition) {
                    this.audio.effects.transition.play();
                }
                this.showNotification('Rosary Complete', 'You have completed praying the rosary. God bless you!');
            }
        },
        
        // Navigate to the previous prayer
        prevPrayer: function() {
            if (this.state.currentPrayerIndex > 0) {
                // Play click sound
                if (this.audio.effects.click) {
                    this.audio.effects.click.play();
                }
                
                // Stop current audio if playing
                if (this.state.isPlaying && this.audio.prayerAudio) {
                    this.audio.prayerAudio.stop();
                }
                
                this.state.currentPrayerIndex--;
                this.updatePrayerDisplay();
                
                // Start audio for new prayer if auto-playing
                if (this.state.isPlaying && this.config.audio.prayerAudio.enabled) {
                    this.playPrayerAudio();
                }
            }
        },
        
        // Toggle play/pause
        togglePlay: function() {
            this.state.isPlaying = !this.state.isPlaying;
            
            if (this.state.isPlaying) {
                this.elements.playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                if (this.config.audio.prayerAudio.enabled) {
                    this.playPrayerAudio();
                }
            } else {
                this.elements.playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
                if (this.audio.prayerAudio) {
                    this.audio.prayerAudio.pause();
                }
            }
        },
        
        // Play current prayer audio
        playPrayerAudio: function() {
            if (!this.audio.prayerAudio) return;
            
            const currentItem = this.state.rosarySequence[this.state.currentPrayerIndex];
            
            let audioFile = '';
            let duration = 5000; // Default duration
            
            if (currentItem.type === 'prayer') {
                const prayer = this.state.prayerData[currentItem.prayer];
                audioFile = prayer.audio;
                duration = prayer.duration || 5000;
            } else if (currentItem.type === 'mystery') {
                const mystery = this.state.mysteryData[currentItem.mysteryType][currentItem.mysteryIndex];
                audioFile = mystery.audio;
                duration = mystery.duration || 15000;
                
                // Add meditation time based on settings
                if (this.config.prayer.meditationDurations) {
                    duration += this.config.prayer.meditationDurations[this.config.prayer.defaultMeditationDuration] || 0;
                }
            }
            
            // In a real app, you would set the audio source and play
            // this.audio.prayerAudio.src = audioFile;
            // this.audio.prayerAudio.play();
            
            // For demo, we'll simulate using setTimeout
            if (this.state.isPlaying && this.state.isAutoAdvanceEnabled) {
                setTimeout(() => {
                    if (this.state.isPlaying && this.state.isAutoAdvanceEnabled && 
                        this.state.currentPrayerIndex < this.state.rosarySequence.length - 1) {
                        this.nextPrayer();
                    } else if (this.state.isPlaying && 
                               this.state.currentPrayerIndex === this.state.rosarySequence.length - 1) {
                        // End of rosary reached
                        this.state.isPlaying = false;
                        this.elements.playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
                        if (this.audio.effects.transition) {
                            this.audio.effects.transition.play();
                        }
                        this.showNotification('Rosary Complete', 'You have completed praying the rosary. God bless you!');
                    }
                }, duration);
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
        },
        
        // Helper: Get ordinal suffix
        getOrdinal: function(n) {
            const s = ["th", "st", "nd", "rd"];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        }
    };
    
    // Initialize the application
    SacredRosary.init();
});
