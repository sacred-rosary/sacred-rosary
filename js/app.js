document.addEventListener('DOMContentLoaded', function() {
    
    //================================================================================
    // 3D Rosary Module
    //================================================================================
    const Rosary3D = {
        scene: null, camera: null, renderer: null, controls: null,
        rosaryGroup: null, beads: [], materials: {}, beadMap: [],

        init: function() {
            if (typeof THREE === 'undefined') { console.error("THREE.js is not loaded."); return; }
            const container = document.getElementById('model-container');
            if (!container) return;

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.set(0, 0, 35);
            this.scene.add(this.camera);

            // Renderer and Lighting
            const canvas = document.getElementById('model-canvas');
            this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
            this.scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5));
            const dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.position.set(5, 10, 7.5);
            this.scene.add(dirLight);

            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.3;

            this.createMaterials();
            this.createRosary();

            window.addEventListener('resize', () => this.onWindowResize());
            this.animate();
        },

        createMaterials: function() {
            // For even more realism, you can load textures here
            // const textureLoader = new THREE.TextureLoader();
            // const woodNormalMap = textureLoader.load('path/to/wood_normal.jpg');
            this.materials.hailMaryBead = new THREE.MeshStandardMaterial({ color: 0x8B6C42, roughness: 0.5, metalness: 0.1 });
            this.materials.ourFatherBead = new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.4, metalness: 0.2 });
            this.materials.crucifix = new THREE.MeshStandardMaterial({ color: 0xCD7F32, roughness: 0.2, metalness: 0.8 });
            this.materials.highlighted = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xffee00, emissiveIntensity: 0.8, roughness: 0.1, metalness: 0.5 });
        },

        createRosary: function() {
            this.rosaryGroup = new THREE.Group();
            this.beads = [];

            const createBead = (material, size = 0.4, pos) => {
                const bead = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), material);
                // Add randomization for the "thrown on table" look
                const randomOffset = () => (Math.random() - 0.5) * 0.5;
                bead.position.set(pos.x + randomOffset(), pos.y + randomOffset(), pos.z + randomOffset());
                bead.originalMaterial = material;
                this.rosaryGroup.add(bead);
                return bead;
            };
            
            // 1. Crucifix
            const crucifixGroup = new THREE.Group();
            const vert = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.2), this.materials.crucifix);
            const horiz = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 0.2), this.materials.crucifix);
            horiz.position.y = 0.7;
            crucifixGroup.add(vert, horiz);
            crucifixGroup.position.set(0, -11, 0);
            crucifixGroup.originalMaterial = this.materials.crucifix;
            this.rosaryGroup.add(crucifixGroup);
            this.beads.push(crucifixGroup); // Bead 0

            // 2. Pendant Beads (Correct sequence)
            this.beads.push(createBead(this.materials.ourFatherBead, 0.6, {x: 0, y: -8, z: 0})); // Bead 1
            this.beads.push(createBead(this.materials.hailMaryBead, 0.4, {x: 0, y: -6.5, z: 0})); // Bead 2
            this.beads.push(createBead(this.materials.hailMaryBead, 0.4, {x: 0, y: -5.3, z: 0})); // Bead 3
            this.beads.push(createBead(this.materials.hailMaryBead, 0.4, {x: 0, y: -4.1, z: 0})); // Bead 4

            // 3. Decades Loop
            const radius = 10;
            for (let d = 0; d < 5; d++) {
                // Large bead for Our Father / Mystery
                const angleOF = (d / 5) * Math.PI * 2;
                const posOF = { x: Math.cos(angleOF) * radius, y: Math.sin(angleOF) * radius, z: 0 };
                this.beads.push(createBead(this.materials.ourFatherBead, 0.6, posOF));
                // 10 small beads for Hail Marys
                for (let i = 1; i <= 10; i++) {
                    const angleHM = angleOF + (i / 11) * (Math.PI * 2 / 5);
                    const posHM = { x: Math.cos(angleHM) * radius, y: Math.sin(angleHM) * radius, z: 0 };
                    this.beads.push(createBead(this.materials.hailMaryBead, 0.4, posHM));
                }
            }
            
            this.rosaryGroup.rotation.z = Math.random() * Math.PI; // Random initial rotation
            this.scene.add(this.rosaryGroup);
        },
        
        // This map now correctly links each prayer in the sequence to a 3D bead index
        createBeadMap: function() {
            const map = [];
            // Opening
            map.push(-1); // Sign of the Cross -> view all
            map.push(0);  // Apostles' Creed -> crucifix
            map.push(1);  // Our Father
            map.push(2);  // Hail Mary
            map.push(3);  // Hail Mary
            map.push(4);  // Hail Mary
            map.push(5);  // Glory Be (on first decade bead)
            
            let beadIndex = 5; // Start of the first decade
            for (let d = 0; d < 5; d++) {
                map.push(beadIndex); // Mystery Announcement -> on the large bead
                map.push(beadIndex++); // Our Father -> on the large bead
                for(let i = 0; i < 10; i++) {
                    map.push(beadIndex++); // 10 Hail Marys
                }
                map.push(beadIndex - 1); // Glory Be -> on the last small bead
                map.push(beadIndex - 1); // Fatima Prayer -> on the last small bead
            }
            // Closing prayers -> view all
            map.push(-1, -1, -1);
            this.beadMap = map;
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
            requestAnimationFrame(() => this.animate());
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
            this.controls.autoRotate = false; // Stop auto-rotation when focusing
            const targetBead = this.beads[index];
            const targetPosition = new THREE.Vector3();
            targetBead.getWorldPosition(targetPosition);
            gsap.to(this.camera.position, { duration: 1.5, x: targetPosition.x, y: targetPosition.y, z: targetPosition.z + 5, ease: "power2.inOut" });
            gsap.to(this.controls.target, { duration: 1.5, x: targetPosition.x, y: targetPosition.y, z: targetPosition.z, ease: "power2.inOut" });
        },

        zoomToShowAll: function() {
            this.controls.autoRotate = true; // Resume auto-rotation
            gsap.to(this.camera.position, { duration: 2, x: 0, y: 0, z: 35, ease: "power2.inOut" });
            gsap.to(this.controls.target, { duration: 2, x: 0, y: 0, z: 0, ease: "power2.inOut" });
        }
    };
    
    //================================================================================
    // Main Application Object
    //================================================================================
    const SacredRosary = {
        config: ROSARY_CONFIG,
        state: { /* ... initial state ... */ },
        elements: {},
        audio: { backgroundMusic: null, prayerAudio: null, effects: {} },
        
        init: function() {
            this.registerDOMElements();
            this.setupEventListeners();
            this.setLanguage(this.config.language.default); // Set language early
            Rosary3D.init();
            this.hideLoadingOverlay();
        },
        
        registerDOMElements: function() {
            this.elements = {
                loadingOverlay: document.querySelector('.loading-overlay'),
                landingPage: document.querySelector('.landing-page'),
                mainContent: document.querySelector('.main-content'),
                prayerSection: document.querySelector('.prayer-section'),
                prayerScroll: document.querySelector('.prayer-scroll'),
                prayerTitle: document.querySelector('.prayer-title'),
                prayerInstructions: document.querySelector('.prayer-instructions'),
                prayerText: document.querySelector('.prayer-text'),
                progressBar: document.querySelector('.progress-fill'),
                progressText: document.querySelector('.progress-text'),
                prevBtn: document.querySelector('.prev-btn'),
                playBtn: document.querySelector('.play-btn'),
                nextBtn: document.querySelector('.next-btn'),
                mysteryInfo: document.getElementById('mystery-info'),
                languageBtns: document.querySelectorAll('.language-btn'),
                mysteryBtns: document.querySelectorAll('.mystery-btn'),
                startBtn: document.querySelector('.start-btn'),
                settingsPanel: document.getElementById('settings-panel'),
                prayerSettingsBtn: document.getElementById('prayer-settings-btn'),
                settingsCloseBtn: document.getElementById('settings-close-btn'),
            };
        },

        setupEventListeners: function() {
            this.elements.startBtn.addEventListener('click', () => this.startRosary());
            this.elements.prevBtn.addEventListener('click', () => this.prevPrayer());
            this.elements.nextBtn.addEventListener('click', () => this.nextPrayer());
            this.elements.prayerSettingsBtn.addEventListener('click', () => this.toggleSettings());
            this.elements.settingsCloseBtn.addEventListener('click', () => this.toggleSettings());
            this.elements.languageBtns.forEach(btn => btn.addEventListener('click', (e) => this.setLanguage(e.target.dataset.language)));
            this.elements.mysteryBtns.forEach(btn => btn.addEventListener('click', (e) => {
                this.elements.mysteryBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.state.currentMysteryType = e.target.dataset.mystery;
            }));
        },

        hideLoadingOverlay: function() {
            if (this.elements.loadingOverlay) {
                this.elements.loadingOverlay.style.opacity = '0';
                setTimeout(() => { this.elements.loadingOverlay.style.display = 'none'; }, 800);
            }
        },
        
        createRosarySequence: function() {
            this.state.rosarySequence = [
                { prayer: 'signOfCross' }, { prayer: 'apostlesCreed' },
                { prayer: 'ourFather' }, { prayer: 'hailMary' }, { prayer: 'hailMary' }, { prayer: 'hailMary' },
                { prayer: 'gloryBe' },
            ];
            for (let d = 0; d < 5; d++) {
                this.state.rosarySequence.push({ type: 'mystery', mysteryIndex: d });
                this.state.rosarySequence.push({ prayer: 'ourFather' });
                for (let i = 0; i < 10; i++) this.state.rosarySequence.push({ prayer: 'hailMary' });
                this.state.rosarySequence.push({ prayer: 'gloryBe' });
                this.state.rosarySequence.push({ prayer: 'fatimaPrayer' });
            }
            this.state.rosarySequence.push({ prayer: 'hailHolyQueen' }, { prayer: 'finalPrayer' }, { prayer: 'signOfCross' });
            this.state.totalPrayers = this.state.rosarySequence.length;
            Rosary3D.createBeadMap(); // Create the map after the sequence is made
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
        },
        
        updatePrayerDisplay: function() {
            const prayerIndex = this.state.currentPrayerIndex;
            const currentItem = this.state.rosarySequence[prayerIndex];
            const beadIndex = Rosary3D.beadMap[prayerIndex];

            if (beadIndex === -1) { Rosary3D.zoomToShowAll(); Rosary3D.highlightBead(-1); }
            else { Rosary3D.focusOnBead(beadIndex); Rosary3D.highlightBead(beadIndex); }

            this.elements.prayerScroll.style.opacity = '0';
            this.elements.mysteryInfo.classList.remove('visible');

            setTimeout(() => {
                const prayerData = currentItem.type === 'mystery' 
                    ? this.state.mysteryData[this.state.currentMysteryType][currentItem.mysteryIndex]
                    : this.state.prayerData[currentItem.prayer];

                this.elements.prayerTitle.textContent = prayerData.title;
                this.elements.prayerInstructions.textContent = prayerData.instructions || 'Meditate on this mystery';
                this.elements.prayerText.innerHTML = `<p>${prayerData.text || prayerData.description}</p>`;
                if(prayerData.fruits) this.elements.prayerText.innerHTML += `<p class="fruits">${prayerData.fruits}</p>`;
                
                if (currentItem.type === 'mystery') {
                    this.elements.mysteryInfo.querySelector('.mystery-title').textContent = prayerData.title;
                    this.elements.mysteryInfo.querySelector('.mystery-description').textContent = prayerData.description;
                    this.elements.mysteryInfo.querySelector('.mystery-fruits').textContent = prayerData.fruits;
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
        
        setLanguage: function(lang) { 
            if (!lang || this.state.activeLanguage === lang) return;
            this.state.activeLanguage = lang; 
            this.state.prayerData = (lang === 'es' ? PRAYERS_ES : PRAYERS_EN); 
            this.state.mysteryData = (lang === 'es' ? MYSTERIES_ES : MYSTERIES_EN);
        },
        
        toggleSettings: function() {
            this.elements.settingsPanel.classList.toggle('visible');
        },
    };

    SacredRosary.init();
});
