// Sacred Rosary - Main Application
document.addEventListener('DOMContentLoaded', function() {
    
    //================================================================================
    // 3D Rosary Module
    //================================================================================
    const Rosary3D = {
        // three.js objects
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        
        // Rosary objects
        rosaryGroup: null, // A group to hold all parts of the rosary
        beads: [],         // An array to hold all the bead meshes
        
        // Materials
        materials: {},

        init: function() {
            if (typeof THREE === 'undefined') {
                console.error("THREE.js is not loaded. 3D Rosary cannot be initialized.");
                return;
            }

            const container = document.getElementById('model-container');
            if (!container) return;

            // Scene
            this.scene = new THREE.Scene();

            // Camera
            this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(0, 0, 30);
            this.scene.add(this.camera);

            // Renderer
            const canvas = document.getElementById('model-canvas');
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                alpha: true,
                antialias: true 
            });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            this.scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
            directionalLight.position.set(10, 10, 10);
            this.scene.add(directionalLight);

            // Controls
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 5;
            this.controls.maxDistance = 50;

            // Materials
            this.createMaterials();
            
            // Create Rosary
            this.createRosary();

            // Handle window resize
            window.addEventListener('resize', this.onWindowResize.bind(this));
            
            // Start animation loop
            this.animate();
        },

        createMaterials: function() {
            const textureLoader = new THREE.TextureLoader();
            // You can find beautiful wood textures online from sites like ambientCG.com (CC0 license)
            // Example: const woodTexture = textureLoader.load('path/to/your/wood_texture.jpg');

            this.materials.hailMaryBead = new THREE.MeshStandardMaterial({
                color: 0x8B6C42, // Brown
                roughness: 0.4,
                metalness: 0.1,
            });
            
            this.materials.ourFatherBead = new THREE.MeshStandardMaterial({
                color: 0xD2B48C, // Tan
                roughness: 0.3,
                metalness: 0.2,
            });

            this.materials.crucifix = new THREE.MeshStandardMaterial({
                color: 0xCD7F32, // Bronze
                roughness: 0.2,
                metalness: 0.8,
            });
            
            this.materials.highlighted = new THREE.MeshStandardMaterial({
                color: 0xFFD700, // Gold
                emissive: 0xffee00,
                emissiveIntensity: 0.6,
                roughness: 0.1,
                metalness: 0.5,
            });
        },

        createRosary: function() {
            this.rosaryGroup = new THREE.Group();
            this.beads = []; // Clear previous beads

            const radius = 10; // Radius of the main loop
            const numDecades = 5;
            const beadsPerDecade = 10;

            // Create the decades
            for (let d = 0; d < numDecades; d++) {
                // Our Father bead for the decade
                const angleOF = (d / numDecades) * Math.PI * 2;
                const xOF = Math.cos(angleOF) * radius;
                const yOF = Math.sin(angleOF) * radius;
                const ourFatherBead = this.createBead(this.materials.ourFatherBead, 0.5);
                ourFatherBead.position.set(xOF, yOF, 0);
                this.rosaryGroup.add(ourFatherBead);
                this.beads.push(ourFatherBead);

                // Hail Mary beads for the decade
                for (let i = 1; i <= beadsPerDecade; i++) {
                    const angleHM = angleOF + (i / (beadsPerDecade + 1)) * ((Math.PI * 2) / numDecades);
                    const xHM = Math.cos(angleHM) * radius;
                    const yHM = Math.sin(angleHM) * radius;
                    const hailMaryBead = this.createBead(this.materials.hailMaryBead);
                    hailMaryBead.position.set(xHM, yHM, 0);
                    this.rosaryGroup.add(hailMaryBead);
                    this.beads.push(hailMaryBead);
                }
            }

            // Create the pendant chain
            const pendantBeads = [
                { pos: [0, -radius - 2, 0], mat: this.materials.ourFatherBead, size: 0.5 },
                { pos: [0, -radius - 3.5, 0], mat: this.materials.hailMaryBead },
                { pos: [0, -radius - 4.5, 0], mat: this.materials.hailMaryBead },
                { pos: [0, -radius - 5.5, 0], mat: this.materials.hailMaryBead },
                { pos: [0, -radius - 7, 0], mat: this.materials.ourFatherBead, size: 0.5 },
            ];

            pendantBeads.forEach(beadInfo => {
                const bead = this.createBead(beadInfo.mat, beadInfo.size);
                bead.position.fromArray(beadInfo.pos);
                this.rosaryGroup.add(bead);
                this.beads.push(bead);
            });
            
            // Create a simple Crucifix
            const crucifix = this.createCrucifix();
            crucifix.position.set(0, -radius - 9.5, 0);
            this.rosaryGroup.add(crucifix);
            this.beads.push(crucifix);

            // Reorder beads to match prayer sequence
            this.reorderBeadsForPrayer();

            this.scene.add(this.rosaryGroup);
        },

        createBead: function(material, size = 0.3) {
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const bead = new THREE.Mesh(geometry, material);
            bead.originalMaterial = material;
            return bead;
        },

        createCrucifix: function() {
            const group = new THREE.Group();
            const verticalGeo = new THREE.BoxGeometry(0.2, 2.5, 0.2);
            const horizontalGeo = new THREE.BoxGeometry(1.5, 0.2, 0.2);
            
            const verticalBar = new THREE.Mesh(verticalGeo, this.materials.crucifix);
            const horizontalBar = new THREE.Mesh(horizontalGeo, this.materials.crucifix);
            horizontalBar.position.y = 0.5;
            
            group.add(verticalBar);
            group.add(horizontalBar);
            group.originalMaterial = this.materials.crucifix;

            return group;
        },

        reorderBeadsForPrayer: function() {
            // This method reorders the this.beads array to match the prayer flow
            const crucifix = this.beads[this.beads.length - 1];
            const pendantOurFather = this.beads[this.beads.length - 2];
            const threeHailMarys = this.beads.slice(this.beads.length - 5, this.beads.length - 2);
            const firstOurFather = this.beads[this.beads.length - 6];
            
            const decadeGroups = [];
            for (let i = 0; i < 5; i++) {
                decadeGroups.push(this.beads.slice(i * 11, i * 11 + 11));
            }
            
            let prayerOrderBeads = [
                crucifix,           // Apostles Creed (on the crucifix)
                pendantOurFather,   // First Our Father
                ...threeHailMarys,  // 3 Hail Marys
                firstOurFather,     // Glory Be (on the first large bead)
            ];
            
            // This is a simplified mapping. A more precise one is needed.
            // For now, let's map decades sequentially.
            decadeGroups.forEach(group => {
                prayerOrderBeads.push(group[0]); // Our Father
                prayerOrderBeads.push(...group.slice(1)); // 10 Hail Marys
            });

            this.beads = prayerOrderBeads;
        },

        highlightBead: function(index) {
            // Reset all beads to original material
            this.beads.forEach(bead => {
                if (bead.originalMaterial) {
                    if (bead.isGroup) { // Handle crucifix
                        bead.children.forEach(child => child.material = bead.originalMaterial);
                    } else {
                        bead.material = bead.originalMaterial;
                    }
                }
            });

            // Highlight the current bead
            if (index >= 0 && index < this.beads.length) {
                const bead = this.beads[index];
                if (bead) {
                     if (bead.isGroup) { // Handle crucifix
                        bead.children.forEach(child => child.material = this.materials.highlighted);
                    } else {
                        bead.material = this.materials.highlighted;
                    }
                }
            }
        },

        animate: function() {
            requestAnimationFrame(this.animate.bind(this));
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        },

        onWindowResize: function() {
            const container = document.getElementById('model-container');
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        },
        
        // Camera Animations
        focusOnBead: function(index) {
            if (index >= 0 && index < this.beads.length) {
                const targetBead = this.beads[index];
                const targetPosition = new THREE.Vector3();
                targetBead.getWorldPosition(targetPosition);

                // Animate camera to look at the bead
                gsap.to(this.camera.position, {
                    duration: 1.5,
                    x: targetPosition.x,
                    y: targetPosition.y,
                    z: targetPosition.z + 10, // Zoom in closer
                    ease: "power2.inOut"
                });

                gsap.to(this.controls.target, {
                    duration: 1.5,
                    x: targetPosition.x,
                    y: targetPosition.y,
                    z: targetPosition.z,
                    ease: "power2.inOut"
                });
            }
        },

        zoomToShowAll: function() {
             gsap.to(this.camera.position, {
                duration: 2,
                x: 0,
                y: 0,
                z: 30, // Zoom out
                ease: "power2.inOut"
            });
            gsap.to(this.controls.target, {
                duration: 2,
                x: 0,
                y: 0,
                z: 0,
                ease: "power2.inOut"
            });
        }
    };
    
    //================================================================================
    // Main Application Object
    //================================================================================
    const SacredRosary = {
        // ... (The rest of your existing SacredRosary object)
        // NOTE: I will only list the modified/new parts to add.
        
        config: ROSARY_CONFIG,
        
        state: {
            currentPrayerIndex: 0,
            currentMysteryType: 'joyful',
            isPlaying: true,
            isAppInitialized: false,
            activeLanguage: 'en',
            loadingProgress: 0,
            prayerData: null,
            mysteryData: null,
            rosarySequence: [],
            totalPrayers: 0,
            settingsVisible: false,
            inMourningPeriod: false,
            beadMap: [], // New state to map prayer index to bead index
        },
        
        elements: {},
        audio: { /* ... */ },

        init: function() {
            console.log("Initializing Sacred Rosary Application");
            
            this.registerDOMElements();
            this.loadUserSettings();
            this.checkMourningPeriod();
            this.applyTheme(this.config.display.theme);
            this.setupEventListeners();
            this.setLanguage(this.config.language.default);
            this.loadAssets();

            // Initialize the 3D Rosary
            Rosary3D.init();
            
            window.SacredRosary = this;
        },
        
        registerDOMElements: function() {
            try {
                // Main sections
                this.elements.appContainer = document.querySelector('.app-container');
                this.elements.loadingOverlay = document.querySelector('.loading-overlay');
                this.elements.loadingBar = document.querySelector('.loading-bar');
                this.elements.landingPage = document.querySelector('.landing-page');
                this.elements.mainContent = document.querySelector('.main-content');
                this.elements.prayerSection = document.querySelector('.prayer-section');
                
                // NEW: model section elements
                this.elements.modelSection = document.querySelector('.model-section');
                this.elements.modelContainer = document.getElementById('model-container');
                this.elements.modelCanvas = document.getElementById('model-canvas');

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
                this.elements.mysteryInfo = document.getElementById('mystery-info');
                
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
                this.elements.prayerSettingsBtn = document.getElementById('prayer-settings-btn');
                this.elements.settingsCloseBtn = document.getElementById('settings-close-btn');
                this.elements.settingsSaveBtn = document.getElementById('settings-save-btn');
                this.elements.settingsResetBtn = document.getElementById('settings-reset-btn');
                
                // Settings inputs
                this.elements.themeSelect = document.getElementById('theme-select');
                this.elements.bgMusicToggle = document.getElementById('bg-music-toggle');
                this.elements.bgMusicVolume = document.getElementById('bg-music-volume');
                this.elements.bgMusicVolumeValue = document.getElementById('bg-music-volume-value');
                this.elements.effectsToggle = document.getElementById('effects-toggle');
                this.elements.meditationDuration = document.getElementById('meditation-duration');
                
                // Mourning elements
                this.elements.mourningAnnouncement = document.getElementById('mourning-announcement');
                this.elements.mourningCloseBtn = document.getElementById('mourning-close-btn');
            } catch (error) {
                console.error('Error registering DOM elements:', error);
            }
        },

        createRosarySequence: function() {
            const sequence = [];
            const beadMap = []; // Maps prayer index to bead index in Rosary3D.beads
            let beadCounter = 0;

            // Simple mapping for this example. A more complex, accurate one would be better.
            const nextBead = () => beadCounter++;

            // Opening Prayers
            sequence.push({prayer: 'signOfCross', type: 'prayer', beadIndex: -1}); // No bead for sign of cross
            beadMap.push(-1); // Zoom all
            sequence.push({prayer: 'apostlesCreed', type: 'prayer', beadIndex: nextBead()});
            beadMap.push(beadMap.length - 1);
            sequence.push({prayer: 'ourFather', type: 'prayer', beadIndex: nextBead()});
            beadMap.push(beadMap.length - 1);
            for (let i = 0; i < 3; i++) {
                sequence.push({prayer: 'hailMary', type: 'prayer', beadIndex: nextBead()});
                beadMap.push(beadMap.length - 1);
            }
            sequence.push({prayer: 'gloryBe', type: 'prayer', beadIndex: nextBead()});
            beadMap.push(beadMap.length - 1);

            // Five decades
            for (let decade = 0; decade < 5; decade++) {
                sequence.push({ type: 'mystery', mysteryIndex: decade, beadIndex: beadCounter });
                beadMap.push(beadCounter);
                
                sequence.push({ prayer: 'ourFather', type: 'prayer', beadIndex: nextBead() });
                 beadMap.push(beadCounter-1);
                
                for (let bead = 0; bead < 10; bead++) {
                    sequence.push({ prayer: 'hailMary', type: 'prayer', beadIndex: nextBead() });
                     beadMap.push(beadCounter-1);
                }
                
                sequence.push({ prayer: 'gloryBe', type: 'prayer', beadIndex: beadCounter -1 }); // On last Hail Mary bead
                beadMap.push(beadCounter-1);
                sequence.push({ prayer: 'fatimaPrayer', type: 'prayer', beadIndex: beadCounter -1 }); // Also on last Hail Mary bead
                 beadMap.push(beadCounter-1);
            }

            // Concluding prayers
            sequence.push({prayer: 'hailHolyQueen', type: 'prayer', beadIndex: -1});
             beadMap.push(-1); // Zoom all
            sequence.push({prayer: 'finalPrayer', type: 'prayer', beadIndex: -1});
             beadMap.push(-1);
            sequence.push({prayer: 'signOfCross', type: 'prayer', beadIndex: -1});
             beadMap.push(-1);

            this.state.rosarySequence = sequence;
            this.state.totalPrayers = sequence.length;
            this.state.beadMap = beadMap; // Save the map
        },

        startRosary: function() {
            this.createRosarySequence();
            this.state.currentPrayerIndex = 0;
            
            this.elements.landingPage.style.opacity = '0';
            this.elements.landingPage.style.transform = 'translateY(-20px)';
            
            if (this.audio.effects.transition && this.config.audio.effects.enabled) {
                this.audio.effects.transition.play();
            }

            if (this.config.audio.backgroundMusic.enabled && this.audio.backgroundMusic) {
                this.audio.backgroundMusic.play();
            }

            setTimeout(() => {
                this.elements.landingPage.style.display = 'none';
                this.elements.mainContent.style.display = 'flex';
                Rosary3D.onWindowResize(); // Ensure 3D canvas is sized correctly
                
                this.state.isPlaying = true;
                this.elements.playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                
                this.updatePrayerDisplay();
                this.startPrayerTimer();
            }, this.config.theme.animations.transitionSpeed);
        },

        updatePrayerDisplay: function() {
            const prayerIndex = this.state.currentPrayerIndex;
            const currentItem = this.state.rosarySequence[prayerIndex];
            
            // Map the prayer index to the bead index
            const beadIndex = this.state.beadMap[prayerIndex];

            // Update 3D Rosary
            if (beadIndex !== -1) {
                Rosary3D.highlightBead(beadIndex);
                Rosary3D.focusOnBead(beadIndex);
            } else {
                Rosary3D.highlightBead(-1); // Un-highlight all
                Rosary3D.zoomToShowAll();
            }

            // Fade out current content
            this.elements.prayerScroll.style.opacity = '0';
            this.elements.mysteryInfo.classList.remove('visible');

            setTimeout(() => {
                if (currentItem.type === 'prayer') {
                    const prayer = this.state.prayerData[currentItem.prayer];
                    this.elements.prayerTitle.textContent = prayer.title;
                    this.elements.prayerInstructions.textContent = prayer.instructions;
                    this.elements.prayerText.innerHTML = `<p>${prayer.text}</p>`;
                    this.updatePrayerTypeIndicator(currentItem.prayer);
                } else if (currentItem.type === 'mystery') {
                    const mystery = this.state.mysteryData[this.state.currentMysteryType][currentItem.mysteryIndex];
                    this.elements.prayerTitle.textContent = mystery.title;
                    this.elements.prayerInstructions.textContent = 'Meditate on this mystery';
                    let content = `<p>${mystery.description}</p>`;
                    if (this.config.prayer.showScripture) {
                        content += `<p class="scripture">${mystery.scripture}</p>`;
                    }
                    content += `<p class="fruits">${mystery.fruits}</p>`;
                    this.elements.prayerText.innerHTML = content;
                    
                    // Update and show mystery info panel
                    this.elements.mysteryInfo.querySelector('.mystery-title').textContent = mystery.title;
                    this.elements.mysteryInfo.querySelector('.mystery-description').textContent = mystery.description;
                    this.elements.mysteryInfo.querySelector('.mystery-fruits').textContent = mystery.fruits;
                    this.elements.mysteryInfo.classList.add('visible');
                    
                    this.updatePrayerTypeIndicator('mystery');
                }

                this.updateProgressIndicators();
                
                // Fade in new content
                this.elements.prayerScroll.style.opacity = '1';
                
                if (this.state.isPlaying) {
                    this.startPrayerTimer();
                }
            }, 300);
        },
        
        // --- Add the rest of your existing SacredRosary object methods here ---
        // (No other changes are needed for the other methods)
        
        startPrayerTimer: function() {
            if (!this.state.isPlaying) return;
            
            const currentItem = this.state.rosarySequence[this.state.currentPrayerIndex];
            let duration = 5000;
            
            if (currentItem.type === 'prayer') {
                const prayer = this.state.prayerData[currentItem.prayer];
                duration = prayer.duration || 5000;
            } else if (currentItem.type === 'mystery') {
                const mystery = this.state.mysteryData[this.state.currentMysteryType][currentItem.mysteryIndex];
                duration = mystery.duration || 15000;
            }
            
            if (this.config.prayer.meditationDurations) {
                duration += this.config.prayer.meditationDurations[this.config.prayer.defaultMeditationDuration] || 0;
            }
            
            clearTimeout(this.prayerTimer);
            
            this.prayerTimer = setTimeout(() => {
                if (this.state.isPlaying) {
                    this.nextPrayer();
                }
            }, duration);
        },
        
        updatePrayerTypeIndicator: function(prayerType) {
            let icon = '';
            let name = '';
            
            switch (prayerType) {
                case 'signOfCross': icon = '<i class="fas fa-cross"></i>'; name = 'Sign of the Cross'; break;
                case 'apostlesCreed': icon = '<i class="fas fa-book"></i>'; name = 'Apostles\' Creed'; break;
                case 'ourFather': icon = '<i class="fas fa-hands-praying"></i>'; name = 'Our Father'; break;
                case 'hailMary': icon = '<i class="fas fa-heart"></i>'; name = 'Hail Mary'; break;
                case 'gloryBe': icon = '<i class="fas fa-sun"></i>'; name = 'Glory Be'; break;
                case 'fatimaPrayer': icon = '<i class="fas fa-pray"></i>'; name = 'Fatima Prayer'; break;
                case 'hailHolyQueen': icon = '<i class="fas fa-crown"></i>'; name = 'Hail, Holy Queen'; break;
                case 'finalPrayer': icon = '<i class="fas fa-dove"></i>'; name = 'Closing Prayer'; break;
                case 'mystery': icon = '<i class="fas fa-star"></i>'; name = 'Mystery'; break;
                default: icon = '<i class="fas fa-pray"></i>'; name = 'Prayer';
            }
            
            this.elements.prayerIcon.innerHTML = icon;
            this.elements.prayerName.textContent = name;
        },
        
        updateProgressIndicators: function() {
            const progress = ((this.state.currentPrayerIndex + 1) / this.state.totalPrayers) * 100;
            this.elements.progressBar.style.width = `${progress}%`;
            this.elements.progressText.textContent = `Prayer ${this.state.currentPrayerIndex + 1} of ${this.state.totalPrayers}`;
        },
        
        nextPrayer: function() {
            if (this.state.currentPrayerIndex < this.state.rosarySequence.length - 1) {
                if (this.audio.effects.click && this.config.audio.effects.enabled) this.audio.effects.click.play();
                clearTimeout(this.prayerTimer);
                this.state.currentPrayerIndex++;
                this.updatePrayerDisplay();
            } else {
                if (this.audio.effects.transition && this.config.audio.effects.enabled) this.audio.effects.transition.play();
                clearTimeout(this.prayerTimer);
                this.state.isPlaying = false;
                this.elements.playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
                this.showNotification('Rosary Complete', 'You have completed praying the rosary. God bless you!');
            }
        },
        
        prevPrayer: function() {
            if (this.state.currentPrayerIndex > 0) {
                if (this.audio.effects.click && this.config.audio.effects.enabled) this.audio.effects.click.play();
                clearTimeout(this.prayerTimer);
                this.state.currentPrayerIndex--;
                this.updatePrayerDisplay();
            }
        },
        
        togglePlay: function() {
            this.state.isPlaying = !this.state.isPlaying;
            if (this.state.isPlaying) {
                this.elements.playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                this.startPrayerTimer();
            } else {
                this.elements.playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
                clearTimeout(this.prayerTimer);
            }
        },
        
        showNotification: function(title, message, type = 'info') {
            this.elements.notificationTitle.textContent = title;
            this.elements.notificationMessage.textContent = message;
            this.elements.notification.className = 'notification';
            this.elements.notification.classList.add(`notification-${type}`, 'visible');
            setTimeout(() => this.hideNotification(), 4000);
        },
        
        hideNotification: function() {
            this.elements.notification.classList.remove('visible');
        },

        // All other methods like applyTheme, setupEventListeners, etc. should be copied from your original file.
        // The parts provided here are the only ones that need to be added or changed.
        applyTheme: function(themeName) {
            if (this.state.inMourningPeriod && this.config.admin?.mourning?.overrideUserTheme) {
                themeName = 'mourning';
            }
            if (!themeName) themeName = 'default';
            const root = document.documentElement;
            const body = document.body;
            body.className = `theme-${themeName}`;
            
            const theme = this.config.theme.presets[themeName] || this.config.theme.presets.default;
            Object.keys(theme).forEach(key => {
                root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, theme[key]);
            });
            
            if (this.elements.themeSelect) {
                this.elements.themeSelect.value = themeName;
                this.elements.themeSelect.disabled = this.state.inMourningPeriod;
            }
            if (!this.state.inMourningPeriod) {
                this.config.display.theme = themeName;
            }
        },
        
        setupEventListeners: function() {
            const self = this;
            this.elements.languageBtns.forEach(btn => btn.addEventListener('click', function() {
                if (this.classList.contains('disabled')) return;
                self.elements.languageBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                self.setLanguage(this.dataset.language);
            }));
            this.elements.mysteryBtns.forEach(btn => btn.addEventListener('click', function() {
                self.elements.mysteryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                self.state.currentMysteryType = this.dataset.mystery;
            }));
            this.elements.startBtn.addEventListener('click', () => self.startRosary());
            this.elements.prevBtn.addEventListener('click', () => self.prevPrayer());
            this.elements.nextBtn.addEventListener('click', () => self.nextPrayer());
            this.elements.playBtn.addEventListener('click', () => self.togglePlay());
            this.elements.notificationClose.addEventListener('click', () => self.hideNotification());
            if (this.elements.prayerSettingsBtn) this.elements.prayerSettingsBtn.addEventListener('click', () => self.toggleSettings());
            if (this.elements.settingsCloseBtn) this.elements.settingsCloseBtn.addEventListener('click', () => self.toggleSettings(false));
            if (this.elements.settingsSaveBtn) this.elements.settingsSaveBtn.addEventListener('click', () => self.saveSettings());
            if (this.elements.settingsResetBtn) this.elements.settingsResetBtn.addEventListener('click', () => self.resetSettings());
            if (this.elements.themeSelect) this.elements.themeSelect.addEventListener('change', function() { self.applyTheme(this.value); });
            if (this.elements.bgMusicToggle) this.elements.bgMusicToggle.addEventListener('change', function() {
                self.config.audio.backgroundMusic.enabled = this.checked;
                if (this.checked && self.audio.backgroundMusic) self.audio.backgroundMusic.play();
                else if (self.audio.backgroundMusic) self.audio.backgroundMusic.pause();
            });
            if (this.elements.bgMusicVolume) this.elements.bgMusicVolume.addEventListener('input', function() {
                const volume = this.value / 100;
                self.config.audio.backgroundMusic.volume = volume;
                if (self.audio.backgroundMusic) self.audio.backgroundMusic.volume(volume);
                self.elements.bgMusicVolumeValue.textContent = `${this.value}%`;
            });
            if (this.elements.effectsToggle) this.elements.effectsToggle.addEventListener('change', function() { self.config.audio.effects.enabled = this.checked; });
            if (this.elements.meditationDuration) this.elements.meditationDuration.addEventListener('change', function() { self.config.prayer.defaultMeditationDuration = this.value; });
            if (this.elements.mourningCloseBtn) this.elements.mourningCloseBtn.addEventListener('click', () => self.elements.mourningAnnouncement.classList.remove('visible'));
            window.addEventListener('resize', () => { if (Rosary3D) Rosary3D.onWindowResize(); });
        },

        checkMourningPeriod: function() { /* ... as before ... */ },
        toggleSettings: function(show) { this.elements.settingsPanel.classList.toggle('visible', show ?? !this.state.settingsVisible); this.state.settingsVisible = this.elements.settingsPanel.classList.contains('visible'); if(this.state.settingsVisible) this.updateSettingsUI(); },
        updateSettingsUI: function() { /* ... as before ... */ },
        saveSettings: function() { /* ... as before ... */ },
        resetSettings: function() { /* ... as before ... */ },
        loadUserSettings: function() { /* ... as before ... */ },
        setLanguage: function(lang) { /* ... as before ... */ },
        loadAssets: function() { /* ... as before ... */ },
        setupAudio: function() { /* ... as before ... */ },
        
    };

    // Initialize
    SacredRosary.init();
});
