// Sacred Rosary - Main Application
document.addEventListener('DOMContentLoaded', function() {
    // Check if Three.js is loaded
    if (!window.THREE) {
        console.error("THREE.js not loaded! Please check your internet connection and try again.");
        
        // Show error to user and reveal app anyway after a delay
        const loadingOverlay = document.querySelector('.loading-overlay');
        const loadingText = document.querySelector('.loading-text');
        
        if (loadingText) {
            loadingText.textContent = "Error loading 3D libraries. You'll still be able to pray the rosary.";
        }
        
        setTimeout(() => {
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 800);
            }
        }, 3000);
    }
    
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
            console.log("Initializing Sacred Rosary Application");
            
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
        
        // Test if a URL is accessible
        testModelURL: function(url) {
            console.log("Testing URL accessibility:", url);
            
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.open("HEAD", url, true);
                
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        console.log("URL is accessible:", url);
                        resolve(true);
                    } else {
                        console.warn("URL is not accessible:", url, "Status:", xhr.status);
                        resolve(false);
                    }
                };
                
                xhr.onerror = function() {
                    console.error("Error testing URL:", url);
                    resolve(false);
                };
                
                xhr.send();
            });
        },
        
        // Initialize the 3D scene
        initializeScene: function() {
            try {
                console.log("Initializing 3D scene");
                
                // First check if THREE is available
                if (!window.THREE) {
                    console.error("THREE is not defined - cannot initialize scene");
                    this.showNotification("Error", "3D library not loaded. Try refreshing the page.", "error");
                    return;
                }
                
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
                
                // Create renderer with alpha for transparency
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
                
                console.log("3D scene initialized successfully");
                
                // Test model URL before attempting to load
                if (this.config.model && this.config.model.url) {
                    this.testModelURL(this.config.model.url).then(isAccessible => {
                        if (isAccessible) {
                            // URL is valid, proceed with loading
                            this.loadModel();
                        } else {
                            // URL is not accessible, show notification
                            this.showNotification("Model URL Error", 
                                "The 3D model URL is not accessible. Please check your config.js file.", 
                                "error");
                            
                            // Create placeholder geometry
                            const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
                            const material = new THREE.MeshStandardMaterial({ 
                                color: this.config.theme.accentColor,
                                metalness: 0.5,
                                roughness: 0.5
                            });
                            const tempModel = new THREE.Mesh(geometry, material);
                            this.three.scene.add(tempModel);
                            this.three.model = tempModel;
                        }
                    });
                } else {
                    console.warn("No model URL configured.");
                    // Create placeholder since no model URL was provided
                    const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
                    const material = new THREE.MeshStandardMaterial({ 
                        color: this.config.theme.accentColor,
                        metalness: 0.5,
                        roughness: 0.5
                    });
                    const tempModel = new THREE.Mesh(geometry, material);
                    this.three.scene.add(tempModel);
                    this.three.model = tempModel;
                }
                
                // Start the render loop
                this.animate();
                
            } catch (error) {
                console.error('Error initializing 3D scene:', error);
                this.showNotification('Error', 'Could not initialize 3D scene: ' + error.message, 'error');
                
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
                
                this.state.isAppInitialized = true;
            }, 15000);
            
            // Set up audio
            this.setupAudio();
            
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
        
        loadModel: function() {
    const self = this;
    
    console.log('Loading model from:', this.config.model.url);
    
    // Create a simple fallback object while loading
    const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
    const material = new THREE.MeshStandardMaterial({ 
        color: this.config.theme.accentColor,
        metalness: 0.5,
        roughness: 0.5
    });
    const tempModel = new THREE.Mesh(geometry, material);
    this.three.scene.add(tempModel);
    this.three.model = tempModel;
    
    // Skip if no URL provided
    if (!this.config.model.url) {
        console.log('No model URL specified. Using placeholder model.');
        this.showNotification('Configuration', 'No model URL specified.');
        return;
    }
    
    try {
        const loader = new GLTFLoader();
        
        // Set up DRACOLoader for compressed models
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        loader.setDRACOLoader(dracoLoader);
        
        // Add better error handling
        loader.load(
            this.config.model.url,
            
            // Success callback
            (gltf) => {
                console.log('Model loaded successfully!', gltf);
                
                // Remove the placeholder model
                this.three.scene.remove(tempModel);
                
                // Add the loaded model to the scene
                this.three.model = gltf.scene;
                this.three.scene.add(gltf.scene);
                
                // Apply scale
                gltf.scene.scale.set(
                    this.config.model.scale,
                    this.config.model.scale,
                    this.config.model.scale
                );
                
                // Center the model
                const box = new THREE.Box3().setFromObject(gltf.scene);
                const center = box.getCenter(new THREE.Vector3());
                gltf.scene.position.x = -center.x;
                gltf.scene.position.y = -center.y;
                gltf.scene.position.z = -center.z;
                
                // Enable shadows and improve materials
                gltf.scene.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        
                        if (node.material) {
                            // Enhance materials for religious aesthetic
                            node.material.metalness = 0.3;
                            node.material.roughness = 0.7;
                            
                            // Add emissive color for beads
                            if (node.name.toLowerCase().includes('bead')) {
                                node.material.emissive = new THREE.Color(this.config.theme.accentColor);
                                node.material.emissiveIntensity = 0.1;
                            }
                            
                            node.material.needsUpdate = true;
                        }
                    }
                });
                
                this.state.isModelLoaded = true;
                this.showNotification('Success', 'Sacred Rosary model loaded successfully!');
                
                // Animate the model for a nice reveal
                gsap.from(gltf.scene.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 1.5,
                    ease: "back.out(1.7)"
                });
            },
            
            // Progress callback
            (xhr) => {
                if (xhr.lengthComputable) {
                    const percentComplete = (xhr.loaded / xhr.total) * 100;
                    console.log('Model loading: ' + Math.round(percentComplete) + '% complete');
                    if (this.elements.loadingBar) {
                        this.elements.loadingBar.style.width = `${percentComplete}%`;
                    }
                }
            },
            
            // Error callback
            (error) => {
                console.error('Error loading model:', error);
                
                // Provide specific error messages
                let errorMessage = 'Failed to load the Sacred Rosary model.';
                
                if (error.message.includes('CORS')) {
                    errorMessage += ' This might be a CORS issue.';
                } else if (error.message.includes('404')) {
                    errorMessage += ' The model file was not found.';
                } else if (error.message.includes('Failed to parse GLB')) {
                    errorMessage += ' The model file might be corrupted.';
                }
                
                this.showNotification('Error', errorMessage, 'error');
                
                // Keep the placeholder model visible since loading failed
                console.log('Using placeholder model instead');
                this.state.isModelLoaded = false;
            }
        );
    } catch (error) {
        console.error('Error in model loading process:', error);
        this.showNotification('Error', 'Model loading error: ' + error.message, 'error');
    }
}
        
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
