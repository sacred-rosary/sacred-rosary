// Sacred Rosary - Main Application
document.addEventListener('DOMContentLoaded', function() {
    
    //================================================================================
    // 3D Rosary Module
    //================================================================================
    const Rosary3D = {
        scene: null, camera: null, renderer: null, controls: null,
        rosaryGroup: null, beads: [], materials: {}, beadMap: [],

        init: function() {
            if (typeof THREE === 'undefined') {
                console.error("THREE.js is not loaded.");
                return;
            }

            const container = document.getElementById('model-container');
            if (!container) return;

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(0, 0, 30);
            this.scene.add(this.camera);

            const canvas = document.getElementById('model-canvas');
            this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            this.scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
            directionalLight.position.set(10, 10, 10);
            this.scene.add(directionalLight);

            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;

            this.createMaterials();
            this.createRosary();

            window.addEventListener('resize', this.onWindowResize.bind(this));
            this.animate();
        },

        createMaterials: function() {
            this.materials.hailMaryBead = new THREE.MeshStandardMaterial({ color: 0x8B6C42, roughness: 0.4, metalness: 0.1 });
            this.materials.ourFatherBead = new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.3, metalness: 0.2 });
            this.materials.crucifix = new THREE.MeshStandardMaterial({ color: 0xCD7F32, roughness: 0.2, metalness: 0.8 });
            this.materials.highlighted = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xffee00, emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.5 });
        },

        createRosary: function() {
            this.rosaryGroup = new THREE.Group();
            this.beads = [];

            // Helper to create a bead
            const createBead = (material, size = 0.3) => {
                const geometry = new THREE.SphereGeometry(size, 32, 32);
                const bead = new THREE.Mesh(geometry, material);
                bead.originalMaterial = material;
                this.rosaryGroup.add(bead);
                return bead;
            };

            // Create crucifix
            const crucifixGroup = new THREE.Group();
            const vertGeo = new THREE.BoxGeometry(0.2, 2.5, 0.2);
            const horizGeo = new THREE.BoxGeometry(1.5, 0.2, 0.2);
            const vertBar = new THREE.Mesh(vertGeo, this.materials.crucifix);
            const horizBar = new THREE.Mesh(horizGeo, this.materials.crucifix);
            horizBar.position.y = 0.5;
            crucifixGroup.add(vertBar, horizBar);
            crucifixGroup.position.set(0, -10, 0);
            crucifixGroup.originalMaterial = this.materials.crucifix;
            this.rosaryGroup.add(crucifixGroup);
            
            // Create pendant beads
            const p_of_bead = createBead(this.materials.ourFatherBead, 0.5);
            p_of_bead.position.set(0, -7.5, 0);
            const p_hm_bead1 = createBead(this.materials.hailMaryBead);
            p_hm_bead1.position.set(0, -6.5, 0);
            const p_hm_bead2 = createBead(this.materials.hailMaryBead);
            p_hm_bead2.position.set(0, -5.5, 0);
            const p_hm_bead3 = createBead(this.materials.hailMaryBead);
            p_hm_bead3.position.set(0, -4.5, 0);
            
            const radius = 10;
            const decadeBeads = [];
            for (let d = 0; d < 5; d++) {
                const decadeStartAngle = (d / 5) * Math.PI * 2;
                // Decade Our Father Bead
                const x_of = Math.cos(decadeStartAngle) * radius;
                const y_of = Math.sin(decadeStartAngle) * radius;
                const of_bead = createBead(this.materials.ourFatherBead, 0.5);
                of_bead.position.set(x_of, y_of, 0);
                decadeBeads.push(of_bead);

                // Decade Hail Mary Beads
                for (let i = 1; i <= 10; i++) {
                    const angle = decadeStartAngle + (i / 11) * (Math.PI * 2 / 5);
                    const x_hm = Math.cos(angle) * radius;
                    const y_hm = Math.sin(angle) * radius;
                    const hm_bead = createBead(this.materials.hailMaryBead);
                    hm_bead.position.set(x_hm, y_hm, 0);
                    decadeBeads.push(hm_bead);
                }
            }
            
            // This specific order maps to the prayer sequence
            this.beads.push(crucifixGroup);  // 0: Apostles Creed
            this.beads.push(p_of_bead);       // 1: Our Father
            this.beads.push(p_hm_bead1);      // 2: Hail Mary
            this.beads.push(p_hm_bead2);      // 3: Hail Mary
            this.beads.push(p_hm_bead3);      // 4: Hail Mary
            // Glory be is on the last HM bead
            
            // Add decade beads to the main list
            this.beads.push(...decadeBeads);

            // Create bead map for prayers
            this.beadMap = [
                0, // Apostles' Creed
                1, // Our Father
                2, 3, 4, // 3 Hail Marys
                4, // Glory Be (on last HM bead)
            ];
            let currentBead = 5;
            for (let d = 0; d < 5; d++) {
                this.beadMap.push(currentBead); // Mystery Announcement
                this.beadMap.push(currentBead++); // Our Father
                for (let i = 0; i < 10; i++) {
                    this.beadMap.push(currentBead++); // 10 Hail Marys
                }
                this.beadMap.push(currentBead - 1); // Glory Be
                this.beadMap.push(currentBead - 1); // Fatima Prayer
            }

            this.scene.add(this.rosaryGroup);
            this.rosaryGroup.position.y = 5; // Center the rosary visually
        },

        highlightBead: function(index) {
            this.beads.forEach(bead => {
                if (bead.originalMaterial) {
                    const material = bead.originalMaterial;
                    if (bead.isGroup) bead.children.forEach(c => c.material = material);
                    else bead.material = material;
                }
            });

            if (index >= 0 && index < this.beads.length) {
                const bead = this.beads[index];
                if (bead) {
                    if (bead.isGroup) bead.children.forEach(c => c.material = this.materials.highlighted);
                    else bead.material = this.materials.highlighted;
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
            if (container) {
                this.camera.aspect = container.clientWidth / container.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(container.clientWidth, container.clientHeight);
            }
        },
        
        focusOnBead: function(index) {
            if (index >= 0 && index < this.beads.length) {
                const targetBead = this.beads[index];
                const targetPosition = new THREE.Vector3();
                targetBead.getWorldPosition(targetPosition);

                gsap.to(this.camera.position, { duration: 1.5, x: targetPosition.x, y: targetPosition.y, z: targetPosition.z + 10, ease: "power2.inOut" });
                gsap.to(this.controls.target, { duration: 1.5, x: targetPosition.x, y: targetPosition.y, z: targetPosition.z, ease: "power2.inOut" });
            }
        },

        zoomToShowAll: function() {
            gsap.to(this.camera.position, { duration: 2, x: 0, y: 5, z: 35, ease: "power2.inOut" });
            gsap.to(this.controls.target, { duration: 2, x: 0, y: 0, z: 0, ease: "power2.inOut" });
        }
    };
    
    //================================================================================
    // Main Application Object
    //================================================================================
    const SacredRosary = {
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
        },
        
        elements: {},
        
        audio: {
            backgroundMusic: null,
            prayerAudio: null,
            effects: {},
        },
        
        init: function() {
            console.log("Initializing Sacred Rosary Application");
            
            this.registerDOMElements();
            this.loadUserSettings();
            this.checkMourningPeriod();
            this.applyTheme(this.config.display.theme);
            this.setupEventListeners();
            this.setLanguage(this.config.language.default);
            this.loadAssets();
            
            Rosary3D.init();
            
            window.SacredRosary = this;
        },
        
        registerDOMElements: function() {
            try {
                this.elements = {
                    appContainer: document.querySelector('.app-container'),
                    loadingOverlay: document.querySelector('.loading-overlay'),
                    loadingBar: document.querySelector('.loading-bar'),
                    landingPage: document.querySelector('.landing-page'),
                    mainContent: document.querySelector('.main-content'),
                    prayerSection: document.querySelector('.prayer-section'),
                    modelSection: document.querySelector('.model-section'),
                    modelContainer: document.getElementById('model-container'),
                    modelCanvas: document.getElementById('model-canvas'),
                    backgroundEffects: document.querySelector('.background-effects'),
                    candleOverlay: document.querySelector('.candle-overlay'),
                    lightRays: document.querySelector('.light-rays'),
                    particlesContainer: document.querySelector('.particles-container'),
                    prayerScroll: document.querySelector('.prayer-scroll'),
                    prayerTitle: document.querySelector('.prayer-title'),
                    prayerInstructions: document.querySelector('.prayer-instructions'),
                    prayerText: document.querySelector('.prayer-text'),
                    progressTitle: document.querySelector('.progress-title'),
                    progressBar: document.querySelector('.progress-fill'),
                    progressText: document.querySelector('.progress-text'),
                    currentPrayerType: document.querySelector('.current-prayer-type'),
                    prayerIcon: document.querySelector('.prayer-icon'),
                    prayerName: document.querySelector('.prayer-name'),
                    prayerControls: document.querySelector('.prayer-controls'),
                    prevBtn: document.querySelector('.prev-btn'),
                    playBtn: document.querySelector('.play-btn'),
                    nextBtn: document.querySelector('.next-btn'),
                    mysteryInfo: document.getElementById('mystery-info'),
                    languageBtns: document.querySelectorAll('.language-btn'),
                    mysteryBtns: document.querySelectorAll('.mystery-btn'),
                    startBtn: document.querySelector('.start-btn'),
                    notification: document.querySelector('.notification'),
                    notificationTitle: document.querySelector('.notification-title'),
                    notificationMessage: document.querySelector('.notification-message'),
                    notificationClose: document.querySelector('.notification-close'),
                    settingsPanel: document.getElementById('settings-panel'),
                    prayerSettingsBtn: document.getElementById('prayer-settings-btn'),
                    settingsCloseBtn: document.getElementById('settings-close-btn'),
                    settingsSaveBtn: document.getElementById('settings-save-btn'),
                    settingsResetBtn: document.getElementById('settings-reset-btn'),
                    themeSelect: document.getElementById('theme-select'),
                    bgMusicToggle: document.getElementById('bg-music-toggle'),
                    bgMusicVolume: document.getElementById('bg-music-volume'),
                    bgMusicVolumeValue: document.getElementById('bg-music-volume-value'),
                    effectsToggle: document.getElementById('effects-toggle'),
                    meditationDuration: document.getElementById('meditation-duration'),
                    mourningAnnouncement: document.getElementById('mourning-announcement'),
                    mourningCloseBtn: document.getElementById('mourning-close-btn'),
                };
            } catch (error) {
                console.error('Error registering DOM elements:', error);
            }
        },
        
        applyTheme: function(themeName) { /* Your existing code */ },
        setupEventListeners: function() { /* Your existing code */ },
        checkMourningPeriod: function() { /* Your existing code */ },
        toggleSettings: function(show) { /* Your existing code */ },
        updateSettingsUI: function() { /* Your existing code */ },
        saveSettings: function() { /* Your existing code */ },
        resetSettings: function() { /* Your existing code */ },
        loadUserSettings: function() { /* Your existing code */ },
        setLanguage: function(languageCode) { /* Your existing code */ },
        updateMysteryButtonLabels: function() { /* Your existing code */ },
        
        loadAssets: function() {
            const loadingTimeout = setTimeout(() => {
                console.warn("Loading timeout. Forcing completion.");
                this.hideLoadingOverlay();
            }, 10000);

            this.setupAudio();

            this.elements.loadingBar.style.width = '100%';
            setTimeout(() => {
                clearTimeout(loadingTimeout);
                this.hideLoadingOverlay();
            }, 500);
        },

        hideLoadingOverlay: function() {
            if (this.elements.loadingOverlay) {
                this.elements.loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    this.elements.loadingOverlay.style.display = 'none';
                }, 800);
            }
        },
        
        setupAudio: function() {
            if (typeof Howl === 'undefined') {
                console.warn('Howler.js not loaded. Audio features disabled.');
                return;
            }
            if (this.config.audio.backgroundMusic.enabled && this.config.audio.backgroundMusic.src) {
                this.audio.backgroundMusic = new Howl({
                    src: [this.config.audio.backgroundMusic.src],
                    loop: true, volume: this.config.audio.backgroundMusic.volume,
                });
            }
            this.setupEffectSounds();
        },

        setupEffectSounds: function() {
            if (!this.config.audio.effects.enabled) return;
            try {
                this.audio.effects.click = new Howl({ src: ['assets/audio/effects/click.mp3'], volume: this.config.audio.effects.volume });
                this.audio.effects.transition = new Howl({ src: ['assets/audio/effects/transition.mp3'], volume: this.config.audio.effects.volume });
            } catch (e) { console.error("Could not setup effect sounds", e); }
        },
        
        createRosarySequence: function() {
            const sequence = [];
            
            // Opening Prayers
            sequence.push({prayer: 'signOfCross', type: 'prayer'});
            sequence.push({prayer: 'apostlesCreed', type: 'prayer'});
            sequence.push({prayer: 'ourFather', type: 'prayer'});
            for (let i = 0; i < 3; i++) sequence.push({prayer: 'hailMary', type: 'prayer'});
            sequence.push({prayer: 'gloryBe', type: 'prayer'});
            
            // Decades
            for (let d = 0; d < 5; d++) {
                sequence.push({type: 'mystery', mysteryIndex: d});
                sequence.push({prayer: 'ourFather', type: 'prayer'});
                for (let b = 0; b < 10; b++) sequence.push({prayer: 'hailMary', type: 'prayer'});
                sequence.push({prayer: 'gloryBe', type: 'prayer'});
                sequence.push({prayer: 'fatimaPrayer', type: 'prayer'});
            }
            
            // Closing
            sequence.push({prayer: 'hailHolyQueen', type: 'prayer'});
            sequence.push({prayer: 'finalPrayer', type: 'prayer'});
            sequence.push({prayer: 'signOfCross', type: 'prayer'});
            
            this.state.rosarySequence = sequence;
            this.state.totalPrayers = sequence.length;
        },
        
        startRosary: function() {
            this.createRosarySequence();
            this.state.currentPrayerIndex = 0;
            
            this.elements.landingPage.style.opacity = '0';
            this.elements.landingPage.style.transform = 'translateY(-20px)';
            
            if (this.audio.effects.transition) this.audio.effects.transition.play();
            if (this.audio.backgroundMusic) this.audio.backgroundMusic.play();

            setTimeout(() => {
                this.elements.landingPage.style.display = 'none';
                this.elements.mainContent.style.display = 'flex';
                Rosary3D.onWindowResize();
                
                this.state.isPlaying = true;
                this.elements.playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                
                this.updatePrayerDisplay();
                //this.startPrayerTimer();
            }, this.config.theme.animations.transitionSpeed);
        },
        
        updatePrayerDisplay: function() {
            const prayerIndex = this.state.currentPrayerIndex;
            const currentItem = this.state.rosarySequence[prayerIndex];
            
            const beadIndex = Rosary3D.beadMap[prayerIndex];
            
            if (beadIndex !== undefined) {
                Rosary3D.highlightBead(beadIndex);
                Rosary3D.focusOnBead(beadIndex);
            } else {
                Rosary3D.highlightBead(-1);
                Rosary3D.zoomToShowAll();
            }

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
                    let content = `<p>${mystery.description}</p><p class="scripture">${mystery.scripture}</p><p class="fruits">${mystery.fruits}</p>`;
                    this.elements.prayerText.innerHTML = content;
                    
                    this.elements.mysteryInfo.querySelector('.mystery-title').textContent = mystery.title;
                    this.elements.mysteryInfo.querySelector('.mystery-description').textContent = mystery.description;
                    this.elements.mysteryInfo.querySelector('.mystery-fruits').textContent = mystery.fruits;
                    this.elements.mysteryInfo.classList.add('visible');
                    
                    this.updatePrayerTypeIndicator('mystery');
                }

                this.updateProgressIndicators();
                this.elements.prayerScroll.style.opacity = '1';
                
                if (this.state.isPlaying) {
                    this.startPrayerTimer();
                }
            }, 300);
        },
        
        startPrayerTimer: function() { /* Your existing code */ },
        updatePrayerTypeIndicator: function(prayerType) { /* Your existing code */ },
        updateProgressIndicators: function() { /* Your existing code */ },
        nextPrayer: function() { /* Your existing code */ },
        prevPrayer: function() { /* Your existing code */ },
        togglePlay: function() { /* Your existing code */ },
        showNotification: function(title, message, type = 'info') { /* Your existing code */ },
        hideNotification: function() { /* Your existing code */ },
    };

    // Copying over the smaller, unchanged methods for completeness.
    // You should have these in your file already.
    Object.assign(SacredRosary, {
        applyTheme: function(themeName) {
            if (this.state.inMourningPeriod && this.config.admin?.mourning?.overrideUserTheme) themeName = 'mourning';
            if (!themeName) themeName = 'default';
            document.body.className = `theme-${themeName}`;
            const theme = this.config.theme.presets[themeName] || this.config.theme.presets.default;
            for (const key in theme) {
                document.documentElement.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, theme[key]);
            }
            if (this.elements.themeSelect) {
                this.elements.themeSelect.value = themeName;
                this.elements.themeSelect.disabled = this.state.inMourningPeriod;
            }
            if (!this.state.inMourningPeriod) this.config.display.theme = themeName;
        },
        setupEventListeners: function() {
            this.elements.startBtn.addEventListener('click', () => this.startRosary());
            this.elements.prevBtn.addEventListener('click', () => this.prevPrayer());
            this.elements.nextBtn.addEventListener('click', () => this.nextPrayer());
            this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        },
        startPrayerTimer: function() { if (!this.state.isPlaying) return; clearTimeout(this.prayerTimer); this.prayerTimer = setTimeout(() => { if (this.state.isPlaying) this.nextPrayer(); }, 5000) },
        updatePrayerTypeIndicator: function(type) { this.elements.prayerName.textContent = type; },
        updateProgressIndicators: function() {
            const progress = ((this.state.currentPrayerIndex + 1) / this.state.totalPrayers) * 100;
            this.elements.progressBar.style.width = `${progress}%`;
            this.elements.progressText.textContent = `Prayer ${this.state.currentPrayerIndex + 1} of ${this.state.totalPrayers}`;
        },
        nextPrayer: function() { if (this.state.currentPrayerIndex < this.state.rosarySequence.length - 1) { this.state.currentPrayerIndex++; this.updatePrayerDisplay(); } },
        prevPrayer: function() { if (this.state.currentPrayerIndex > 0) { this.state.currentPrayerIndex--; this.updatePrayerDisplay(); } },
        togglePlay: function() {
            this.state.isPlaying = !this.state.isPlaying;
            this.elements.playBtn.innerHTML = this.state.isPlaying ? '<i class="fas fa-pause"></i> Pause' : '<i class="fas fa-play"></i> Play';
            if (this.state.isPlaying) this.startPrayerTimer(); else clearTimeout(this.prayerTimer);
        },
        setLanguage: function(lang) { this.state.activeLanguage = lang; this.state.prayerData = lang === 'es' ? PRAYERS_ES : PRAYERS_EN; this.state.mysteryData = lang === 'es' ? MYSTERIES_ES : MYSTERIES_EN; }
    });
    
    SacredRosary.init();
});
