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
            this.camera.position.set(0, 5, 35); // Adjusted starting camera position
            this.scene.add(this.camera);

            const canvas = document.getElementById('model-canvas');
            this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            this.scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
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
            this.materials.highlighted = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xffee00, emissiveIntensity: 0.7, roughness: 0.1, metalness: 0.5 });
        },

        createRosary: function() {
            this.rosaryGroup = new THREE.Group();
            this.beads = [];

            // Helper to create a bead
            const createBead = (material, size = 0.4) => {
                const geometry = new THREE.SphereGeometry(size, 32, 32);
                const bead = new THREE.Mesh(geometry, material);
                bead.originalMaterial = material;
                this.rosaryGroup.add(bead);
                return bead;
            };

            // Create crucifix
            const crucifixGroup = new THREE.Group();
            const vertGeo = new THREE.BoxGeometry(0.2, 3, 0.2);
            const horizGeo = new THREE.BoxGeometry(1.8, 0.2, 0.2);
            const vertBar = new THREE.Mesh(vertGeo, this.materials.crucifix);
            const horizBar = new THREE.Mesh(horizGeo, this.materials.crucifix);
            horizBar.position.y = 0.7;
            crucifixGroup.add(vertBar, horizBar);
            crucifixGroup.position.set(0, -11, 0);
            crucifixGroup.originalMaterial = this.materials.crucifix;
            this.rosaryGroup.add(crucifixGroup);
            
            // Create pendant beads
            const p_of_bead = createBead(this.materials.ourFatherBead, 0.6);
            p_of_bead.position.set(0, -8, 0);
            const p_hm_bead1 = createBead(this.materials.hailMaryBead);
            p_hm_bead1.position.set(0, -6.8, 0);
            const p_hm_bead2 = createBead(this.materials.hailMaryBead);
            p_hm_bead2.position.set(0, -5.6, 0);
            const p_hm_bead3 = createBead(this.materials.hailMaryBead);
            p_hm_bead3.position.set(0, -4.4, 0);
            
            const radius = 10;
            const decadeBeads = [];
            for (let d = 0; d < 5; d++) {
                const decadeStartAngle = (d / 5) * Math.PI * 2 + (Math.PI / 2); // Start at top
                const x_of = Math.cos(decadeStartAngle) * radius;
                const y_of = Math.sin(decadeStartAngle) * radius;
                const of_bead = createBead(this.materials.ourFatherBead, 0.6);
                of_bead.position.set(x_of, y_of, 0);
                decadeBeads.push(of_bead);

                for (let i = 1; i <= 10; i++) {
                    const angle = decadeStartAngle + (i / 11) * (Math.PI * 2 / 5);
                    const x_hm = Math.cos(angle) * radius;
                    const y_hm = Math.sin(angle) * radius;
                    const hm_bead = createBead(this.materials.hailMaryBead);
                    hm_bead.position.set(x_hm, y_hm, 0);
                    decadeBeads.push(hm_bead);
                }
            }
            
            this.beads.push(crucifixGroup);  // 0: Apostles Creed
            this.beads.push(p_of_bead);       // 1: Our Father
            this.beads.push(p_hm_bead1);      // 2: Hail Mary
            this.beads.push(p_hm_bead2);      // 3: Hail Mary
            this.beads.push(p_hm_bead3);      // 4: Hail Mary
            this.beads.push(...decadeBeads);

            // Create bead map for prayers
            this.beadMap = [
                0, // Apostles' Creed
                1, // Our Father
                2, 3, 4, // 3 Hail Marys
                4, // Glory Be (on last HM bead)
            ];
            let currentBeadIndexInArray = 5;
            for (let d = 0; d < 5; d++) {
                this.beadMap.push(currentBeadIndexInArray);   // Mystery Announcement on the Our Father bead
                this.beadMap.push(currentBeadIndexInArray++); // Our Father prayer
                for (let i = 0; i < 10; i++) {
                    this.beadMap.push(currentBeadIndexInArray++); // 10 Hail Marys
                }
                this.beadMap.push(currentBeadIndexInArray - 1); // Glory Be on last HM
                this.beadMap.push(currentBeadIndexInArray - 1); // Fatima Prayer on last HM
            }

            this.scene.add(this.rosaryGroup);
            this.rosaryGroup.position.y = 4;
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
            gsap.to(this.camera.position, { duration: 2, x: 0, y: 4, z: 35, ease: "power2.inOut" });
            gsap.to(this.controls.target, { duration: 2, x: 0, y: 0, z: 0, ease: "power2.inOut" });
        }
    };
    
    const SacredRosary = {
        config: ROSARY_CONFIG,
        state: { /* ... initial state ... */ },
        elements: {},
        audio: { backgroundMusic: null, prayerAudio: null, effects: {} },
        
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
                    modelContainer: document.getElementById('model-container'),
                    prayerScroll: document.querySelector('.prayer-scroll'),
                    prayerTitle: document.querySelector('.prayer-title'),
                    prayerInstructions: document.querySelector('.prayer-instructions'),
                    prayerText: document.querySelector('.prayer-text'),
                    progressBar: document.querySelector('.progress-fill'),
                    progressText: document.querySelector('.progress-text'),
                    prayerIcon: document.querySelector('.prayer-icon'),
                    prayerName: document.querySelector('.prayer-name'),
                    prevBtn: document.querySelector('.prev-btn'),
                    playBtn: document.querySelector('.play-btn'),
                    nextBtn: document.querySelector('.next-btn'),
                    mysteryInfo: document.getElementById('mystery-info'),
                    languageBtns: document.querySelectorAll('.language-btn'),
                    mysteryBtns: document.querySelectorAll('.mystery-btn'),
                    startBtn: document.querySelector('.start-btn'),
                    // ... other elements
                };
            } catch (error) { console.error('Error registering DOM elements:', error); }
        },
        
        loadAssets: function() {
            this.setupAudio();
            // Simulate loading
            setTimeout(() => this.hideLoadingOverlay(), 500);
        },

        hideLoadingOverlay: function() {
            if (this.elements.loadingOverlay) {
                this.elements.loadingOverlay.style.opacity = '0';
                setTimeout(() => { this.elements.loadingOverlay.style.display = 'none'; }, 800);
            }
        },
        
        setupAudio: function() {
            if (typeof Howl === 'undefined') { console.warn('Howler.js not loaded.'); return; }
            if (this.config.audio.backgroundMusic.enabled && this.config.audio.backgroundMusic.src) {
                this.audio.backgroundMusic = new Howl({ src: [this.config.audio.backgroundMusic.src], loop: true, volume: this.config.audio.backgroundMusic.volume });
            }
            // Setup effects (simplified)
            this.audio.effects.transition = new Howl({ src: ['assets/audio/effects/transition.mp3'], volume: 0.5 });
        },
        
        createRosarySequence: function() {
            this.state.rosarySequence = [
                { prayer: 'signOfCross', type: 'prayer' }, { prayer: 'apostlesCreed', type: 'prayer' },
                { prayer: 'ourFather', type: 'prayer' }, { prayer: 'hailMary', type: 'prayer' }, { prayer: 'hailMary', type: 'prayer' }, { prayer: 'hailMary', type: 'prayer' },
                { prayer: 'gloryBe', type: 'prayer' },
            ];
            for (let d = 0; d < 5; d++) {
                this.state.rosarySequence.push({ type: 'mystery', mysteryIndex: d });
                this.state.rosarySequence.push({ prayer: 'ourFather', type: 'prayer' });
                for (let i = 0; i < 10; i++) this.state.rosarySequence.push({ prayer: 'hailMary', type: 'prayer' });
                this.state.rosarySequence.push({ prayer: 'gloryBe', type: 'prayer' });
                this.state.rosarySequence.push({ prayer: 'fatimaPrayer', type: 'prayer' });
            }
            this.state.rosarySequence.push({ prayer: 'hailHolyQueen', type: 'prayer' }, { prayer: 'finalPrayer', type: 'prayer' }, { prayer: 'signOfCross', type: 'prayer' });
            this.state.totalPrayers = this.state.rosarySequence.length;
        },
        
        startRosary: function() {
            this.createRosarySequence();
            this.state.currentPrayerIndex = 0;
            
            this.elements.landingPage.style.opacity = '0';
            setTimeout(() => {
                this.elements.landingPage.style.display = 'none';
                this.elements.mainContent.style.display = 'flex';
                Rosary3D.onWindowResize();
                this.updatePrayerDisplay();
            }, 800);
            
            if (this.audio.effects.transition) this.audio.effects.transition.play();
            if (this.audio.backgroundMusic) this.audio.backgroundMusic.play();
        },
        
        updatePrayerDisplay: function() {
            const prayerIndex = this.state.currentPrayerIndex;
            const currentItem = this.state.rosarySequence[prayerIndex];
            const beadIndex = Rosary3D.beadMap[prayerIndex];

            if (beadIndex !== undefined) { Rosary3D.highlightBead(beadIndex); Rosary3D.focusOnBead(beadIndex); } 
            else { Rosary3D.highlightBead(-1); Rosary3D.zoomToShowAll(); }

            this.elements.prayerScroll.style.opacity = '0';
            this.elements.mysteryInfo.classList.remove('visible');

            setTimeout(() => {
                if (currentItem.type === 'prayer') {
                    const prayer = this.state.prayerData[currentItem.prayer];
                    this.elements.prayerTitle.textContent = prayer.title;
                    this.elements.prayerInstructions.textContent = prayer.instructions;
                    this.elements.prayerText.innerHTML = `<p>${prayer.text}</p>`;
                } else if (currentItem.type === 'mystery') {
                    const mystery = this.state.mysteryData[this.state.currentMysteryType][currentItem.mysteryIndex];
                    this.elements.prayerTitle.textContent = mystery.title;
                    this.elements.prayerInstructions.textContent = 'Meditate on this mystery';
                    this.elements.prayerText.innerHTML = `<p>${mystery.description}</p><p class="fruits">${mystery.fruits}</p>`;
                    this.elements.mysteryInfo.querySelector('.mystery-title').textContent = mystery.title;
                    this.elements.mysteryInfo.querySelector('.mystery-description').textContent = mystery.description;
                    this.elements.mysteryInfo.querySelector('.mystery-fruits').textContent = mystery.fruits;
                    this.elements.mysteryInfo.classList.add('visible');
                }
                this.updateProgressIndicators();
                this.elements.prayerScroll.style.opacity = '1';
            }, 300);
        },
        
        updateProgressIndicators: function() {
            const progress = ((this.state.currentPrayerIndex + 1) / this.state.totalPrayers) * 100;
            this.elements.progressBar.style.width = `${progress}%`;
            this.elements.progressText.textContent = `Prayer ${this.state.currentPrayerIndex + 1} of ${this.state.totalPrayers}`;
        },
        
        nextPrayer: function() { if (this.state.currentPrayerIndex < this.state.rosarySequence.length - 1) { this.state.currentPrayerIndex++; this.updatePrayerDisplay(); } },
        prevPrayer: function() { if (this.state.currentPrayerIndex > 0) { this.state.currentPrayerIndex--; this.updatePrayerDisplay(); } },
        setLanguage: function(lang) { this.state.activeLanguage = lang; this.state.prayerData = lang === 'es' ? PRAYERS_ES : PRAYERS_EN; this.state.mysteryData = lang === 'es' ? MYSTERIES_ES : MYSTERIES_EN; },
        setupEventListeners: function() {
            this.elements.startBtn.addEventListener('click', () => this.startRosary());
            this.elements.prevBtn.addEventListener('click', () => this.prevPrayer());
            this.elements.nextBtn.addEventListener('click', () => this.nextPrayer());
            this.elements.languageBtns.forEach(btn => btn.addEventListener('click', (e) => this.setLanguage(e.target.dataset.language)));
            this.elements.mysteryBtns.forEach(btn => btn.addEventListener('click', (e) => {
                this.elements.mysteryBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.state.currentMysteryType = e.target.dataset.mystery;
            }));
        },
        // Dummy methods for placeholders from previous code that might be missing
        loadUserSettings: function() {}, checkMourningPeriod: function() {}, applyTheme: function() {},
        toggleSettings: function() {}, updateSettingsUI: function() {}, saveSettings: function() {}, resetSettings: function() {},
    };

    SacredRosary.init();
});
