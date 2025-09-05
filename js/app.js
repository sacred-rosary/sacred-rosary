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
            this.createRosaryModel();

            window.addEventListener('resize', () => this.onWindowResize());
            this.animate();
        },

        createMaterials: function() {
            this.materials = {
                hailMaryBead: new THREE.MeshStandardMaterial({ color: 0x8B6C42, roughness: 0.5, metalness: 0.1 }),
                ourFatherBead: new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.4, metalness: 0.2 }),
                crucifix: new THREE.MeshStandardMaterial({ color: 0xCD7F32, roughness: 0.2, metalness: 0.8 }),
                medallion: new THREE.MeshStandardMaterial({ color: 0xD4AF37, roughness: 0.3, metalness: 0.7 }),
                chain: new THREE.MeshStandardMaterial({ color: 0xAAAAAA, roughness: 0.5, metalness: 0.5 }),
                highlighted: new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xffee00, emissiveIntensity: 0.8, roughness: 0.1 })
            };
        },
        
        createRosaryModel: function() {
            this.rosaryGroup = new THREE.Group();
            this.beads = [];

            // 1. Medallion
            const medallion = this.createBead(this.materials.medallion, 0.8, {x:0, y:12, z:0}, 'cylinder');
            
            // 2. Pendant
            const crucifix = this.createCrucifix({x:0, y:0, z:0});
            const p_bead1 = this.createBead(this.materials.ourFatherBead, 0.6, { x: 0, y: 4.5, z: 0 });
            const p_bead2 = this.createBead(this.materials.hailMaryBead, 0.4, { x: 0, y: 6.2, z: 0 });
            const p_bead3 = this.createBead(this.materials.hailMaryBead, 0.4, { x: 0, y: 7.4, z: 0 });
            const p_bead4 = this.createBead(this.materials.hailMaryBead, 0.4, { x: 0, y: 8.6, z: 0 });
            const p_bead5 = this.createBead(this.materials.ourFatherBead, 0.6, { x: 0, y: 10.3, z: 0 });

            // 3. Decades Loop (4 sets of beads + medallion)
            const radius = 10;
            const decadeGroups = [[]];
            for (let d = 0; d < 4; d++) {
                const angleStart = (d / 4) * (Math.PI * 2) - Math.PI / 2;
                decadeGroups[d] = [];
                decadeGroups[d].push(this.createBead(this.materials.ourFatherBead, 0.6, { x: Math.cos(angleStart) * radius, y: 12 + Math.sin(angleStart) * radius, z: 0 }));
                for (let i = 1; i <= 10; i++) {
                    const angle = angleStart + (i / 11) * (Math.PI / 2); // 90 deg arc
                    decadeGroups[d].push(this.createBead(this.materials.hailMaryBead, 0.4, { x: Math.cos(angle) * radius, y: 12 + Math.sin(angle) * radius, z: 0 }));
                }
            }

            // 4. Assemble in Prayer Order & Create Chains
            this.beads = [crucifix, p_bead1, p_bead2, p_bead3, p_bead4, p_bead5, medallion, ...decadeGroups[0], ...decadeGroups[1], ...decadeGroups[2], ...decadeGroups[3]];
            
            this.createChain(crucifix.position, p_bead1.position);
            this.createChain(p_bead1.position, p_bead2.position);
            this.createChain(p_bead2.position, p_bead3.position);
            this.createChain(p_bead3.position, p_bead4.position);
            this.createChain(p_bead4.position, p_bead5.position);
            this.createChain(p_bead5.position, medallion.position);

            this.createChain(medallion.position, decadeGroups[0][0].position);
            for(let i=0; i < 10; i++) this.createChain(decadeGroups[0][i].position, decadeGroups[0][i+1].position);
            this.createChain(decadeGroups[0][10].position, decadeGroups[1][0].position);
            for(let i=0; i < 10; i++) this.createChain(decadeGroups[1][i].position, decadeGroups[1][i+1].position);
            this.createChain(decadeGroups[1][10].position, decadeGroups[2][0].position);
            for(let i=0; i < 10; i++) this.createChain(decadeGroups[2][i].position, decadeGroups[2][i+1].position);
            this.createChain(decadeGroups[2][10].position, decadeGroups[3][0].position);
            for(let i=0; i < 10; i++) this.createChain(decadeGroups[3][i].position, decadeGroups[3][i+1].position);
            this.createChain(decadeGroups[3][10].position, medallion.position);
            
            this.rosaryGroup.position.y = -6; // Center the whole model
            this.scene.add(this.rosaryGroup);
        },

        createBead: function(material, size, pos, type = 'sphere') {
            const randomOffset = () => (Math.random() - 0.5) * 0.3;
            let bead;
            if(type === 'sphere') bead = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), material);
            else bead = new THREE.Mesh(new THREE.CylinderGeometry(size, size, 0.2, 32), material);
            
            bead.position.set(pos.x + randomOffset(), pos.y + randomOffset(), pos.z + randomOffset());
            bead.originalMaterial = material;
            this.rosaryGroup.add(bead);
            return bead;
        },

        createCrucifix: function(pos) {
            const group = new THREE.Group();
            const vert = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.2), this.materials.crucifix);
            const horiz = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 0.2), this.materials.crucifix);
            horiz.position.y = 0.7;
            group.add(vert, horiz);
            group.position.set(pos.x, pos.y, pos.z);
            group.originalMaterial = this.materials.crucifix;
            this.rosaryGroup.add(group);
            return group;
        },

        createChain: function(p1, p2) {
            const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            midPoint.z += p1.distanceTo(p2) * 0.15 * (Math.random() * 0.5 + 0.5); // Add sag
            const curve = new THREE.CatmullRomCurve3([ p1, midPoint, p2 ]);
            const points = curve.getPoints(10);
            const linkGeo = new THREE.SphereGeometry(0.08, 8, 8);
            for(let i = 1; i < points.length - 1; i++) {
                const link = new THREE.Mesh(linkGeo, this.materials.chain);
                link.position.copy(points[i]);
                this.rosaryGroup.add(link);
            }
        },
        
        createBeadMap: function() {
            const map = [-1, 0, 1, 2, 3, 4, 5]; // Opening prayers mapped
            let beadIndex = 6; // Start at Medallion
            for (let d = 0; d < 5; d++) {
                map.push(beadIndex); // Announce Mystery on OF/Medallion
                map.push(beadIndex++); // Our Father
                if (beadIndex > 50) beadIndex = 6; // Loop back to medallion for 5th decade
                for(let i = 0; i < 10; i++) map.push(beadIndex++);
                map.push(beadIndex - 1); // Glory Be
                map.push(beadIndex - 1); // Fatima
            }
            map.push(-1, -1, -1); // Closing Prayers
            this.beadMap = map;
        },

        highlightBead: function(index) {
            this.beads.forEach(bead => {
                const mat = bead.originalMaterial;
                if (!mat) return;
                if (bead.isGroup) bead.children.forEach(c => c.material = mat);
                else bead.material = mat;
            });
            if (index >= 0 && index < this.beads.length) {
                const bead = this.beads[index];
                if (bead.isGroup) bead.children.forEach(c => c.material = this.materials.highlighted);
                else bead.material = this.materials.highlighted;
            }
        },

        animate: function() { requestAnimationFrame(() => this.animate()); this.controls.update(); this.renderer.render(this.scene, this.camera); },
        onWindowResize: function() { const c = this.renderer.domElement.parentElement; this.camera.aspect = c.clientWidth / c.clientHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(c.clientWidth, c.clientHeight); },
        focusOnBead: function(index) { this.controls.autoRotate = false; const target = this.beads[index].position; gsap.to(this.camera.position, { duration: 1.5, x: target.x, y: target.y, z: target.z + 5, ease: "power2.inOut" }); gsap.to(this.controls.target, { duration: 1.5, x: target.x, y: target.y, z: target.z, ease: "power2.inOut" }); },
        zoomToShowAll: function() { this.controls.autoRotate = true; gsap.to(this.camera.position, { duration: 2, x: 0, y: 0, z: 35, ease: "power2.inOut" }); gsap.to(this.controls.target, { duration: 2, x: 0, y: 0, z: 0, ease: "power2.inOut" }); },
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
            this.loadUserSettings();
            this.applyTheme(this.state.theme);
            this.setupEventListeners();
            this.setLanguage(this.state.language);
            Rosary3D.init();
            this.hideLoadingOverlay();
        },
        
        registerDOMElements: function() {
            this.elements = {
                loadingOverlay: document.querySelector('.loading-overlay'), landingPage: document.querySelector('.landing-page'), mainContent: document.querySelector('.main-content'),
                prayerScroll: document.querySelector('.prayer-scroll'), prayerTitle: document.querySelector('.prayer-title'), prayerInstructions: document.querySelector('.prayer-instructions'), prayerText: document.querySelector('.prayer-text'),
                progressBar: document.querySelector('.progress-fill'), progressText: document.querySelector('.progress-text'),
                prevBtn: document.querySelector('.prev-btn'), nextBtn: document.querySelector('.next-btn'), mysteryInfo: document.getElementById('mystery-info'),
                languageBtns: document.querySelectorAll('.language-btn'), mysteryBtns: document.querySelectorAll('.mystery-btn'), startBtn: document.querySelector('.start-btn'),
                settingsPanel: document.getElementById('settings-panel'), prayerSettingsBtn: document.getElementById('prayer-settings-btn'), settingsCloseBtn: document.getElementById('settings-close-btn'),
                themeSelect: document.getElementById('theme-select'), bgMusicToggle: document.getElementById('bg-music-toggle'), bgMusicVolume: document.getElementById('bg-music-volume'),
                effectsToggle: document.getElementById('effects-toggle'), meditationDuration: document.getElementById('meditation-duration'),
                settingsSaveBtn: document.getElementById('settings-save-btn'), settingsResetBtn: document.getElementById('settings-reset-btn'),
            };
        },

        setupEventListeners: function() {
            this.elements.startBtn.addEventListener('click', () => this.startRosary());
            this.elements.prevBtn.addEventListener('click', () => this.prevPrayer());
            this.elements.nextBtn.addEventListener('click', () => this.nextPrayer());
            this.elements.prayerSettingsBtn.addEventListener('click', () => this.toggleSettings());
            this.elements.settingsCloseBtn.addEventListener('click', () => this.toggleSettings());
            this.elements.settingsSaveBtn.addEventListener('click', () => this.saveSettings());
            this.elements.settingsResetBtn.addEventListener('click', () => this.resetSettings());
        },

        createRosarySequence: function() {
            const seq = [{p: 'signOfCross'}, {p: 'apostlesCreed'}, {p: 'ourFather'}, {p: 'hailMary'}, {p: 'hailMary'}, {p: 'hailMary'}, {p: 'gloryBe'}];
            for (let d = 0; d < 5; d++) { seq.push({ type: 'mystery', mysteryIndex: d }, { p: 'ourFather' }); for (let i = 0; i < 10; i++) seq.push({ p: 'hailMary' }); seq.push({ p: 'gloryBe' }, { p: 'fatimaPrayer' }); }
            seq.push({ p: 'hailHolyQueen' }, { p: 'finalPrayer' }, { p: 'signOfCross' });
            this.state.rosarySequence = seq;
            this.state.totalPrayers = seq.length;
            Rosary3D.createBeadMap();
        },
        
        startRosary: function() { this.createRosarySequence(); this.state.currentPrayerIndex = 0; this.elements.landingPage.style.opacity = '0'; setTimeout(() => { this.elements.landingPage.style.display = 'none'; this.elements.mainContent.style.display = 'flex'; Rosary3D.onWindowResize(); this.updatePrayerDisplay(); }, 800); },
        
        updatePrayerDisplay: function() {
            const prayerIndex = this.state.currentPrayerIndex;
            const currentItem = this.state.rosarySequence[prayerIndex];
            const beadIndex = Rosary3D.beadMap[prayerIndex];
            if (beadIndex === -1) { Rosary3D.zoomToShowAll(); Rosary3D.highlightBead(-1); } else { Rosary3D.focusOnBead(beadIndex); Rosary3D.highlightBead(beadIndex); }
            this.elements.prayerScroll.style.opacity = '0';
            this.elements.mysteryInfo.classList.remove('visible');
            setTimeout(() => {
                const data = currentItem.type === 'mystery' ? this.state.mysteryData[this.state.currentMysteryType][currentItem.mysteryIndex] : this.state.prayerData[currentItem.p];
                this.elements.prayerTitle.textContent = data.title;
                this.elements.prayerInstructions.textContent = data.instructions || 'Meditate on this mystery';
                this.elements.prayerText.innerHTML = `<p>${data.text || data.description}</p>`;
                if (data.fruits) this.elements.prayerText.innerHTML += `<p class="fruits">${data.fruits}</p>`;
                if (currentItem.type === 'mystery') { this.elements.mysteryInfo.querySelector('.mystery-title').textContent = data.title; this.elements.mysteryInfo.querySelector('.mystery-description').textContent = data.description; this.elements.mysteryInfo.querySelector('.mystery-fruits').textContent = data.fruits; this.elements.mysteryInfo.classList.add('visible'); }
                this.updateProgressIndicators();
                this.elements.prayerScroll.style.opacity = '1';
            }, 300);
        },
        
        nextPrayer: function() { if (this.state.currentPrayerIndex < this.state.rosarySequence.length - 1) { this.state.currentPrayerIndex++; this.updatePrayerDisplay(); } },
        prevPrayer: function() { if (this.state.currentPrayerIndex > 0) { this.state.currentPrayerIndex--; this.updatePrayerDisplay(); } },
        updateProgressIndicators: function() { const progress = ((this.state.currentPrayerIndex + 1) / this.state.totalPrayers) * 100; this.elements.progressBar.style.width = `${progress}%`; this.elements.progressText.textContent = `Prayer ${this.state.currentPrayerIndex + 1} of ${this.state.totalPrayers}`; },
        hideLoadingOverlay: function() { if (this.elements.loadingOverlay) { this.elements.loadingOverlay.style.opacity = '0'; setTimeout(() => { this.elements.loadingOverlay.style.display = 'none'; }, 800); } },
        setLanguage: function(lang = 'en') { this.state.language = lang; this.state.prayerData = (lang === 'es' ? PRAYERS_ES : PRAYERS_EN); this.state.mysteryData = (lang === 'es' ? MYSTERIES_ES : MYSTERIES_EN); },
        applyTheme: function(themeName = 'default') { document.body.className = `theme-${themeName}`; if(this.elements.themeSelect) this.elements.themeSelect.value = themeName; },
        toggleSettings: function() { this.elements.settingsPanel.classList.toggle('visible'); },
        loadUserSettings: function() { try { const s = JSON.parse(localStorage.getItem('sacredRosarySettings')) || {}; this.state.theme = s.theme || 'default'; this.state.language = s.language || 'en'; } catch (e) { this.state.theme = 'default'; this.state.language = 'en'; } },
        saveSettings: function() {
            const settings = { theme: this.elements.themeSelect.value, /* add other settings */ };
            localStorage.setItem('sacredRosarySettings', JSON.stringify(settings));
            this.toggleSettings();
        },
        resetSettings: function() { localStorage.removeItem('sacredRosarySettings'); this.loadUserSettings(); this.applyTheme(this.state.theme); },
    };

    SacredRosary.init();
});
