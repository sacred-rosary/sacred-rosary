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

            this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('model-canvas'), alpha: true, antialias: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            const dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.position.set(5, 10, 7.5);
            this.scene.add(dirLight);

            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.4;

            this.createMaterials();
            this.createRosary();

            window.addEventListener('resize', () => this.onWindowResize());
            this.animate();
        },

        createMaterials: function() {
            this.materials.hailMaryBead = new THREE.MeshStandardMaterial({ color: 0x8B6C42, roughness: 0.5, metalness: 0.1 });
            this.materials.ourFatherBead = new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.4, metalness: 0.2 });
            this.materials.crucifix = new THREE.MeshStandardMaterial({ color: 0xCD7F32, roughness: 0.2, metalness: 0.8 });
            this.materials.medallion = new THREE.MeshStandardMaterial({ color: 0xD4AF37, roughness: 0.3, metalness: 0.7 });
            this.materials.chain = new THREE.MeshStandardMaterial({ color: 0xAAAAAA, roughness: 0.5, metalness: 0.5 });
            this.materials.highlighted = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xffee00, emissiveIntensity: 0.8, roughness: 0.1, metalness: 0.5, wireframe: false });
        },
        
        createRosary: function() {
            this.rosaryGroup = new THREE.Group();
            this.beads = [];
            const randomOffset = () => (Math.random() - 0.5) * 0.4;

            // --- 1. The Medallion Centerpiece ---
            const medallion = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32), this.materials.medallion);
            medallion.rotation.x = Math.PI / 2;
            medallion.position.set(0 + randomOffset(), 12 + randomOffset(), 0 + randomOffset());
            medallion.originalMaterial = this.materials.medallion;
            this.rosaryGroup.add(medallion);

            // --- 2. The Pendant/Drop ---
            const crucifix = new THREE.Group();
            const vert = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.2), this.materials.crucifix);
            const horiz = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 0.2), this.materials.crucifix);
            horiz.position.y = 0.7;
            crucifix.add(vert, horiz);
            crucifix.position.set(0 + randomOffset(), 0, 0 + randomOffset());
            crucifix.originalMaterial = this.materials.crucifix;
            this.rosaryGroup.add(crucifix);
            
            const pendantBead1 = this.createBead(this.materials.ourFatherBead, 0.6, { x: 0, y: 4, z: 0 });
            const pendantBead2 = this.createBead(this.materials.hailMaryBead, 0.4, { x: 0, y: 5.5, z: 0 });
            const pendantBead3 = this.createBead(this.materials.hailMaryBead, 0.4, { x: 0, y: 6.7, z: 0 });
            const pendantBead4 = this.createBead(this.materials.hailMaryBead, 0.4, { x: 0, y: 7.9, z: 0 });
            const pendantBead5 = this.createBead(this.materials.ourFatherBead, 0.6, { x: 0, y: 9.4, z: 0 });

            // --- 3. The Decades Loop ---
            const radius = 10;
            const decadeBeads = [];
            for (let d = 0; d < 4; d++) { // Only 4 Our Father beads in the loop
                const angleOF = (d / 4) * Math.PI * 2 + Math.PI / 4;
                decadeBeads.push(this.createBead(this.materials.ourFatherBead, 0.6, { x: Math.cos(angleOF) * radius, y: 12 + Math.sin(angleOF) * radius, z: 0 }));
                for (let i = 1; i <= 10; i++) {
                    const angleHM = angleOF + (i / 11) * (Math.PI / 2); // 90 degrees between large beads
                    decadeBeads.push(this.createBead(this.materials.hailMaryBead, 0.4, { x: Math.cos(angleHM) * radius, y: 12 + Math.sin(angleHM) * radius, z: 0 }));
                }
            }

            // --- 4. Assemble in Prayer Order and Create Chains ---
            const prayerOrder = [
                crucifix, pendantBead1, pendantBead2, pendantBead3, pendantBead4, pendantBead5, medallion, ...decadeBeads
            ];
            this.beads = prayerOrder;
            for (let i = 0; i < prayerOrder.length - 1; i++) {
                let p1 = prayerOrder[i].position;
                let p2 = prayerOrder[i+1].position;
                if(i === prayerOrder.length - 2) { // Connect last bead back to medallion
                    p2 = medallion.position;
                }
                this.createChain(p1, p2);
            }
            this.createChain(pendantBead5.position, medallion.position); // Connect pendant to medallion
            
            this.rosaryGroup.position.y = -5; // Center the whole model
            this.scene.add(this.rosaryGroup);
        },

        createBead: function(material, size, pos) {
            const randomOffset = () => (Math.random() - 0.5) * 0.4;
            const bead = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), material);
            bead.position.set(pos.x + randomOffset(), pos.y + randomOffset(), pos.z + randomOffset());
            bead.originalMaterial = material;
            this.rosaryGroup.add(bead);
            return bead;
        },

        createChain: function(p1, p2) {
            const curve = new THREE.CatmullRomCurve3([ p1, p2 ]);
            const points = curve.getPoints(10);
            const linkGeo = new THREE.SphereGeometry(0.08, 8, 8);
            for(let i = 1; i < points.length - 1; i++) {
                const link = new THREE.Mesh(linkGeo, this.materials.chain);
                link.position.copy(points[i]);
                this.rosaryGroup.add(link);
            }
        },
        
        createBeadMap: function() {
            const map = [];
            // Opening
            map.push(-1); // Sign of Cross
            map.push(0);  // Apostles' Creed (Crucifix)
            map.push(1);  // Our Father
            map.push(2);  // Hail Mary (Faith)
            map.push(3);  // Hail Mary (Hope)
            map.push(4);  // Hail Mary (Charity)
            map.push(5);  // Glory Be
            
            let beadIndex = 6; // Medallion is index 6
            for (let d = 0; d < 5; d++) {
                map.push(beadIndex); // Announce Mystery (On Our Father bead or Medallion)
                map.push(beadIndex++); // Our Father prayer
                for(let i = 0; i < 10; i++) { map.push(beadIndex++); }
                map.push(beadIndex - 1); // Glory Be
                map.push(beadIndex - 1); // Fatima
                if (d === 3) beadIndex = 6; // After 4th decade loop back to medallion
            }
            map.push(-1, -1, -1); // Closing Prayers
            this.beadMap = map;
        },

        highlightBead: function(index) { /* ... same as before ... */ },
        animate: function() { requestAnimationFrame(() => this.animate()); this.controls.update(); this.renderer.render(this.scene, this.camera); },
        onWindowResize: function() { /* ... same as before ... */ },
        focusOnBead: function(index) { /* ... same as before ... */ },
        zoomToShowAll: function() { /* ... same as before ... */ },
    };
    
    //================================================================================
    // Main Application Object
    //================================================================================
    const SacredRosary = {
        config: ROSARY_CONFIG,
        state: { currentPrayerIndex: 0, currentMysteryType: 'joyful' },
        elements: {},
        
        init: function() {
            this.registerDOMElements();
            this.loadUserSettings(); // Load first
            this.applyTheme(this.state.theme); // Apply loaded theme
            this.setupEventListeners();
            this.setLanguage(this.state.language || 'en');
            Rosary3D.init();
            this.hideLoadingOverlay();
        },
        
        registerDOMElements: function() {
            this.elements = {
                loadingOverlay: document.querySelector('.loading-overlay'),
                landingPage: document.querySelector('.landing-page'),
                mainContent: document.querySelector('.main-content'),
                prayerScroll: document.querySelector('.prayer-scroll'),
                prayerTitle: document.querySelector('.prayer-title'),
                prayerInstructions: document.querySelector('.prayer-instructions'),
                prayerText: document.querySelector('.prayer-text'),
                progressBar: document.querySelector('.progress-fill'),
                progressText: document.querySelector('.progress-text'),
                prevBtn: document.querySelector('.prev-btn'),
                nextBtn: document.querySelector('.next-btn'),
                mysteryInfo: document.getElementById('mystery-info'),
                languageBtns: document.querySelectorAll('.language-btn'),
                mysteryBtns: document.querySelectorAll('.mystery-btn'),
                startBtn: document.querySelector('.start-btn'),
                settingsPanel: document.getElementById('settings-panel'),
                prayerSettingsBtn: document.getElementById('prayer-settings-btn'),
                settingsCloseBtn: document.getElementById('settings-close-btn'),
                themeSelect: document.getElementById('theme-select'),
            };
        },

        setupEventListeners: function() {
            this.elements.startBtn.addEventListener('click', () => this.startRosary());
            this.elements.prevBtn.addEventListener('click', () => this.prevPrayer());
            this.elements.nextBtn.addEventListener('click', () => this.nextPrayer());
            this.elements.prayerSettingsBtn.addEventListener('click', () => this.toggleSettings());
            this.elements.settingsCloseBtn.addEventListener('click', () => this.toggleSettings());
            this.elements.themeSelect.addEventListener('change', (e) => this.applyTheme(e.target.value));
            // ... add other settings listeners here
        },

        createRosarySequence: function() {
            const seq = [{p: 'signOfCross'}, {p: 'apostlesCreed'}, {p: 'ourFather'}, {p: 'hailMary'}, {p: 'hailMary'}, {p: 'hailMary'}, {p: 'gloryBe'}];
            for (let d = 0; d < 5; d++) {
                seq.push({ type: 'mystery', mysteryIndex: d });
                seq.push({ p: 'ourFather' });
                for (let i = 0; i < 10; i++) seq.push({ p: 'hailMary' });
                seq.push({ p: 'gloryBe' });
                seq.push({ p: 'fatimaPrayer' });
            }
            seq.push({ p: 'hailHolyQueen' }, { p: 'finalPrayer' }, { p: 'signOfCross' });
            this.state.rosarySequence = seq;
            this.state.totalPrayers = seq.length;
            Rosary3D.createBeadMap();
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
                const data = currentItem.type === 'mystery' 
                    ? this.state.mysteryData[this.state.currentMysteryType][currentItem.mysteryIndex]
                    : this.state.prayerData[currentItem.p];

                this.elements.prayerTitle.textContent = data.title;
                this.elements.prayerInstructions.textContent = data.instructions || 'Meditate on this mystery';
                this.elements.prayerText.innerHTML = `<p>${data.text || data.description}</p>`;
                if (data.fruits) this.elements.prayerText.innerHTML += `<p class="fruits">${data.fruits}</p>`;
                
                if (currentItem.type === 'mystery') {
                    this.elements.mysteryInfo.querySelector('.mystery-title').textContent = data.title;
                    this.elements.mysteryInfo.querySelector('.mystery-description').textContent = data.description;
                    this.elements.mysteryInfo.querySelector('.mystery-fruits').textContent = data.fruits;
                    this.elements.mysteryInfo.classList.add('visible');
                }
                
                this.updateProgressIndicators();
                this.elements.prayerScroll.style.opacity = '1';
            }, 300);
        },
        
        // --- Core UI and State Management ---
        nextPrayer: function() { if (this.state.currentPrayerIndex < this.state.rosarySequence.length - 1) { this.state.currentPrayerIndex++; this.updatePrayerDisplay(); } },
        prevPrayer: function() { if (this.state.currentPrayerIndex > 0) { this.state.currentPrayerIndex--; this.updatePrayerDisplay(); } },
        updateProgressIndicators: function() {
            const progress = ((this.state.currentPrayerIndex + 1) / this.state.totalPrayers) * 100;
            if(this.elements.progressBar) this.elements.progressBar.style.width = `${progress}%`;
            if(this.elements.progressText) this.elements.progressText.textContent = `Prayer ${this.state.currentPrayerIndex + 1} of ${this.state.totalPrayers}`;
        },
        hideLoadingOverlay: function() {
            if (this.elements.loadingOverlay) {
                this.elements.loadingOverlay.style.opacity = '0';
                setTimeout(() => { this.elements.loadingOverlay.style.display = 'none'; }, 800);
            }
        },
        setLanguage: function(lang = 'en') {
            this.state.language = lang;
            this.state.prayerData = (lang === 'es' ? PRAYERS_ES : PRAYERS_EN);
            this.state.mysteryData = (lang === 'es' ? MYSTERIES_ES : MYSTERIES_EN);
        },
        applyTheme: function(themeName = 'default') {
            this.state.theme = themeName;
            document.body.className = `theme-${themeName}`;
            // This is a simplified theme switcher. Full implementation would use CSS variables.
        },
        toggleSettings: function() { this.elements.settingsPanel.classList.toggle('visible'); },
        loadUserSettings: function() {
            try {
                const settings = JSON.parse(localStorage.getItem('sacredRosarySettings'));
                this.state.theme = settings.theme || 'default';
                this.state.language = settings.language || 'en';
            } catch (e) {
                this.state.theme = 'default';
                this.state.language = 'en';
            }
        },
    };

    SacredRosary.init();
});
