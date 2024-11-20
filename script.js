const sidebar = document.querySelector('.sidebar');
const menubtn = document.querySelector('.menu-btn');

menubtn.addEventListener('click', () => {
    sidebar.classList.toggle('active'); 
});

let personas = [];
let proyectos = [];
let asociaciones = [];
let editIndex = -1;
let editProjectIndex = -1;

function showForm(formId) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`form-${formId}`).style.display = 'block';

    if (formId === 'asociar') {
        cargarSelects();
    }
}

function guardarPersona(event) {
    event.preventDefault();

    const persona = {
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        tipoIdentificacion: document.getElementById('tipoIdentificacion').value, 
        identificacion: document.getElementById('identificacion').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        ciudadResidencia: document.getElementById('ciudadResidencia').value,
        direccion: document.getElementById('direccion').value
    };

    if (editIndex === -1) {
        personas.push(persona); 
    } else {
        const oldIdentificacion = personas[editIndex].identificacion; 
        personas[editIndex] = persona; 
        
        
        asociaciones.forEach(asociacion => {
            if (asociacion.persona.identificacion === oldIdentificacion) {
                asociacion.persona = { ...persona }; 
            }
        });

        editIndex = -1;
    }

    document.getElementById('personasForm').reset();
    mostrarPersonas();
    mostrarAsociaciones(); 
}

function mostrarPersonas(filteredPersonas = personas) {
    const listadoPersonas = document.getElementById('listadoPersonas');
    listadoPersonas.innerHTML = '';

    filteredPersonas.forEach((persona, index) => {
        const li = document.createElement('li');
        li.textContent = `${persona.nombres} ${persona.apellidos} - ${persona.tipoIdentificacion}: ${persona.identificacion}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-btn');
        editButton.onclick = () => editarPersona(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = () => eliminarPersona(index);

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        listadoPersonas.appendChild(li);
    });
}

function editarPersona(index) {
    const persona = personas[index];
    document.getElementById('nombres').value = persona.nombres;
    document.getElementById('apellidos').value = persona.apellidos;
    document.getElementById('tipoIdentificacion').value = persona.tipoIdentificacion;
    document.getElementById('identificacion').value = persona.identificacion;
    document.getElementById('fechaNacimiento').value = persona.fechaNacimiento;
    document.getElementById('ciudadResidencia').value = persona.ciudadResidencia;
    document.getElementById('direccion').value = persona.direccion;

    editIndex = index;
}

function eliminarPersona(index) {
    const persona = personas[index];

    const tieneAsociaciones = asociaciones.some(asociacion => asociacion.persona.identificacion === persona.identificacion);
    if (tieneAsociaciones) {
        alert("No se puede eliminar esta persona porque tiene proyectos asociados.");
        return;
    }

    personas.splice(index, 1);
    mostrarPersonas();
    mostrarAsociaciones();
}

function guardarProyecto(event) {
    event.preventDefault();

    const nuevoProyecto = {
        nombreProyecto: document.getElementById('nombreProyecto').value,
        fechaCreacion: document.getElementById('fechaCreacion').value,
        fechaFin: document.getElementById('fechaFin').value,
        objetivo: document.getElementById('objetivo').value,
        presupuesto: document.getElementById('presupuesto').value
    };

    if (editProjectIndex === -1) {
        proyectos.push(nuevoProyecto);
    } else {
        const oldNombreProyecto = proyectos[editProjectIndex].nombreProyecto;
        proyectos[editProjectIndex] = nuevoProyecto;

        
        asociaciones.forEach(asociacion => {
            if (asociacion.proyecto.nombreProyecto === oldNombreProyecto) {
                asociacion.proyecto = { ...nuevoProyecto }; 
            }
        });

        editProjectIndex = -1;
    }

    document.getElementById('proyectosForm').reset();
    mostrarProyectos();
    mostrarAsociaciones();
}

function mostrarProyectos(filteredProyectos = proyectos) {
    const listadoProyectos = document.getElementById('listadoProyectos');
    listadoProyectos.innerHTML = '';

    filteredProyectos.forEach((proyecto, index) => {
        const proyectoItem = document.createElement('li');
        proyectoItem.innerHTML = `
            <strong>${proyecto.nombreProyecto}</strong><br>
            Fecha Creación: ${proyecto.fechaCreacion}<br>
            Fecha Fin: ${proyecto.fechaFin}<br>
            Objetivo: ${proyecto.objetivo}<br>
            Presupuesto: $${proyecto.presupuesto}<br>
            <button class="edit-btn" onclick="editarProyecto(${index})">Editar</button>
            <button class="delete-btn" onclick="eliminarProyecto(${index})">Eliminar</button>
        `;
        listadoProyectos.appendChild(proyectoItem);
    });
}

function editarProyecto(index) {
    const proyecto = proyectos[index];
    document.getElementById('nombreProyecto').value = proyecto.nombreProyecto;
    document.getElementById('fechaCreacion').value = proyecto.fechaCreacion;
    document.getElementById('fechaFin').value = proyecto.fechaFin;
    document.getElementById('objetivo').value = proyecto.objetivo;
    document.getElementById('presupuesto').value = proyecto.presupuesto;

    editProjectIndex = index;
}

function eliminarProyecto(index) {
    const proyecto = proyectos[index];
    const tieneAsociaciones = asociaciones.some(asociacion => asociacion.proyecto.nombreProyecto === proyecto.nombreProyecto);

    if (tieneAsociaciones) {
        alert("No se puede eliminar este proyecto porque tiene personas asociadas.");
        return;
    }

    proyectos.splice(index, 1);
    mostrarProyectos();
    mostrarAsociaciones();
}

function cargarSelects() {
    const selectPersona = document.getElementById('selectPersona');
    const selectProyecto = document.getElementById('selectProyecto');

    selectPersona.innerHTML = '';
    selectProyecto.innerHTML = '';

    personas.forEach((persona, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${persona.nombres} ${persona.apellidos}`;
        selectPersona.appendChild(option);
    });

    proyectos.forEach((proyecto, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = proyecto.nombreProyecto;
        selectProyecto.appendChild(option);
    });
}

