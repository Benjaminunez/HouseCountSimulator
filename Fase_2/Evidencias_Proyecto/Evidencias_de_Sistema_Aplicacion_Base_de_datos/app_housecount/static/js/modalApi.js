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

    const style = document.createElement('style');
    style.innerHTML = `
        #modal-admin-api input:focus, #modal-admin-api select:focus {
            border-color: #e67e22 !important;
            background: #fff !important;
            box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.1);
        }
        #btn-admin-api-guardar:hover {
            background: #d35400 !important;
            transform: translateY(-2px);
        }
        #btn-admin-api-cancelar:hover, #btn-admin-api-limpiar:hover, #btn-admin-api-recargar:hover {
            background: #e2e2e2 !important;
        }
        #btn-admin-api-cargar:hover {
            background: #2980b9 !important;
        }
    `;
    document.head.appendChild(style);

    const htmlModalAdmin = `
        <div id="modal-admin-api" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); z-index: 1000000; justify-content: center; align-items: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            
            <!-- CONTENEDOR PRINCIPAL -->
            <div style="display: flex; flex-direction: row; gap: 20px; width: 95%; max-width: 1050px; height: 550px; max-height: 90vh; background: transparent;">
                
                <!-- COLUMNA IZQ: FORMULARIO -->
                <div style="flex: 1; background: #ffffff; color: #333; border-radius: 20px; display: flex; flex-direction: column; box-shadow: 0 15px 35px rgba(0,0,0,0.1); overflow: hidden; height: 100%;">
                    
                    <div style="display: flex; background: #f8f9fa; border-bottom: 1px solid #eaeaea; min-height: 55px;">
                        <button id="tab-izq-crear" style="flex: 1; padding: 15px; background: #ffffff; color: #e67e22; border: none; border-bottom: 3px solid #e67e22; cursor: pointer; font-weight: bold; font-size: 15px; outline: none; transition: all 0.3s;">Crear Nuevo</button>
                        <button id="tab-izq-editar" style="flex: 1; padding: 15px; background: transparent; color: #888; border: none; border-bottom: 3px solid transparent; cursor: pointer; font-size: 15px; outline: none; transition: all 0.3s;">Editar Existente</button>
                    </div>

                    <div style="padding: 30px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; flex-grow: 1;">
                        
                        <div id="bloque-busqueda-id" style="display: none; flex-direction: column; gap: 10px; background: #fdfbf7; padding: 20px; border-radius: 12px; border: 1px solid #f0e6d2;">
                            <span style="font-size: 14px; font-weight: bold; color: #555; text-align: center;">Ingrese el ID del material a modificar</span>
                            <div style="display: flex; gap: 10px;">
                                <input type="text" id="admin-api-id" placeholder="Ej. 12" style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #ddd; background: #fff; color: #333; outline: none; font-weight: bold; font-size: 15px;">
                                <button id="btn-admin-api-cargar" style="padding: 12px 20px; background: #3498db; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.3s;">Cargar</button>
                                <button id="btn-admin-api-limpiar" style="padding: 12px 20px; background: #e0e0e0; color: #555; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.3s;">Limpiar</button>
                            </div>
                        </div>

                        <div>
                            <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #555;">Nombre del Material</label>
                            <input type="text" id="admin-api-nombre" placeholder="Ej. Ventana de aluminio" style="width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #ddd; background: #fafafa; color: #333; box-sizing: border-box; outline: none; font-size: 14px; transition: border 0.3s;">
                        </div>
                        
                        <div style="display: flex; gap: 20px;">
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #555;">Coste (CLP)</label>
                                <input type="number" id="admin-api-coste" placeholder="Ej. 30000" style="width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #ddd; background: #fafafa; color: #333; box-sizing: border-box; outline: none; font-size: 14px;">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #555;">Categoría</label>
                                <select id="admin-api-categoria" style="width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #ddd; background: #fafafa; color: #333; box-sizing: border-box; outline: none; font-size: 14px; cursor: pointer;">
                                    <option value="Extras">Extras</option>
                                    <option value="Habitacion">Habitacion</option>
                                    <option value="Cocina">Cocina</option>
                                    <option value="Baño">Baño</option>
                                    <option value="Living">Living</option>
                                    <option value="Estructura">Estructura</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: flex; gap: 20px;">
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #555;">Dimensiones</label>
                                <input type="text" id="admin-api-dimensiones" placeholder="Ej. 80cm x 60cm" style="width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #ddd; background: #fafafa; color: #333; box-sizing: border-box; outline: none; font-size: 14px;">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #555;">Unidad de Medida</label>
                                <input type="text" id="admin-api-unidad" placeholder="Ej. Unidad" value="Unidad" style="width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #ddd; background: #fafafa; color: #333; box-sizing: border-box; outline: none; font-size: 14px;">
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: center; gap: 15px; margin-top: auto; padding-top: 20px;">
                            <button id="btn-admin-api-cancelar" style="padding: 12px 30px; background: #f1f2f6; color: #555; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; transition: background 0.3s;">Cancelar</button>
                            <button id="btn-admin-api-guardar" style="padding: 12px 30px; background: #e67e22; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; box-shadow: 0 4px 10px rgba(230, 126, 34, 0.3); transition: transform 0.2s, box-shadow 0.2s;">ENVIAR DATOS</button>
                        </div>
                    </div>
                </div>

                <!-- COLUMNA DER: VISOR JSON -->
                <div style="flex: 1; display: flex; flex-direction: column; background: #ffffff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); overflow: hidden; height: 100%;">
                    
                <div style="background: #f8f9fa; padding: 15px 20px; border-bottom: 1px solid #eaeaea; display: flex; justify-content: space-between; align-items: center; min-height: 55px; box-sizing: border-box;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="font-weight: bold; color: #555; font-size: 14px;">📡 GlobalBuild API B2B</span>
                        <!-- Notificación visual de Sync -->
                        <span id="admin-api-sync-status" style="font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 20px; opacity: 0; transition: opacity 0.4s ease, transform 0.4s ease; transform: translateY(-3px);"></span>
                    </div>
                    <button id="btn-admin-api-recargar" style="background: white; border: 1px solid #ddd; color: #555; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 12px; font-weight: 600; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: background 0.3s;">Refrescar Red</button>
                </div>
                                    
                    <div id="contenedor-tabs-api" style="display: flex; background: #ffffff; border-bottom: 1px solid #eaeaea; overflow-x: auto; min-height: 45px; padding: 0 10px;"></div>
                    
                    <!-- Visor JSON con fondo oscuro suave para resaltar el código -->
                    <pre id="visor-json-api" style="margin: 0; padding: 20px; background: #282c34; color: #abb2bf; font-family: 'Consolas', 'Courier New', monospace; font-size: 13.5px; overflow-y: auto; flex-grow: 1; height: 0; border-top-left-radius: 10px; border-top-right-radius: 10px; line-height: 1.5;"></pre>
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
        btnGuardar.innerHTML = 'Guardar en Api'; btnGuardar.style.background = '#27ae60';
    };

    tabEditar.onclick = () => {
        modoEdicion = true;
        limpiarFormulario();
        tabEditar.style.background = '#222'; tabEditar.style.color = '#e67e22'; tabEditar.style.borderTop = '3px solid #e67e22';
        tabCrear.style.background = '#1a1a1a'; tabCrear.style.color = '#888'; tabCrear.style.borderTop = '3px solid transparent';
        bloqueBusqueda.style.display = 'flex';
        btnGuardar.innerHTML = '💾 Actualizar Registro'; btnGuardar.style.background = '#e67e22';
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
    // LEER DESDE LA NUBE Y SINCRONIZAR AUTOMÁTICAMENTE
    async function recargarVisorJSON() {
        visorJson.style.color = '#ccc';
        visorJson.innerHTML = "Descargando datos desde GlobalBuild API...";
        try {
            // 1. Descarga los datos de MockAPI
            const resp = await fetch(URL_API_EXTERNA);
            if (!resp.ok) throw new Error("Error de red");
            const data = await resp.json();
            
            // 2. Muestra los datos en la interfaz instantáneamente
            materialesCargados = data; 
            renderTabsVisor();
            renderVisor();
            
            // 3. 🔥 SINCRONIZACIÓN AUTOMÁTICA SILENCIOSA 🔥
            // Fíjate que NO usamos "await" aquí. Esto hace que el navegador 
            // no se quede esperando. Envía la orden a Django en segundo plano y sigue su camino.
            fetch('/api/sincronizar/')
                .then(response => response.json())
                .then(data => {
                    const statusUI = document.getElementById('admin-api-sync-status');
                    if (statusUI) {
                        if (data.status === 'success') {
                            // Extraemos el número para ver si se agregaron nuevos
                            const nuevos = data.mensaje.match(/\d+/);
                            const cantidad = nuevos ? parseInt(nuevos[0]) : 0;
                            
                            if (cantidad > 0) {
                                statusUI.innerHTML = `📥 ¡${cantidad} nuevos guardados en DB!`;
                                statusUI.style.background = '#e67e22'; // Naranja alerta
                                statusUI.style.color = '#ffffff';
                            } else {
                                statusUI.innerHTML = `✅ DB Local Sincronizada`;
                                statusUI.style.background = '#e8f8f5'; // Verde claro
                                statusUI.style.color = '#27ae60';
                            }
                        } else {
                            statusUI.innerHTML = `❌ Error en DB Local`;
                            statusUI.style.background = '#fdedec';
                            statusUI.style.color = '#c0392b';
                        }
                        
                        // Mostrar animación de entrada
                        statusUI.style.opacity = '1';
                        statusUI.style.transform = 'translateY(0)';
                        
                        // Ocultar suavemente después de 4 segundos
                        setTimeout(() => {
                            statusUI.style.opacity = '0';
                            statusUI.style.transform = 'translateY(-3px)';
                        }, 4000);
                    }
                })
                .catch(err => console.error("Error en sync de fondo:", err));
            
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