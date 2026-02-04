class Tarea {
    constructor(id, nombre, completada = false) {
        this.id = id;
        this.nombre = nombre;
        this.completada = completada;
        this.fechaCreacion = new Date();
    }
    toggleCompletada() {
        this.completada = !this.completada;
    }
    actualizarNombre(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}

class GestorDeTareas {
    constructor() {
        this.tareas = [];
        this.contadorId = 1;
        this.filtroActual = 'all';
    }
    agregarTarea(nombre) {
        if (!nombre || nombre.trim() === '') {
            return false;
        }
        
        const nuevaTarea = new Tarea(this.contadorId, nombre.trim());
        this.tareas.push(nuevaTarea);
        this.contadorId++;
        return true;
    }
    eliminarTarea(id) {
        const indice = this.tareas.findIndex(tarea => tarea.id === id);
        if (indice !== -1) {
            this.tareas.splice(indice, 1);
            return true;
        }
        return false;
    }
    obtenerTareaPorId(id) {
        return this.tareas.find(tarea => tarea.id === id);
    }
    actualizarTarea(id, nuevoNombre) {
        const tarea = this.obtenerTareaPorId(id);
        if (tarea && nuevoNombre && nuevoNombre.trim() !== '') {
            tarea.actualizarNombre(nuevoNombre.trim());
            return true;
        }
        return false;
    }
    toggleCompletada(id) {
        const tarea = this.obtenerTareaPorId(id);
        if (tarea) {
            tarea.toggleCompletada();
            return true;
        }
        return false;
    }
    obtenerTareasFiltradas() {
        switch (this.filtroActual) {
            case 'pending':
                return this.tareas.filter(tarea => !tarea.completada);
            case 'completed':
                return this.tareas.filter(tarea => tarea.completada);
            default:
                return this.tareas;
        }
    }
    obtenerEstadisticas() {
        const total = this.tareas.length;
        const completadas = this.tareas.filter(tarea => tarea.completada).length;
        const pendientes = total - completadas;
        
        return { total, completadas, pendientes };
    }
    cambiarFiltro(filtro) {
        if (['all', 'pending', 'completed'].includes(filtro)) {
            this.filtroActual = filtro;
        }
    }
}

class InterfazUsuario {
    constructor() {
        this.gestor = new GestorDeTareas();
        this.tareaEditando = null;
        this.inicializarElementos();
        this.configurarEventListeners();
        this.cargarDesdeLocalStorage();
        this.actualizarUI();
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }

    inicializarElementos() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.validationMessage = document.getElementById('validationMessage');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.taskStats = document.getElementById('taskStats');
        this.editModal = document.getElementById('editModal');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.saveEditBtn = document.getElementById('saveEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');
    }

    configurarEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.agregarTarea());

        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.agregarTarea();
            }
        });
        
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filtro = e.target.dataset.filter;
                this.cambiarFiltro(filtro);
            });
        });

        this.saveEditBtn.addEventListener('click', () => this.guardarEdicion());
        this.cancelEditBtn.addEventListener('click', () => this.cerrarModal());

        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.cerrarModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.editModal.classList.contains('active')) {
                this.cerrarModal();
            }
        });
    }

    agregarTarea() {
        const nombreTarea = this.taskInput.value;

        if (!nombreTarea || nombreTarea.trim() === '') {
            this.mostrarMensajeValidacion('Por favor, ingresa una tarea válida.', 'error');
            this.taskInput.focus();
            return;
        }
     
        const exito = this.gestor.agregarTarea(nombreTarea);
        
        if (exito) {
            this.taskInput.value = '';
            this.validationMessage.textContent = '';
            this.actualizarUI();
            this.guardarEnLocalStorage();
            this.mostrarMensajeValidacion('Tarea agregada correctamente.', 'success');         
            this.taskInput.focus();
        }
    }

    eliminarTarea(id) {
        const exito = this.gestor.eliminarTarea(id);
        
        if (exito) {
            this.actualizarUI();
            this.guardarEnLocalStorage();
            this.mostrarMensajeValidacion('Tarea eliminada correctamente.', 'success');
        }
    }

    editarTarea(id) {
        const tarea = this.gestor.obtenerTareaPorId(id);
        
        if (tarea) {
            this.tareaEditando = id;
            this.editTaskInput.value = tarea.nombre;
            this.editModal.classList.add('active');
            this.editTaskInput.focus();
            this.editTaskInput.select();
        }
    }

    guardarEdicion() {
        if (this.tareaEditando) {
            const nuevoNombre = this.editTaskInput.value;
            
            if (!nuevoNombre || nuevoNombre.trim() === '') {
                this.mostrarMensajeValidacion('El nombre de la tarea no puede estar vacío.', 'error');
                return;
            }
            
            const exito = this.gestor.actualizarTarea(this.tareaEditando, nuevoNombre);
            
            if (exito) {
                this.actualizarUI();
                this.guardarEnLocalStorage();
                this.mostrarMensajeValidacion('Tarea actualizada correctamente.', 'success');
            }
            
            this.cerrarModal();
        }
    }

    cerrarModal() {
        this.editModal.classList.remove('active');
        this.tareaEditando = null;
        this.editTaskInput.value = '';
    }

    toggleCompletada(id) {
        const exito = this.gestor.toggleCompletada(id);
        
        if (exito) {
            this.actualizarUI();
            this.guardarEnLocalStorage();
        }
    }

    cambiarFiltro(filtro) {
        this.gestor.cambiarFiltro(filtro);
        

        this.filterButtons.forEach(btn => {
            if (btn.dataset.filter === filtro) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        this.actualizarUI();
    }

    mostrarMensajeValidacion(mensaje, tipo) {
        this.validationMessage.textContent = mensaje;
        this.validationMessage.style.color = tipo === 'error' ? '#e74c3c' : '#2ecc71';
        
        if (tipo === 'success') {
            setTimeout(() => {
                this.validationMessage.textContent = '';
            }, 3000);
        }
    }

    renderizarTareas() {

        this.taskList.innerHTML = '';
        const tareasFiltradas = this.gestor.obtenerTareasFiltradas();
        if (tareasFiltradas.length === 0) {
            this.emptyState.style.display = 'block';
            
      
            const mensaje = this.emptyState.querySelector('p');
            switch (this.gestor.filtroActual) {
                case 'pending':
                    mensaje.textContent = '¡No hay tareas pendientes!';
                    break;
                case 'completed':
                    mensaje.textContent = 'No hay tareas completadas aún.';
                    break;
                default:
                    mensaje.textContent = 'No hay tareas aún. ¡Agrega tu primera tarea!';
            }
        } else {
            this.emptyState.style.display = 'none';
        }
        
   
        tareasFiltradas.forEach(tarea => {
            const tareaElement = this.crearElementoTarea(tarea);
            this.taskList.appendChild(tareaElement);
        });
    }


    crearElementoTarea(tarea) {
        const li = document.createElement('li');
        li.className = `task-item ${tarea.completada ? 'completed' : ''}`;
        li.dataset.id = tarea.id;
    
        const fechaFormateada = tarea.fechaCreacion.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${tarea.completada ? 'checked' : ''}>
                <span class="task-text">${this.escapeHTML(tarea.nombre)}</span>
                <span class="task-date">${fechaFormateada}</span>
            </div>
            <div class="task-actions">
                <button class="btn btn-warning btn-sm edit-btn" title="Editar tarea">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm delete-btn" title="Eliminar tarea">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;

        const checkbox = li.querySelector('.task-checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        
        checkbox.addEventListener('click', () => this.toggleCompletada(tarea.id));
        editBtn.addEventListener('click', () => this.editarTarea(tarea.id));
        deleteBtn.addEventListener('click', () => this.eliminarTarea(tarea.id));
        
        return li;
    }

    escapeHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    actualizarEstadisticas() {
        const { total, completadas, pendientes } = this.gestor.obtenerEstadisticas();
        this.taskStats.textContent = `Total: ${total} | Pendientes: ${pendientes} | Completadas: ${completadas}`;
    }

    actualizarUI() {
        this.renderizarTareas();
        this.actualizarEstadisticas();
    }

    
    guardarEnLocalStorage() {
        const datos = {
            tareas: this.gestor.tareas,
            contadorId: this.gestor.contadorId
        };
        localStorage.setItem('gestorTareas', JSON.stringify(datos));
    }

    cargarDesdeLocalStorage() {
        const datosGuardados = localStorage.getItem('gestorTareas');
        
        if (datosGuardados) {
            try {
                const datos = JSON.parse(datosGuardados);

                if (datos.tareas && Array.isArray(datos.tareas)) {
                    this.gestor.tareas = datos.tareas.map(tareaData => {
                        const tarea = new Tarea(tareaData.id, tareaData.nombre, tareaData.completada);
                        tarea.fechaCreacion = new Date(tareaData.fechaCreacion);
                        return tarea;
                    });
                }
                if (datos.contadorId) {
                    this.gestor.contadorId = datos.contadorId;
                }
                
                this.mostrarMensajeValidacion('Tareas cargadas desde el almacenamiento local.', 'success');
            } catch (error) {
                console.error('Error al cargar datos desde localStorage:', error);
                this.mostrarMensajeValidacion('Error al cargar las tareas guardadas.', 'error');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new InterfazUsuario();

    window.app = app;
});