function asociarPersonaProyecto(event) {
    event.preventDefault();

    const personaIndex = document.getElementById('selectPersona').value;
    const proyectoIndex = document.getElementById('selectProyecto').value;

    const nuevaAsociacion = {
        persona: { ...personas[personaIndex] },
        proyecto: { ...proyectos[proyectoIndex] }
    };

    asociaciones.push(nuevaAsociacion);
    mostrarAsociaciones();
}

function mostrarAsociaciones() {
    const listadoAsociaciones = document.getElementById('listadoAsociaciones');
    listadoAsociaciones.innerHTML = '';

    asociaciones.forEach((asociacion, index) => {
        const asociacionItem = document.createElement('li');
        asociacionItem.innerHTML = `
            <strong>${asociacion.persona.nombres} ${asociacion.persona.apellidos}</strong> - 
            Proyecto: <strong>${asociacion.proyecto.nombreProyecto}</strong><br>
            <button class="edit-btn" onclick="editarAsociacion(${index})">Editar</button>
            <button class="delete-btn" onclick="eliminarAsociacion(${index})">Eliminar</button>
        `;
        listadoAsociaciones.appendChild(asociacionItem);
    });
}

function editarAsociacion(index) {
    const asociacion = asociaciones[index];
    const personaIndex = personas.findIndex(persona => persona.identificacion === asociacion.persona.identificacion);
    const proyectoIndex = proyectos.findIndex(proyecto => proyecto.nombreProyecto === asociacion.proyecto.nombreProyecto);

    document.getElementById('selectPersona').value = personaIndex;
    document.getElementById('selectProyecto').value = proyectoIndex;

    asociaciones.splice(index, 1);
    mostrarAsociaciones();
}

function eliminarAsociacion(index) {
    asociaciones.splice(index, 1);
    mostrarAsociaciones();
}

function filtrarPersonas() {
    const busqueda = document.getElementById('buscarPersona').value.toLowerCase();
    const personasFiltradas = personas.filter(persona =>
        persona.nombres.toLowerCase().includes(busqueda) ||
        persona.apellidos.toLowerCase().includes(busqueda)
    );
    mostrarPersonas(personasFiltradas);
}

function filtrarProyectos() {
    const busqueda = document.getElementById('buscarProyecto').value.toLowerCase();
    const proyectosFiltrados = proyectos.filter(proyecto =>
        proyecto.nombreProyecto.toLowerCase().includes(busqueda)
    );
    mostrarProyectos(proyectosFiltrados);
}
