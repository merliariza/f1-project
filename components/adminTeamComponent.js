class AdminTeamComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentPanel = 'main'; // Panel principal por defecto
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const styles = `
            <style>
                .admin-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .admin-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    color: #fff;
                }

                .admin-header h2 {
                    font-size: 2.5rem;
                    color: #ff0000;
                    margin-bottom: 1rem;
                }

                .admin-header p {
                    font-size: 1.1rem;
                    opacity: 0.8;
                }

                .admin-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-top: 2rem;
                }

                .admin-card {
                    background: #1f1f27;
                    border: 2px solid rgba(255, 0, 0, 0.2);
                    border-radius: 15px;
                    padding: 2rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .admin-card:hover {
                    transform: translateY(-5px);
                    border-color: #ff0000;
                    box-shadow: 0 5px 15px rgba(255, 0, 0, 0.2);
                }

                .admin-card-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .admin-card-header i {
                    font-size: 2rem;
                    color: #ff0000;
                }

                .admin-card-header h3 {
                    color: #fff;
                    margin: 0;
                    font-size: 1.5rem;
                }

                .admin-card-content {
                    color: rgba(255, 255, 255, 0.8);
                }

                .action-list {
                    list-style: none;
                    padding: 0;
                    margin: 1rem 0 0 0;
                }

                .action-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0;
                    color: rgba(255, 255, 255, 0.7);
                }

                .action-item i {
                    color: #ff0000;
                    font-size: 0.9rem;
                }

                .stats-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-top: 3rem;
                }

                .stat-box {
                    background: rgba(255, 0, 0, 0.1);
                    border-radius: 10px;
                    padding: 1.5rem;
                    text-align: center;
                }

                .stat-box i {
                    font-size: 2rem;
                    color: #ff0000;
                    margin-bottom: 1rem;
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #fff;
                    margin: 0.5rem 0;
                }

                .stat-label {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                }

                .operation-panel {
                    background: #1f1f27;
                    border: 2px solid rgba(255, 0, 0, 0.2);
                    border-radius: 15px;
                    padding: 2rem;
                    margin-top: 2rem;
                }

                .operation-panel h3 {
                    color: #fff;
                    margin-bottom: 1.5rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                }

                .form-group label {
                    display: block;
                    color: #fff;
                    margin-bottom: 0.5rem;
                }

                .form-group input, .form-group select {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid rgba(255, 0, 0, 0.2);
                    background: #2a2a35;
                    color: #fff;
                    border-radius: 5px;
                }

                .button-group {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background: #ff0000;
                    color: #fff;
                }

                .btn-secondary {
                    background: #2a2a35;
                    color: #fff;
                }

                .btn:hover {
                    opacity: 0.8;
                }

                .back-button {
                    margin-bottom: 1rem;
                }

                .hidden {
                    display: none;
                }
            </style>
        `;

        const template = document.createElement('template');
        template.innerHTML = `
            ${styles}
            <div class="admin-container">
                <div id="mainPanel">
                    <div class="admin-header">
                        <h2>Panel de Administración</h2>
                        <p>Gestiona los equipos, pilotos y configuraciones del sistema</p>
                    </div>

                    <div class="stats-container">
                        <div class="stat-box">
                            <i class="fas fa-users"></i>
                            <div class="stat-number">0</div>
                            <div class="stat-label">Equipos Activos</div>
                        </div>
                        <div class="stat-box">
                            <i class="fas fa-helmet-safety"></i>
                            <div class="stat-number">0</div>
                            <div class="stat-label">Pilotos Registrados</div>
                        </div>
                    </div>

                    <div class="admin-options">
                        <div class="admin-card">
                            <div class="admin-card-header">
                                <i class="fas fa-users-gear"></i>
                                <h3>Gestión de Equipos</h3>
                            </div>
                            <div class="admin-card-content">
                                <p>Administra la información de los equipos de F1</p>
                                <ul class="action-list">
                                    <li class="action-item" data-action="agregar-equipo"><i class="fas fa-plus"></i> Agregar nuevo equipo</li>
                                    <li class="action-item" data-action="editar-equipo"><i class="fas fa-edit"></i> Editar información</li>
                                    <li class="action-item" data-action="eliminar-equipo"><i class="fas fa-trash"></i> Eliminar equipo</li>
                                </ul>
                            </div>
                        </div>

                        <div class="admin-card">
                            <div class="admin-card-header">
                                <i class="fas fa-helmet-safety"></i>
                                <h3>Gestión de Pilotos</h3>
                            </div>
                            <div class="admin-card-content">
                                <p>Administra los pilotos y sus asignaciones</p>
                                <ul class="action-list">
                                    <li class="action-item" data-action="agregar-piloto"><i class="fas fa-plus"></i> Agregar nuevo piloto</li>
                                    <li class="action-item" data-action="editar-piloto"><i class="fas fa-user-pen"></i> Actualizar información</li>
                                    <li class="action-item" data-action="cambiar-equipo"><i class="fas fa-arrows-rotate"></i> Cambiar equipo</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Panel de Agregar Equipo -->
                <div id="agregarEquipoPanel" class="operation-panel hidden">
                    <button class="btn btn-secondary back-button" data-action="volver">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                    <h3>Agregar Nuevo Equipo</h3>
                    <form id="agregarEquipoForm">
                        <div class="form-group">
                            <label for="nombreEquipo">Nombre del Equipo: *</label>
                            <input type="text" id="nombreEquipo" name="name" required 
                                   placeholder="Ej: Red Bull Racing">
                        </div>
                        <div class="form-group">
                            <label for="logoEquipo">URL del Logo: *</label>
                            <input type="url" id="logoEquipo" name="logo" required 
                                   placeholder="https://ejemplo.com/logo.png">
                        </div>
                        <div class="form-group">
                            <label for="motorEquipo">Motor: *</label>
                            <input type="text" id="motorEquipo" name="engine" required 
                                   placeholder="Ej: Honda">
                        </div>
                        <div class="form-group">
                            <label for="paisEquipo">País: *</label>
                            <input type="text" id="paisEquipo" name="country" required 
                                   placeholder="Ej: Austria">
                        </div>
                        <div class="form-group">
                            <label for="pilotoSinEquipoSelect">Seleccionar piloto sin equipo (opcional):</label>
                            <select id="pilotoSinEquipoSelect" name="pilotoSinEquipo">
                                <option value="">Seleccione un piloto sin equipo</option>
                            </select>
                        </div>
                        <div class="button-group">
                            <button type="submit" class="btn btn-primary">Guardar Equipo</button>
                            <button type="button" class="btn btn-secondary" data-action="volver">Cancelar</button>
                        </div>
                    </form>
                </div>

                <!-- Panel de Editar Equipo -->
                <div id="editarEquipoPanel" class="operation-panel hidden">
                    <button class="btn btn-secondary back-button" data-action="volver">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                    <h3>Editar Equipo</h3>
                    <form id="editarEquipoForm">
                        <div class="form-group">
                            <label for="equipoSelect">Seleccionar Equipo:</label>
                            <select id="equipoSelect" name="equipoId" required></select>
                        </div>
                        <div class="form-group">
                            <label for="nuevoNombreEquipo">Nuevo Nombre:</label>
                            <input type="text" id="nuevoNombreEquipo" name="nombre" required>
                        </div>
                        <div class="button-group">
                            <button type="submit" class="btn btn-primary">Actualizar Equipo</button>
                            <button type="button" class="btn btn-secondary" data-action="volver">Cancelar</button>
                        </div>
                    </form>
                    <div id="pilotosEquipoContainer">
                        <h4>Pilotos del equipo</h4>
                        <ul id="pilotosEquipoList">
                            <!-- Aquí se mostrarán los pilotos asignados al equipo -->
                        </ul>
                    </div>
                    <div id="agregarPilotoSinEquipoContainer">
                        <h4>Agregar piloto sin equipo</h4>
                        <select id="pilotoSinEquipoSelect" name="pilotoSinEquipo">
                            <option value="">Seleccione un piloto sin equipo</option>
                            <!-- Se llenará con los pilotos sin equipo -->
                        </select>
                        <button id="btnAgregarPilotoASEquipo" class="btn">Agregar Piloto</button>
                    </div>
                </div>

                <!-- Panel de Eliminar Equipo -->
                <div id="eliminarEquipoPanel" class="operation-panel hidden">
                    <button class="btn btn-secondary back-button" data-action="volver">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                    <h3>Eliminar Equipo</h3>
                    <form id="eliminarEquipoForm">
                        <div class="form-group">
                            <label for="equipoEliminarSelect">Seleccionar Equipo a eliminar:</label>
                            <select id="equipoEliminarSelect" name="equipoId" required>
                                <option value="">Seleccione un equipo</option>
                            </select>
                        </div>
                        <div class="button-group">
                            <button type="submit" class="btn btn-primary">Eliminar Equipo</button>
                        </div>
                    </form>
                </div>

                <!-- Panel de Agregar Nuevo Piloto -->
                <div id="agregarPilotoPanel" class="operation-panel hidden">
                    <button class="back-button" data-action="volver">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                    <h3>Agregar Nuevo Piloto</h3>
                    <form id="agregarPilotoForm">
                        <div class="form-group">
                            <label for="pilotoName">Nombre del Piloto: *</label>
                            <input type="text" id="pilotoName" name="name" required placeholder="Ej: Lewis Hamilton">
                        </div>
                        <div class="form-group">
                            <label for="pilotoPhoto">URL de la Foto: *</label>
                            <input type="url" id="pilotoPhoto" name="photo" required placeholder="https://ejemplo.com/foto.jpg">
                        </div>
                        <div class="form-group">
                            <label for="pilotoCountry">País: *</label>
                            <input type="text" id="pilotoCountry" name="country" required placeholder="Ej: Reino Unido">
                        </div>
                        <div class="form-group">
                            <label for="pilotoNumber">Número: *</label>
                            <input type="number" id="pilotoNumber" name="number" required placeholder="Ej: 44">
                        </div>
                        <div class="form-group">
                            <label for="pilotoRole">Rol: *</label>
                            <input type="text" id="pilotoRole" name="role" required placeholder="Ej: Titular">
                        </div>
                        <div class="form-group">
                            <label for="pilotoTeamSelect">Equipo (opcional):</label>
                            <select id="pilotoTeamSelect" name="teamId">
                                <option value="">Sin equipo</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Agregar Piloto</button>
                    </form>
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.setupEventListeners();
        this.cargarEstadisticas();
    }

    setupEventListeners() {
        // Manejador para las acciones principales
        this.shadowRoot.querySelectorAll('[data-action]').forEach(element => {
            element.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]').dataset.action;
                if (action === 'volver') {
                    this.mostrarPanel('main');
                    return;
                }
                this.handleAction(action);
            });
        });

        // Manejador para el formulario de agregar equipo (único listener)
        const formAgregarEquipo = this.shadowRoot.getElementById('agregarEquipoForm');
        if (formAgregarEquipo) {
            formAgregarEquipo.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                await this.agregarEquipo(formData);
            });
        }

        // Manejador para el formulario de editar equipo
        this.shadowRoot.getElementById('editarEquipoForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            await this.editarEquipo(formData.get('equipoId'), formData.get('nombre'));
        });

        // Formulario de eliminar equipo
        const formEliminarEquipo = this.shadowRoot.getElementById('eliminarEquipoForm');
        if (formEliminarEquipo) {
            formEliminarEquipo.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const equipoId = formData.get('equipoId');
                if (!equipoId) {
                    alert('Seleccione un equipo a eliminar');
                    return;
                }
                if (!confirm('¿Está seguro de eliminar este equipo?')) return;
                await this.eliminarEquipo(equipoId);
                this.mostrarPanel('main');
                this.cargarEstadisticas();
            });
        }

        // Validación en tiempo real para la URL del logo
        const logoInput = this.shadowRoot.getElementById('logoEquipo');
        if (logoInput) {
            logoInput.addEventListener('input', (e) => {
                try {
                    new URL(e.target.value);
                    e.target.setCustomValidity('');
                } catch {
                    e.target.setCustomValidity('URL inválida');
                }
            });
        }

        // Evento para el formulario de Agregar Piloto
        const formAgregarPiloto = this.shadowRoot.getElementById('agregarPilotoForm');
        if (formAgregarPiloto) {
            formAgregarPiloto.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                await this.agregarNuevoPiloto(formData);
                this.mostrarPanel('main');
            });
        }

        // Al cambiar la selección del equipo se cargarán los pilotos asignados y se recarga el select de pilotos sin equipo
        const equipoSelect = this.shadowRoot.getElementById('equipoSelect');
        if (equipoSelect) {
            equipoSelect.addEventListener('change', async (e) => {
                const teamId = e.target.value;
                if (teamId) {
                    await this.cargarPilotosEquipo(teamId);
                    await this.cargarPilotosSinEquipoSelect();
                } else {
                    const pilotosEquipoList = this.shadowRoot.getElementById('pilotosEquipoList');
                    if (pilotosEquipoList) {
                        pilotosEquipoList.innerHTML = '';
                    }
                }
            });
        }

        // Evento para agregar piloto sin equipo al equipo seleccionado
        const btnAgregarPiloto = this.shadowRoot.getElementById('btnAgregarPilotoASEquipo');
        if (btnAgregarPiloto) {
            btnAgregarPiloto.addEventListener('click', async (e) => {
                e.preventDefault();
                const equipoSelect = this.shadowRoot.getElementById('equipoSelect');
                const teamId = equipoSelect.value;
                const pilotoSelect = this.shadowRoot.getElementById('pilotoSinEquipoSelect');
                const pilotoId = pilotoSelect.value;
                if (!teamId) {
                    alert('Seleccione primero un equipo.');
                    return;
                }
                if (!pilotoId) {
                    alert('Seleccione un piloto sin equipo para agregar.');
                    return;
                }
                await this.cambiarEquipoPiloto(pilotoId, teamId);
                alert('Piloto asignado al equipo exitosamente.');
                await this.cargarPilotosEquipo(teamId);
                this.cargarEstadisticas();
            });
        }
    }

    handleAction(action) {
        switch(action) {
            case 'agregar-equipo':
                this.mostrarPanel('agregarEquipo');
                break;
            case 'editar-equipo':
                this.mostrarPanel('editarEquipo');
                this.cargarEquiposEnSelect();
                break;
            case 'eliminar-equipo':
                this.mostrarPanel('eliminarEquipo');
                this.cargarEquiposEnSelectEliminar();
                break;
            case 'agregar-piloto':
                this.mostrarPanel('agregarPiloto');
                this.cargarEquiposEnSelectPiloto();
                break;
            // ... otros casos
        }
    }

    mostrarPanel(panelId) {
        // Ocultar todos los paneles
        this.shadowRoot.querySelectorAll('.operation-panel, #mainPanel').forEach(panel => {
            panel.classList.add('hidden');
        });

        // Mostrar el panel seleccionado
        if (panelId === 'main') {
            this.shadowRoot.getElementById('mainPanel').classList.remove('hidden');
        } else {
            this.shadowRoot.getElementById(`${panelId}Panel`).classList.remove('hidden');
        }
    }

    async cargarEquiposEnSelect() {
        try {
            const select = this.shadowRoot.getElementById('equipoSelect');
            const equipos = await this.obtenerEquipos();
            
            select.innerHTML = '<option value="">Seleccione un equipo</option>';
            equipos.forEach(equipo => {
                select.innerHTML += `<option value="${equipo.id}">${equipo.name}</option>`;
            });
        } catch (error) {
            console.error('Error al cargar equipos en select:', error);
            alert('Error al cargar la lista de equipos');
        }
    }

    async cargarEquiposEnSelectEliminar() {
        try {
            const select = this.shadowRoot.getElementById('equipoEliminarSelect');
            const equipos = await this.obtenerEquipos();
            
            select.innerHTML = '<option value="">Seleccione un equipo</option>';
            equipos.forEach(equipo => {
                select.innerHTML += `<option value="${equipo.id}">${equipo.name}</option>`;
            });
        } catch (error) {
            console.error('Error al cargar equipos en select (eliminar):', error);
            alert('Error al cargar la lista de equipos');
        }
    }

    async cargarEquiposEnSelectPiloto() {
        try {
            const select = this.shadowRoot.getElementById('pilotoTeamSelect');
            const equipos = await this.obtenerEquipos();
            
            select.innerHTML = '<option value="">Sin equipo</option>';
            equipos.forEach(equipo => {
                select.innerHTML += `<option value="${equipo.id}">${equipo.name}</option>`;
            });
        } catch (error) {
            console.error('Error al cargar equipos para piloto:', error);
        }
    }

    async obtenerEquipos() {
        try {
            const response = await fetch(`${AdminTeamComponent.API_URL}/teams`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const equipos = await response.json();
            console.log('Equipos recibidos:', equipos);
            
            // Si la respuesta es un objeto con la propiedad "equipos"
            if (!Array.isArray(equipos) && equipos.equipos) {
                return equipos.equipos;
            }

            if (!Array.isArray(equipos)) {
                return [];
            }
            
            return equipos;
        } catch (error) {
            console.error('Error al obtener equipos:', error);
            return [];
        }
    }

    async obtenerPilotos() {
        const response = await fetch('http://localhost:3000/drivers');
        return await response.json();
    }

    async obtenerUltimoId() {
        try {
            const equipos = await this.obtenerEquipos();
            if (!equipos.length) return 0;
            
            // Encontrar el ID más alto
            const maxId = Math.max(...equipos.map(equipo => 
                equipo.id ? parseInt(equipo.id) : 0
            ));
            return maxId;
        } catch (error) {
            console.error('Error al obtener último ID:', error);
            return 0;
        }
    }

    async agregarEquipo(formData) {
        try {
            // 1. Validación de datos
            if (!formData.get('name') || !formData.get('logo') || !formData.get('engine') || !formData.get('country')) {
                throw new Error('Todos los campos son obligatorios');
            }

            // 2. Verificar si el equipo ya existe
            const equipos = await this.obtenerEquipos();
            const nombreEquipo = formData.get('name').trim();
            
            if (equipos.some(equipo => 
                equipo.name.toLowerCase() === nombreEquipo.toLowerCase()
            )) {
                throw new Error('Ya existe un equipo con ese nombre');
            }

            // 3. Obtener el último ID y generar el siguiente
            const ultimoId = await this.obtenerUltimoId();
            const nuevoId = ultimoId + 1;

            // 4. Crear objeto con los datos correctos
            const equipoData = {
                id: nuevoId,
                name: nombreEquipo,
                logo: formData.get('logo').trim(),
                engine: formData.get('engine').trim(),
                country: formData.get('country').trim(),
                active: true
            };

            // 5. Enviar datos al servidor
            const response = await fetch(`${AdminTeamComponent.API_URL}/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(equipoData)
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const equipoCreado = await response.json();
            console.log('Equipo creado:', equipoCreado);

            // 6. Actualizar UI y limpiar formulario
            this.mostrarPanel('main');
            this.cargarEstadisticas();
            this.shadowRoot.getElementById('agregarEquipoForm').reset();
            alert('Equipo agregado con éxito');

        } catch (error) {
            console.error('Error al agregar equipo:', error);
            alert(error.message);
        }
    }

    async editarEquipo(id, nuevoNombre) {
        try {
            const response = await fetch(`${AdminTeamComponent.API_URL}/teams/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: nuevoNombre })
            });
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            this.cargarEstadisticas();
            alert('Equipo actualizado con éxito');
        } catch (error) {
            console.error('Error al editar el equipo:', error);
            alert('Error al actualizar el equipo');
        }
    }

    async eliminarEquipo(id) {
        try {
            const response = await fetch(`${AdminTeamComponent.API_URL}/teams/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            this.cargarEstadisticas();
            alert('Equipo eliminado con éxito');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el equipo');
        }
    }

    async agregarPiloto(nombre, equipoId) {
        try {
            const response = await fetch('http://localhost:3000/drivers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: nombre,
                    teamId: parseInt(equipoId)
                })
            });
            if (response.ok) {
                this.cargarEstadisticas();
                alert('Piloto agregado con éxito');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agregar el piloto');
        }
    }

    async editarPiloto(id, nuevoNombre) {
        try {
            const response = await fetch(`http://localhost:3000/drivers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: nuevoNombre })
            });
            if (response.ok) {
                this.cargarEstadisticas();
                alert('Piloto actualizado con éxito');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar el piloto');
        }
    }

    async cambiarEquipoPiloto(pilotoId, nuevoEquipoId) {
        try {
            const pilotoResponse = await fetch(`http://localhost:3000/drivers/${pilotoId}`);
            const piloto = await pilotoResponse.json();
            
            const response = await fetch(`http://localhost:3000/drivers/${pilotoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...piloto,
                    teamId: parseInt(nuevoEquipoId)
                })
            });
            if (response.ok) {
                this.cargarEstadisticas();
                alert('Equipo del piloto actualizado con éxito');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cambiar el equipo del piloto');
        }
    }

    async cargarEstadisticas() {
        try {
            const equipos = await this.obtenerEquipos();
            const response = await fetch(`${AdminTeamComponent.API_URL}/drivers`);
            const pilotos = await response.json();

            const statBoxes = this.shadowRoot.querySelectorAll('.stat-number');
            statBoxes[0].textContent = Array.isArray(equipos) ? equipos.length : 0;
            statBoxes[1].textContent = Array.isArray(pilotos) ? pilotos.length : 0;
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            // Establecer valores por defecto en caso de error
            const statBoxes = this.shadowRoot.querySelectorAll('.stat-number');
            statBoxes[0].textContent = '0';
            statBoxes[1].textContent = '0';
        }
    }

    async agregarNuevoPiloto(formData) {
        try {
            const name = formData.get('name').trim();
            const photo = formData.get('photo').trim();
            const country = formData.get('country').trim();
            const number = formData.get('number').trim();
            const role = formData.get('role').trim();
            let teamId = formData.get('teamId');
            
            // Validar los campos requeridos
            if (!name || !photo || !country || !number || !role) {
                alert('Todos los campos marcados con * son obligatorios.');
                return;
            }
            
            teamId = teamId && teamId.trim() !== '' ? parseInt(teamId) : null;
            
            const nuevoPiloto = {
                name,
                photo,
                country,
                number: parseInt(number),
                role,
                teamId
            };
            
            const response = await fetch(`http://localhost:3000/drivers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoPiloto)
            });
            
            if (response.ok) {
                // Actualizar las estadísticas
                this.cargarEstadisticas();
                
                // Actualizar componente de pilotos
                const driversComponent = document.querySelector('drivers-component');
                if (driversComponent && typeof driversComponent.loadDrivers === 'function') {
                    driversComponent.loadDrivers();
                }
                
                // Actualizar componente de equipos utilizando loadData() para refrescar la información
                const teamComponent = document.querySelector('team-component');
                if (teamComponent && typeof teamComponent.loadData === 'function') {
                    teamComponent.loadData();
                }
                
                alert('Piloto agregado con éxito');
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.error('Error al agregar el piloto:', error);
            alert('Error al agregar el piloto');
        }
    }

    async cargarPilotosEquipo(teamId) {
        try {
            const pilotos = await this.obtenerPilotos();
            const pilotosEquipo = pilotos.filter(driver => driver.teamId == teamId);
            const listContainer = this.shadowRoot.getElementById('pilotosEquipoList');
            if (listContainer) {
                if (pilotosEquipo.length > 0) {
                    listContainer.innerHTML = pilotosEquipo
                        .map(p => `<li>${p.name} (${p.country})</li>`)
                        .join('');
                } else {
                    listContainer.innerHTML = '<li>No hay pilotos asignados a este equipo.</li>';
                }
            }
        } catch (error) {
            console.error('Error al cargar pilotos del equipo:', error);
        }
    }

    async cargarPilotosSinEquipoSelect() {
        try {
            const response = await fetch('http://localhost:3000/drivers');
            const pilotos = await response.json();
            const pilotosSinEquipo = pilotos.filter(p => !p.teamId);
            const select = this.shadowRoot.getElementById('pilotoSinEquipoSelect');
            if (select) {
                select.innerHTML = '<option value="">Seleccione un piloto sin equipo</option>';
                pilotosSinEquipo.forEach(p => {
                    select.innerHTML += `<option value="${p.id}">${p.name} (${p.country})</option>`;
                });
            }
        } catch (error) {
            console.error('Error al cargar pilotos sin equipo:', error);
        }
    }

    // Constante para la URL base
    static get API_URL() {
        return 'http://localhost:3000';
    }
}

if (!customElements.get('admin-team-component')) {
    customElements.define('admin-team-component', AdminTeamComponent);
} 