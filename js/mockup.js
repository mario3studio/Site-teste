document.addEventListener('DOMContentLoaded', () => {

    // --- Referências aos Elementos HTML ---
    const mainContainer = document.getElementById('mainContainer');
    const boxes = document.querySelectorAll('.box-mockup');
    const controlBoxes = document.querySelectorAll('.arrow-box');
    const modelViewer = document.getElementById('mockup-viewer');
    const textureUpload = document.getElementById('texture-upload');
    const modelosBtn = document.getElementById('modelos-btn');
    const roughnessSlider = document.getElementById('roughness-slider');
    const metallicSlider = document.getElementById('metallic-slider');
    const roughnessValue = document.getElementById('roughness-value');
    const metallicValue = document.getElementById('metallic-value');
    const transparencySlider = document.getElementById('transparency-slider');
    const transparencyValue = document.getElementById('transparency-value');
    const uploadBoxText = document.getElementById('upload-box-text');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const modal = document.getElementById('model-library-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modelGrid = document.getElementById('model-grid');
    const plantaArea = document.querySelector('.planta-area');
    const uvCanvas = document.getElementById('uv-canvas');
    const downloadBtn = document.getElementById('download-btn');
    const frenteBtn = document.getElementById('frente-btn');
    const versoBtn = document.getElementById('verso-btn');
    const sideButtonsContainer = document.querySelector('.side-buttons');

    // --- Variáveis de Estado e Configuração ---
    let userImageObjects = {};
    let originalRoughness = 0.0;
    let originalMetallic = 0.0;
    let currentModelConfig = null;
    let currentArtSide = 'Frente';
    const SNAP_TOLERANCE = 8;
    // VARIÁVEL PARA O CAMINHO DA MARCA D'ÁGUA
    const watermarkImagePath = '/img/3STUDIO.png';
    
    // --- Dados do Aplicativo: Categorias e Modelos 3D ---
    const modelData = [
        {
            name: 'Café',
            models: [
                {
                    name: 'A Vacuo',
                    thumbnail: '3d/Laminados/Café/Queijo_em_Barra.png',
                    modelSrc: '3d/Laminados/Café/Café a Vacuo/3D/CAFE A VACUO.gltf',
                    artSides: { 'Frente': [0], 'Verso': [2] },
                    plasticTargets: [0],
                    sizes: [
                        { name: 'Padrão (180x250mm)', uvLayout: '3d/Laminados/Café/Café a Vacuo/Planta/PLANTA CAFE A VACUO.jpg' }
                    ]
                },
                {
                    name: '3 Soldas',
                    thumbnail: '3d/Laminados/Café/Queijo_em_Barra.png',
                    modelSrc: '3d/Laminados/Café/3 SOLDAS/3D/SACHE CAFE.gltf',
                    artSides: { 'Frente': [0], 'Verso': [2] },
                    plasticTargets: [3],
                    sizes: [
                        { name: 'Padrão (180x250mm)', uvLayout: '3d/Laminados/Café/3 SOLDAS/PLANTA/3 SOLDAS.jpg' }
                    ]
                },
                {
                    name: '4 Soldas',
                    thumbnail: '3d/Laminados/Café/Queijo_em_Barra.png',
                    modelSrc: '3d/Laminados/Café/4 SOLDAS/3D/4 SOLDAS.gltf',
                    artSides: { 'Frente': [0], 'Verso': [2] },
                    plasticTargets: [0],
                    sizes: [
                        { name: 'Padrão (30x20mm)', uvLayout: '3d/Laminados/Café/4 SOLDAS/PLANTA/4 SOLDAS.jpg' }
                    ]
                }
            ]
        },
        {
            name: 'Queijos',
            models: [
                {
                    name: 'Em Barra',
                    thumbnail: '3d/Queijo/Queijo_em_Barra.png',
                    modelSrc: '3d/Queijo/Barra Queijo/3D/COALHO BARRA LACTOWAL.gltf',
                    artSides: { 'Frente': [0], 'Verso': [2] },
                    plasticTargets: [1],
                    sizes: [
                        { name: 'Padrão (180x250mm)', uvLayout: '3d/Queijo/Barra Queijo/Planta/PLANTA.png' }
                    ]
                },
                {
                    name: 'Tampa',
                    thumbnail: '3d/Queijo/Queijo_em_Barra.png',
                    modelSrc: '3d/Queijo/TAMPA/3D/NOVA MUSSARELA.gltf',
                    artSides: { 'Frente': [3], 'Verso': [0] },
                    plasticTargets: [2],
                    sizes: [
                        { name: 'Padrão (30x20mm)', uvLayout: '3d/Queijo/TAMPA/PLANTA/PLANTA.jpg' }
                    ]
                },
                {
                    name: 'Espeto',
                    thumbnail: '3d/Queijo/Queijo_em_Barra.png',
                    modelSrc: '3d/Queijo/QUEIJO COALHO ESPETO LAMINADO/3D/COALHO V5 E COZINHA .gltf',
                    artSides: { 'Frente': [0], 'Verso': [1] },
                    plasticTargets: [1],
                    sizes: [
                        { name: 'Padrão (18x28mm)', uvLayout: '3d/Queijo/QUEIJO COALHO ESPETO LAMINADO/PLANTA/PLANTA 18X28.jpg' }
                    ]
                },
                {
                    name: 'Espeto Transmetal',
                    thumbnail: '3d/Queijo/Queijo_em_Barra.png',
                    modelSrc: '3d/Queijo/QUEIJO COALHO PALITO TRANSMETAL/3D/V3.gltf',
                    artSides: { 'Frente': [0], 'Verso': [4] },
                    plasticTargets: [6],
                    sizes: [
                        { name: 'Padrão (30x20mm)', uvLayout: '3d/Queijo/QUEIJO COALHO PALITO TRANSMETAL/PLANTA/PLANTA FRENTE.jpg' }
                    ]
                }
            ]
        },
        {
            name: 'Stand Up',
            models: [
                {
                    name: 'Stand UP',
                    thumbnail: '3d/Laminados/Queijo_em_Barra.png',
                    modelSrc: '3d/Laminados/STAND UP NORMAL/STAND UP/3D/LINHA DELINUT STAND UP.gltf',
                    artSides: { 'Frente': [0], 'Verso': [2] },
                    plasticTargets: [1],
                    sizes: [
                        { name: 'Padrão (180x250mm)', uvLayout: '3d/Laminados/STAND UP NORMAL/STAND UP/Planta/planta_standup2.jpg' },
                        { name: 'Padrão (17,5x27,5mm)', uvLayout: '3d/Laminados/STAND UP NORMAL/STAND UP/Planta/planta_standup3 17,5x27,5.jpg' },
                        { name: 'Padrão (28x33mm)', uvLayout: '3d/Laminados/STAND UP NORMAL/STAND UP/Planta/planta_standup4 28X33.jpg' }
                    ]
                },
                {
                    name: 'Bico Central',
                    thumbnail: '3d/Laminados/Queijo_em_Barra.png',
                    modelSrc: '3d/Laminados/STAND UP NORMAL/STAND UP COM BICO/3D/STAND UP COM BICO CENTRAL.glb',
                    artSides: { 'Frente': [0], 'Verso': [2] },
                    plasticTargets: [1],
                    sizes: [
                        { name: 'Padrão (13x24mm)', uvLayout: '3d/Laminados/STAND UP NORMAL/STAND UP COM BICO/Planta/PLANTA STAND UP BICO 13X24.jpg' }
                    ]
                },
                {
                    name: 'Bico Lateral',
                    thumbnail: '3d/Laminados/Queijo_em_Barra.png',
                    modelSrc: '3d/Laminados/STAND UP NORMAL/STAND UP COM BICO LATERAL/3D/Stand_Up_Com_Bico_Lateraral.gltf',
                    artSides: { 'Frente': [0], 'Verso': [2] },
                    plasticTargets: [1],
                    sizes: [
                        { name: 'Padrão (13x24mm)', uvLayout: '3d/Laminados/STAND UP NORMAL/STAND UP COM BICO LATERAL/PLANTA/Stand_Up_Com_Bico_Lateraral.jpg' }
                    ]
                }
            ]
        },
        {
            name: 'Outros',
            models: [
                {
                    name: 'Solda Dorso',
                    thumbnail: '3d/Laminados/Queijo_em_Barra.png',
                    modelSrc: '3d/Laminados/SOLDA DORSO GRANDE/3D/Untitled.gltf',
                    artSides: { 'Frente': [0], 'Verso': [2] },
                    plasticTargets: [0],
                    sizes: [
                        { name: 'Padrão (30x20mm)', uvLayout: '3d/Laminados/SOLDA DORSO GRANDE/PLANTA/PLANTA.png' }
                    ]
                }
            ]
        }
    ];

    // --- Instância do Canvas com Fabric.js ---
    const canvas = new fabric.Canvas(uvCanvas, {
        width: plantaArea.clientWidth,
        height: plantaArea.clientHeight
    });

    // --- Funções Auxiliares ---
    
    // Atualiza o texto do botão de upload de arte
    const updateUploadBoxUI = () => {
        uploadBoxText.textContent = 'Carregar Arte';
    };

    // Carrega a planta UV no canvas
    const loadUvLayout = (url) => {
        if (!url) {
            canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
            console.error('URL da planta UV não fornecida.');
            return;
        }
        fabric.Image.fromURL(url, (img) => {
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: scale,
                scaleY: scale,
                originX: 'center',
                originY: 'center',
                top: canvas.height / 2,
                left: canvas.width / 2
            });
            canvas.renderAll();
        }, {
            crossOrigin: 'anonymous'
        });
    };

    // Aplica a textura no modelo 3D
    const applyTexture = async (url) => {
        if (!modelViewer.model || !currentModelConfig) return;
    
        const artTargets = currentModelConfig.artSides[currentArtSide] || currentModelConfig.plasticTargets;
        
        modelViewer.model.materials.forEach(material => {
            if (material && material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture) {
                material.pbrMetallicRoughness.baseColorTexture = null;
            }
        });
    
        if (url) {
            const texture = await modelViewer.createTexture(url);
            artTargets.forEach(index => {
                const material = modelViewer.model.materials[index];
                if (material && material.pbrMetallicRoughness) {
                    material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
                    const pbr = material.pbrMetallicRoughness;
                    const currentColor = pbr.baseColorFactor;
                    pbr.setBaseColorFactor([currentColor[0], currentColor[1], currentColor[2], currentColor[3]]);
                }
            });
        }
        updateBaseColor();
    };

    // Atualiza a textura no modelo 3D a partir do canvas 2D
    const updateTextureOnModel = () => {
        const activeArt = userImageObjects[currentArtSide];
        if (!activeArt || !canvas.backgroundImage) {
            applyTexture(null);
            return;
        }
    
        const artwork = activeArt;
        const background = canvas.backgroundImage;
    
        const bgScale = Math.min(canvas.width / background.width, canvas.height / background.height);
        const offsetX = (artwork.left - (canvas.width - background.width * bgScale) / 2) / bgScale;
        const offsetY = (artwork.top - (canvas.height - background.height * bgScale) / 2) / bgScale;
    
        const transformed = {
            left: offsetX,
            top: offsetY,
            scaleX: artwork.scaleX / bgScale,
            scaleY: artwork.scaleY / bgScale,
            angle: artwork.angle
        };
    
        const textureCanvasEl = document.getElementById('texture-generator-canvas');
        textureCanvasEl.width = background.width;
        textureCanvasEl.height = background.height;
        const textureCanvas = new fabric.StaticCanvas(textureCanvasEl);
    
        artwork.clone((cloned) => {
            cloned.set(transformed);
            textureCanvas.add(cloned);
            const newTextureDataURL = textureCanvas.toDataURL('image/png');
            applyTexture(newTextureDataURL);
        });
    };

    // Atualiza a opacidade do material plástico
    const updateBaseColor = () => {
        if (!modelViewer.model || !currentModelConfig || !currentModelConfig.plasticTargets) {
            return;
        }
        
        const transparency = parseFloat(transparencySlider.value);
        
        currentModelConfig.plasticTargets.forEach(index => {
            const material = modelViewer.model.materials[index];
            if (material && material.pbrMetallicRoughness) {
                const currentColor = material.pbrMetallicRoughness.baseColorFactor;
                material.pbrMetallicRoughness.setBaseColorFactor([currentColor[0], currentColor[1], currentColor[2], transparency]);
            }
        });
    };

    // Reinicia as propriedades dos materiais para os valores originais
    const resetMaterialProperties = () => {
        if (!modelViewer.model) return;
        modelViewer.model.materials.forEach(material => {
            if (material && material.pbrMetallicRoughness) {
                material.pbrMetallicRoughness.setRoughnessFactor(originalRoughness);
                material.pbrMetallicRoughness.setMetallicFactor(originalMetallic);
            }
        });
        roughnessSlider.value = originalRoughness;
        metallicSlider.value = originalMetallic;
        transparencySlider.value = 1;
        roughnessValue.textContent = originalRoughness.toFixed(2);
        metallicValue.textContent = originalMetallic.toFixed(2);
        transparencyValue.textContent = (1).toFixed(2);
        updateBaseColor();
    };

    // Limpa a arte do canvas e reinicia o modelo
    const clearArtAndResetModel = () => {
        canvas.getObjects().forEach(obj => {
            if (obj.isType('image')) canvas.remove(obj);
        });
        userImageObjects = {};
        modelViewer.src = `${modelViewer.src.split('?')[0]}?t=${new Date().getTime()}`;
        
        // Esconde os botões de frente e verso ao limpar o modelo
        sideButtonsContainer.style.display = 'none';
    };

    // Popula a biblioteca de modelos com cards clicáveis
    const populateModelLibrary = () => {
        modelGrid.innerHTML = '';
        let globalModelIndex = 0;
        modelData.forEach(category => {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'category-container';
            const categoryHeader = document.createElement('h4');
            categoryHeader.className = 'category-header';
            categoryHeader.innerHTML = `<span>${category.name}</span><i class="fas fa-chevron-down arrow-icon"></i>`;
            categoryContainer.appendChild(categoryHeader);
            const categoryModels = document.createElement('div');
            categoryModels.className = 'category-models collapsed';
            category.models.forEach(model => {
                const card = document.createElement('div');
                card.className = 'model-card';
                card.dataset.index = globalModelIndex;
                card.innerHTML = `<img src="${model.thumbnail}" alt="${model.name}"><p>${model.name}</p>`;
                categoryModels.appendChild(card);
                globalModelIndex++;
            });
            categoryHeader.addEventListener('click', () => {
                const arrowIcon = categoryHeader.querySelector('.arrow-icon');
                categoryModels.classList.toggle('collapsed');
                arrowIcon.classList.toggle('rotated');
            });
            categoryContainer.appendChild(categoryModels);
            modelGrid.appendChild(categoryContainer);
        });
    };

    // Inicializa as linhas de snap do canvas
    const initCanvasSnapping = () => {
        const vLine = new fabric.Line([0, -canvas.height, 0, canvas.height * 2], {
            stroke: '#6a00ff', selectable: false, evented: false, visible: false, strokeWidth: 0.5
        });
        const hLine = new fabric.Line([-canvas.width, 0, canvas.width * 2, 0], {
            stroke: '#6a00ff', selectable: false, evented: false, visible: false, strokeWidth: 0.5
        });
        canvas.add(vLine, hLine);

        canvas.on('object:moving', (options) => {
            const activeObject = options.target;
            if (!activeObject || !canvas.backgroundImage) return;

            const activeArt = userImageObjects[currentArtSide];
            if (activeArt !== activeObject) return;

            const objWidth = activeObject.getScaledWidth();
            const objHeight = activeObject.getScaledHeight();
            const bgRect = canvas.backgroundImage.getBoundingRect();
            const objEdges = {
                left: activeObject.left, right: activeObject.left + objWidth, hCenter: activeObject.left + objWidth / 2,
                top: activeObject.top, bottom: activeObject.top + objHeight, vCenter: activeObject.top + objHeight / 2
            };
            const bgEdges = {
                left: bgRect.left, right: bgRect.left + bgRect.width, hCenter: bgRect.left + bgRect.width / 2,
                top: bgRect.top, bottom: bgRect.top + bgRect.height, vCenter: bgRect.top + bgRect.height / 2
            };

            let snapX = null, snapY = null;
            if (Math.abs(objEdges.left - bgEdges.left) < SNAP_TOLERANCE) snapX = bgEdges.left;
            else if (Math.abs(objEdges.right - bgEdges.right) < SNAP_TOLERANCE) snapX = bgEdges.right - objWidth;
            else if (Math.abs(objEdges.hCenter - bgEdges.hCenter) < SNAP_TOLERANCE) snapX = bgEdges.hCenter - objWidth / 2;
            
            if (Math.abs(objEdges.top - bgEdges.top) < SNAP_TOLERANCE) snapY = bgEdges.top;
            else if (Math.abs(objEdges.bottom - bgEdges.bottom) < SNAP_TOLERANCE) snapY = bgEdges.bottom - objHeight;
            else if (Math.abs(objEdges.vCenter - bgEdges.vCenter) < SNAP_TOLERANCE) snapY = bgEdges.vCenter - objHeight / 2;

            if (snapX !== null) activeObject.left = snapX;
            if (snapY !== null) activeObject.top = snapY;
            
            vLine.set({ left: activeObject.left + objWidth / 2, visible: snapX !== null });
            hLine.set({ top: activeObject.top + objHeight / 2, visible: snapY !== null });
        });

        canvas.on('before:transform', () => { vLine.set({ visible: false }); hLine.set({ visible: false }); });
        canvas.on('mouse:up', () => { vLine.set({ visible: false }); hLine.set({ visible: false }); canvas.renderAll(); });
    };

    // --- Funções para Alternar entre as Faces do Mockup ---
    const switchArtSide = (side) => {
        if (currentArtSide === side || !currentModelConfig) return;

        // Limpa a arte atual do canvas
        canvas.getObjects().forEach(obj => {
            if (obj.isType('image')) canvas.remove(obj);
        });

        // Atualiza a face atual
        currentArtSide = side;

        // Atualiza a classe dos botões
        frenteBtn.classList.remove('active');
        versoBtn.classList.remove('active');
        if (side === 'Frente') {
            frenteBtn.classList.add('active');
        } else {
            versoBtn.classList.add('active');
        }
        
        // Recarrega a arte da face selecionada, se ela existir
        const art = userImageObjects[currentArtSide];
        if (art) {
            canvas.add(art);
            canvas.renderAll();
            canvas.setActiveObject(art);
        }
        
        // Aplica a textura no modelo 3D com a nova face
        updateTextureOnModel();
    };


    // --- Event Listeners Principais ---

    // Lida com a visibilidade dos containers
    controlBoxes.forEach(control => {
        control.addEventListener('click', (event) => {
            event.stopPropagation();
            const box = event.target.closest('.box-mockup');
            if (box) {
                box.classList.toggle('collapsed');
                const hasCollapsed = Array.from(boxes).some(b => b.classList.contains('collapsed'));
                mainContainer.classList.toggle('has-collapsed', hasCollapsed);
            }
        });
    });

    // Eventos dos botões de Frente/Verso
    frenteBtn.addEventListener('click', () => switchArtSide('Frente'));
    versoBtn.addEventListener('click', () => switchArtSide('Verso'));


    // Atualiza o viewer e o canvas quando um novo modelo é carregado
    modelViewer.addEventListener('load', () => {
        if (!modelViewer.model) return;
        const firstMaterial = modelViewer.model.materials[0];
        if (firstMaterial) {
            originalRoughness = firstMaterial.pbrMetallicRoughness.roughnessFactor;
            originalMetallic = firstMaterial.pbrMetallicRoughness.metallicFactor;
        }
        modelViewer.model.materials.forEach(material => { material.transparent = true; });
        resetMaterialProperties();
        applyTexture(null);
        updateUploadBoxUI();
    });

    // Controles de material
    roughnessSlider.addEventListener('input', (event) => {
        if (!modelViewer.model) return;
        const value = parseFloat(event.target.value);
        modelViewer.model.materials.forEach(material => {
            if (material && material.pbrMetallicRoughness) {
                material.pbrMetallicRoughness.setRoughnessFactor(value);
            }
        });
        roughnessValue.textContent = value.toFixed(2);
    });
    
    metallicSlider.addEventListener('input', (event) => {
        if (!modelViewer.model) return;
        const value = parseFloat(event.target.value);
        modelViewer.model.materials.forEach(material => {
            if (material && material.pbrMetallicRoughness) {
                material.pbrMetallicRoughness.setMetallicFactor(value);
            }
        });
        metallicValue.textContent = value.toFixed(2);
    });
    
    transparencySlider.addEventListener('input', (event) => {
        transparencyValue.textContent = parseFloat(event.target.value).toFixed(2);
        updateBaseColor();
    });

    // Upload de imagem para o canvas
    textureUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file || !canvas.backgroundImage) {
            alert("Por favor, selecione um modelo para carregar a planta de fundo primeiro.");
            event.target.value = null;
            return;
        }
        const objectURL = URL.createObjectURL(file);
        canvas.getObjects().forEach(obj => {
            if (obj.isType('image')) canvas.remove(obj);
        });
        fabric.Image.fromURL(objectURL, (img) => {
            userImageObjects[currentArtSide] = img;
            img.center().scaleToWidth(canvas.backgroundImage.getScaledWidth() * 0.8);
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            updateTextureOnModel();
        }, { crossOrigin: 'anonymous' });
        event.target.value = null;
    });

    // Interação com o canvas
    canvas.on('object:modified', () => {
        if (userImageObjects[currentArtSide] === canvas.getActiveObject()) {
            updateTextureOnModel();
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Delete' && userImageObjects[currentArtSide] === canvas.getActiveObject()) {
            canvas.remove(userImageObjects[currentArtSide]);
            delete userImageObjects[currentArtSide];
            applyTexture(null);
        }
    });

    // Seleção de modelos
    modelGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.model-card');
        if (!card) return;
        modal.style.display = 'none';
        clearArtAndResetModel();
        const modelIndex = parseInt(card.dataset.index, 10);
        
        let selectedModel = null;
        let globalIndex = 0;
        for (const category of modelData) {
            if (globalIndex + category.models.length > modelIndex) {
                selectedModel = category.models[modelIndex - globalIndex];
                break;
            }
            globalIndex += category.models.length;
        }
        if (!selectedModel) return;

        currentModelConfig = selectedModel;
        modelViewer.src = selectedModel.modelSrc;
        const uvLayoutPath = selectedModel.sizes[0].uvLayout;
        loadUvLayout(uvLayoutPath);
        updateUploadBoxUI();
        applyTexture(null);

        // Lógica para mostrar os botões apenas para modelos com Frente e Verso
        if (selectedModel.artSides && selectedModel.artSides.Frente && selectedModel.artSides.Verso) {
            sideButtonsContainer.style.display = 'flex';
            switchArtSide('Frente'); // Garante que a face frontal é a padrão
        } else {
            sideButtonsContainer.style.display = 'none';
        }
    });

    // Controles de câmera
    const zoom = (factor) => {
        const [theta, phi, radiusStr] = modelViewer.cameraOrbit.split(' ');
        modelViewer.cameraOrbit = `${theta} ${phi} ${parseFloat(radiusStr) * factor}%`;
    };
    zoomInBtn.addEventListener('click', () => zoom(0.9));
    zoomOutBtn.addEventListener('click', () => zoom(1.1));
    modelosBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === modal) modal.style.display = 'none';
    });

    // Lógica para download da imagem do mockup 3D COM ALTÍSSIMA QUALIDADE
    downloadBtn.addEventListener('click', async () => {
        if (!modelViewer.model) {
            alert("O modelo 3D ainda não foi carregado.");
            return;
        }

        try {
            // Renderiza o mockup para um blob com idealAspect e qualidade máxima (se suportado)
            const mockupBlob = await modelViewer.toBlob({ idealAspect: true, mimeType: 'image/png' });
            const mockupUrl = URL.createObjectURL(mockupBlob);

            // Carrega a imagem do mockup e a marca d'água
            const [mockupImage, watermarkImage] = await Promise.all([
                new Promise(resolve => fabric.Image.fromURL(mockupUrl, resolve, { crossOrigin: 'anonymous' })),
                new Promise(resolve => fabric.Image.fromURL(watermarkImagePath, resolve, { crossOrigin: 'anonymous' }))
            ]);

            // Cria um canvas temporário para compor a imagem final
            const finalCanvas = new fabric.StaticCanvas(null, {
                width: mockupImage.width,
                height: mockupImage.height
            });

            // Adiciona a imagem do mockup ao canvas
            finalCanvas.add(mockupImage);

            // Adiciona a marca d'água ao canvas (AJUSTANDO POSIÇÃO E ESCALA)
            const mockupWidth = mockupImage.width;
            const mockupHeight = mockupImage.height;
            const watermarkAspectRatio = watermarkImage.width / watermarkImage.height;

            let watermarkWidth = mockupWidth; // Tenta cobrir toda a largura
            let watermarkHeight = watermarkWidth / watermarkAspectRatio;

            if (watermarkHeight < mockupHeight) {
                watermarkHeight = mockupHeight;
                watermarkWidth = watermarkHeight * watermarkAspectRatio;
            }

            watermarkImage.set({
                scaleX: watermarkWidth / watermarkImage.width,
                scaleY: watermarkHeight / watermarkImage.height,
                left: (mockupWidth - watermarkWidth) / 2, // Centraliza horizontalmente
                top: (mockupHeight - watermarkHeight) / 2,   // Centraliza verticalmente
                opacity: 0.3 // Reduz a opacidade para não obstruir detalhes
            });
            finalCanvas.add(watermarkImage);

            // Converte o canvas para Data URL com qualidade máxima (quality: 1)
            const finalDataURL = finalCanvas.toDataURL({ format: 'png', quality: 1 });

            // Inicia o download
            const link = document.createElement('a');
            link.href = finalDataURL;
            link.download = 'mockup-renderizado_hq.png'; // Nome do arquivo com "hq" para indicar alta qualidade
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(mockupUrl);

        } catch (error) {
            console.error("Erro ao renderizar o modelo para download:", error);
            alert("Ocorreu um erro ao tentar baixar o mockup. Por favor, tente novamente.");
        }
    });
    
    // --- Carga Inicial da Aplicação ---
    const initialLoad = () => {
        const initialModel = modelData[0].models[0];
        currentModelConfig = initialModel;
        populateModelLibrary();
        modelViewer.src = initialModel.modelSrc;
        const uvLayoutPath = initialModel.sizes[0].uvLayout;
        loadUvLayout(uvLayoutPath);
        initCanvasSnapping();
        updateUploadBoxUI();
    };

    initialLoad();
});