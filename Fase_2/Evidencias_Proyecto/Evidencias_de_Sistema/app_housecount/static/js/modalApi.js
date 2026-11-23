// =====================================================================
// --- MODAL DE ADMINISTRADOR: CONSUMO DE API EXTERNA (INGLÉS) ---
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
    const esAdmin = typeof window.esAdminGlobal !== 'undefined' && window.esAdminGlobal;
    if (!esAdmin) return; 

    // 🔴 REEMPLAZA ESTO CON TU URL REAL DE MOCKAPI (Asegúrate de que termine en /materials)
    const URL_API_EXTERNA = 'https://6b039f099e7cafb37dbf675e.mockapi.io/api/v1/materials';
    
    let materialesCargados = []; 
    let categoriaSeleccionada = 'Todos';
    let modoEdicion = false; 

    const htmlModalAdmin = `
    <div id="modal-admin-api" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 1000000; justify-content: center; align-items: center; font-family: 'Segoe UI', sans-serif;">
        <div style="display: flex; flex-direction: row; gap: 20px; width: 95%; max-width: 1050px; background: transparent;">
            
            <!-- COLUMNA IZQ: FORMULARIO -->
            <div style="flex: 1; background: #222; color: white; border-radius: 10px; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.8); overflow: hidden;">
                
                <div style="display: flex; background: #1a1a1a; border-bottom: 1px solid #333;">
                    <button id="tab-izq-crear" style="flex: 1; padding: 15px; background: #222; color: #f39c12; border: none; border-top: 3px solid #f39c12; cursor: pointer; font-weight: bold; font-size: 14px; outline: none;">➕ Crear Nuevo</button>
                    <button id="tab-izq-editar" style="flex: 1; padding: 15px; background: #1a1a1a; color: #888; border: none; border-top: 3px solid transparent; cursor: pointer; font-size: 14px; outline: none;">✏️ Editar Existente</button>
                </div>

                <div style="padding: 25px; display: flex; flex-direction: column; gap: 15px;">
                    
                    <div id="bloque-busqueda-id" style="display: none; gap: 10px; background: #1a1a1a; padding: 15px; border-radius: 5px; border: 1px dashed #555;">
                        <input type="text" id="admin-api-id" placeholder="ID del material" style="width: 130px; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #333; color: #f39c12; outline: none; font-weight: bold;">
                        <button id="btn-admin-api-cargar" style="padding: 8px 12px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">⬇️ Cargar Datos</button>
                        <button id="btn-admin-api-limpiar" style="padding: 8px 12px; background: #5a5a5a; color: white; border: none; border-radius: 4px; cursor: pointer;">🧹 Limpiar</button>
                    </div>

                    <div>
                        <label style="display: block; font-size: 13px; margin-bottom: 5px; color: #bbb;">Nombre del Material:</label>
                        <input type="text" id="admin-api-nombre" placeholder="Ej. Banca, Ventana, Puerta..." style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #333; color: white; box-sizing: border-box; outline: none;">
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 13px; margin-bottom: 5px; color: #bbb;">Coste (CLP):</label>
                            <input type="number" id="admin-api-coste" placeholder="Ej. 30000" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #333; color: white; box-sizing: border-box; outline: none;">
                        </div>
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 13px; margin-bottom: 5px; color: #bbb;">Categoría:</label>
                            <select id="admin-api-categoria" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #333; color: white; box-sizing: border-box; outline: none;">
                                <option value="Extras">Extras</option>
                                <option value="Habitacion">Habitacion</option>
                                <option value="Cocina">Cocina</option>
                                <option value="Baño">Baño</option>
                                <option value="Living">Living</option>
                                <option value="Estructura">Estructura</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: flex; gap: 15px;">
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 13px; margin-bottom: 5px; color: #bbb;">Dimensiones:</label>
                            <input type="text" id="admin-api-dimensiones" placeholder="Ej. 80cm x 60cm" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #333; color: white; box-sizing: border-box; outline: none;">
                        </div>
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 13px; margin-bottom: 5px; color: #bbb;">Unidad de Medida:</label>
                            <input type="text" id="admin-api-unidad" placeholder="Ej. Unidad, m², Saco" value="Unidad" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #333; color: white; box-sizing: border-box; outline: none;">
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;">
                        <button id="btn-admin-api-cancelar" style="padding: 10px 15px; background: #5a5a5a; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Cerrar Panel</button>
                        <button id="btn-admin-api-guardar" style="padding: 10px 15px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Guardar en Nube</button>
                    </div>
                </div>
            </div>

            <!-- COLUMNA DER: VISOR JSON -->
            <div style="flex: 1; display: flex; flex-direction: column; background: #1e1e1e; border-radius: 10px; border: 1px solid #333; box-shadow: 0 10px 25px rgba(0,0,0,0.8); overflow: hidden;">
                <div style="background: #2d2d2d; padding: 10px 15px; font-size: 12px; color: #ccc; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: monospace;">☁️ GET API Externa (GlobalBuild B2B)</span>
                    <button id="btn-admin-api-recargar" style="background: none; border: 1px solid #555; color: #ddd; border-radius: 4px; padding: 3px 8px; cursor: pointer; font-size: 11px;">🔄 Refrescar Red</button>
                </div>
                
                <div id="contenedor-tabs-api" style="display: flex; background: #252526; border-bottom: 1px solid #333; overflow-x: auto; min-height: 35px;"></div>
                <pre id="visor-json-api" style="margin: 0; padding: 15px; color: #9cdcfe; font-family: Consolas, monospace; font-size: 13px; overflow-y: auto; max-height: 480px; flex-grow: 1;">Contactando servidor externo...</pre>
            </div>
            
        </div>
    </div>
    `;
    
    if (!document.getElementById('modal-admin-api')) {
        document.body.insertAdjacentHTML('beforeend', htmlModalAdmin);
    }
    
    const modal = document.getElementById('modal-admin-api');
    const visorJson = document.getElementById('visor-json-api');

    const tabCrear = document.getElementById('tab-izq-crear');
    const tabEditar = document.getElementById('tab-izq-editar');
    const bloqueBusqueda = document.getElementById('bloque-busqueda-id');
    const btnGuardar = document.getElementById('btn-admin-api-guardar');
    const btnLimpiar = document.getElementById('btn-admin-api-limpiar');

    function limpiarFormulario() {
        document.getElementById('admin-api-id').value = '';
        document.getElementById('admin-api-nombre').value = '';
        document.getElementById('admin-api-coste').value = '';
        document.getElementById('admin-api-dimensiones').value = '';
        document.getElementById('admin-api-unidad').value = 'Unidad';
    }

    tabCrear.onclick = () => {
        modoEdicion = false;
        limpiarFormulario();
        tabCrear.style.background = '#222'; tabCrear.style.color = '#f39c12'; tabCrear.style.borderTop = '3px solid #f39c12';
        tabEditar.style.background = '#1a1a1a'; tabEditar.style.color = '#888'; tabEditar.style.borderTop = '3px solid transparent';
        bloqueBusqueda.style.display = 'none';
        btnGuardar.innerHTML = 'Guardar en Nube'; btnGuardar.style.background = '#27ae60';
    };

    tabEditar.onclick = () => {
        modoEdicion = true;
        limpiarFormulario();
        tabEditar.style.background = '#222'; tabEditar.style.color = '#e67e22'; tabEditar.style.borderTop = '3px solid #e67e22';
        tabCrear.style.background = '#1a1a1a'; tabCrear.style.color = '#888'; tabCrear.style.borderTop = '3px solid transparent';
        bloqueBusqueda.style.display = 'flex';
        btnGuardar.innerHTML = '💾 Actualizar Nube'; btnGuardar.style.background = '#e67e22';
    };

    btnLimpiar.onclick = limpiarFormulario;

    // --- AQUÍ TRADUCIMOS DEL INGLÉS AL ESPAÑOL AL CARGAR ---
    const btnCargar = document.getElementById('btn-admin-api-cargar');
    btnCargar.onclick = () => {
        const idBuscado = document.getElementById('admin-api-id').value.toString();
        if (!idBuscado) return alert("Ingresa un ID.");
        
        const material = materialesCargados.find(m => m.id.toString() === idBuscado);
        if (material) {
            // Mapeo: campos en inglés de la API -> inputs en español del formulario
            document.getElementById('admin-api-nombre').value = material.name || '';
            document.getElementById('admin-api-coste').value = material.price || '';
            document.getElementById('admin-api-dimensiones').value = material.dimensions || '';
            document.getElementById('admin-api-unidad').value = material.unit || 'Unidad';
            
            if (material.category) {
                const selectCat = document.getElementById('admin-api-categoria');
                for (let i = 0; i < selectCat.options.length; i++) {
                    if (selectCat.options[i].value === material.category) {
                        selectCat.selectedIndex = i;
                        break;
                    }
                }
            }
        } else {
            alert(`No se encontró en la nube el ID ${idBuscado}.`);
        }
    };

    // --- FILTRADO USANDO LA KEY EN INGLÉS "category" ---
    function renderTabsVisor() {
        const contenedorTabs = document.getElementById('contenedor-tabs-api');
        if (!contenedorTabs) return;

        const categoriasSet = new Set(materialesCargados.map(m => m.category || 'Sin Categoría'));
        const categoriasUnicas = ['Todos', ...Array.from(categoriasSet).sort()];

        contenedorTabs.innerHTML = ''; 

        categoriasUnicas.forEach(cat => {
            const btnTab = document.createElement('button');
            btnTab.innerText = cat;
            btnTab.style.padding = '8px 15px';
            btnTab.style.background = (cat === categoriaSeleccionada) ? '#1e1e1e' : 'transparent';
            btnTab.style.color = (cat === categoriaSeleccionada) ? '#f39c12' : '#888';
            btnTab.style.border = 'none';
            btnTab.style.borderTop = (cat === categoriaSeleccionada) ? '2px solid #f39c12' : '2px solid transparent';
            btnTab.style.cursor = 'pointer';
            btnTab.style.fontSize = '12px';
            btnTab.style.fontWeight = (cat === categoriaSeleccionada) ? 'bold' : 'normal';
            
            btnTab.onclick = () => {
                categoriaSeleccionada = cat;
                renderTabsVisor();  
                renderVisor(); 
            };
            contenedorTabs.appendChild(btnTab);
        });
    }

    function renderVisor() {
        if (!visorJson) return;
        let datosMostrados = materialesCargados;
        
        if (categoriaSeleccionada !== 'Todos') {
            datosMostrados = materialesCargados.filter(m => (m.category || 'Sin Categoría') === categoriaSeleccionada);
        }

        visorJson.style.color = '#9cdcfe';
        visorJson.innerHTML = JSON.stringify(datosMostrados, null, 4);
    }

    // LEER DESDE LA NUBE
    async function recargarVisorJSON() {
        visorJson.style.color = '#ccc';
        visorJson.innerHTML = "Descargando datos desde GlobalBuild API...";
        try {
            const resp = await fetch(URL_API_EXTERNA);
            if (!resp.ok) throw new Error("Error de red");
            const data = await resp.json();
            
            materialesCargados = data; 
            renderTabsVisor();
            renderVisor();
            
        } catch (error) {
            visorJson.style.color = '#e74c3c';
            visorJson.innerHTML = "❌ Error con API Externa:\n" + error.message;
        }
    }

    document.addEventListener('click', (e) => {
        const btnMenu = e.target.closest('#btn-abrir-modal-api');
        if (btnMenu) {
            e.preventDefault(); 
            if (modal) {
                modal.style.display = 'flex';
                tabCrear.click();
                recargarVisorJSON();
            }
        }
    });
    
    const btnCancelar = document.getElementById('btn-admin-api-cancelar');
    if (btnCancelar) btnCancelar.onclick = () => modal.style.display = 'none';

    const btnRecargarJson = document.getElementById('btn-admin-api-recargar');
    if (btnRecargarJson) btnRecargarJson.onclick = recargarVisorJSON;

    // --- AQUÍ TRADUCIMOS DEL ESPAÑOL AL INGLÉS ANTES DE GUARDAR ---
    if (btnGuardar) {
        btnGuardar.onclick = async () => {
            const idMaterial = document.getElementById('admin-api-id').value;
            const nombre = document.getElementById('admin-api-nombre').value.trim();
            const coste = parseInt(document.getElementById('admin-api-coste').value) || 0;
            const categoria = document.getElementById('admin-api-categoria').value;
            const dimensiones = document.getElementById('admin-api-dimensiones').value.trim();
            const unidad_medida = document.getElementById('admin-api-unidad').value.trim();

            if (!nombre || coste <= 0) return alert("Nombre y coste obligatorios.");
            if (modoEdicion && !idMaterial) return alert("Indica el ID a modificar.");

            btnGuardar.disabled = true;
            btnGuardar.innerHTML = '⏳ Subiendo...';

            // Mapeo: variables en español -> claves en inglés para el JSON de la API
            const payload = { 
                name: nombre, 
                price: coste, 
                category: categoria, 
                dimensions: dimensiones, 
                unit: unidad_medida 
            };
            
            let metodoHTTP = 'POST';
            let urlDestino = URL_API_EXTERNA;
            
            if (modoEdicion) {
                metodoHTTP = 'PUT'; 
                urlDestino = `${URL_API_EXTERNA}/${idMaterial}`; 
            }

            try {
                const response = await fetch(urlDestino, {
                    method: metodoHTTP,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                limpiarFormulario(); 
                const tabPrevio = categoriaSeleccionada;
                await recargarVisorJSON(); 
                
                if (tabPrevio !== 'Todos') {
                    categoriaSeleccionada = tabPrevio;
                    renderTabsVisor();
                    renderVisor();
                }
                
                if (modoEdicion) tabCrear.click();
                
            } catch (err) {
                console.error(err);
                alert("Error conectando con la API externa.");
            } finally {
                btnGuardar.disabled = false;
                btnGuardar.innerHTML = modoEdicion ? '💾 Actualizar Nube' : 'Guardar en Nube';
            }
        };
    }
});