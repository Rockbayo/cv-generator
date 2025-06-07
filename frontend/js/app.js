const API_BASE = 'http://localhost:5000/api';

// Referencias a elementos del DOM
const form = document.getElementById('cvForm');
const previewDiv = document.getElementById('preview');
const saveBtn = document.getElementById('saveBtn');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const newBtn = document.getElementById('newBtn');
const cvSelector = document.getElementById('cvSelector');
const loadCvBtn = document.getElementById('loadCvBtn');

// Navegacion entre secciones
const sectionsNav = document.getElementById('sectionsNav');
const experiencesNavBtn = document.getElementById('experiencesNavBtn');
const educationNavBtn = document.getElementById('educationNavBtn');
const skillsNavBtn = document.getElementById('skillsNavBtn');

// Elementos de experiencias
const experiencesSection = document.getElementById('experiencesSection');
const experienceForm = document.getElementById('experienceForm');
const experienceFormTitle = document.getElementById('experienceFormTitle');
const expForm = document.getElementById('expForm');
const addExpBtn = document.getElementById('addExpBtn');
const saveExpBtn = document.getElementById('saveExpBtn');
const cancelExpBtn = document.getElementById('cancelExpBtn');
const experiencesList = document.getElementById('experiencesList');
const trabajoActualCheckbox = document.getElementById('trabajoActual');
const fechaFinInput = document.getElementById('fechaFin');

// Elementos de educacion
const educationSection = document.getElementById('educationSection');
const educationForm = document.getElementById('educationForm');
const educationFormTitle = document.getElementById('educationFormTitle');
const eduForm = document.getElementById('eduForm');
const addEduBtn = document.getElementById('addEduBtn');
const saveEduBtn = document.getElementById('saveEduBtn');
const cancelEduBtn = document.getElementById('cancelEduBtn');
const educationList = document.getElementById('educationList');
const estudiosActualesCheckbox = document.getElementById('estudiosActuales');
const fechaFinEduInput = document.getElementById('fechaFinEdu');

// Datos del usuario actual
let currentUser = null;
let isEditing = false;
let allUsers = [];
let currentExperiences = [];
let currentEducation = [];
let editingExperienceId = null;
let editingEducationId = null;
let activeSection = 'experiences';

// Event listeners principales
form.addEventListener('submit', handleSubmit);
editBtn.addEventListener('click', toggleEdit);
deleteBtn.addEventListener('click', handleDelete);
newBtn.addEventListener('click', handleNew);
loadCvBtn.addEventListener('click', loadSelectedCV);

// Event listeners de navegacion
experiencesNavBtn.addEventListener('click', () => showSection('experiences'));
educationNavBtn.addEventListener('click', () => showSection('education'));

// Event listeners de experiencias
addExpBtn.addEventListener('click', showExperienceForm);
expForm.addEventListener('submit', handleExperienceSubmit);
cancelExpBtn.addEventListener('click', hideExperienceForm);
trabajoActualCheckbox.addEventListener('change', handleTrabajoActualChange);

// Event listeners de educacion
addEduBtn.addEventListener('click', showEducationForm);
eduForm.addEventListener('submit', handleEducationSubmit);
cancelEduBtn.addEventListener('click', hideEducationForm);
estudiosActualesCheckbox.addEventListener('change', handleEstudiosActualesChange);

document.addEventListener('DOMContentLoaded', init);

// =============== FUNCIONES DE NAVEGACION ===============
function showSection(section) {
    // Ocultar todas las secciones
    experiencesSection.style.display = 'none';
    educationSection.style.display = 'none';
    
    // Remover clase active de todos los botones
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    
    // Mostrar seccion seleccionada y activar boton
    if (section === 'experiences') {
        experiencesSection.style.display = 'block';
        experiencesNavBtn.classList.add('active');
        activeSection = 'experiences';
    } else if (section === 'education') {
        educationSection.style.display = 'block';
        educationNavBtn.classList.add('active');
        activeSection = 'education';
    }
}

// =============== FUNCIONES DE CHECKBOXES ===============
function handleTrabajoActualChange() {
    if (trabajoActualCheckbox.checked) {
        fechaFinInput.value = '';
        fechaFinInput.disabled = true;
        fechaFinInput.style.backgroundColor = '#f8f9fa';
    } else {
        fechaFinInput.disabled = false;
        fechaFinInput.style.backgroundColor = '';
    }
}

function handleEstudiosActualesChange() {
    if (estudiosActualesCheckbox.checked) {
        fechaFinEduInput.value = '';
        fechaFinEduInput.disabled = true;
        fechaFinEduInput.style.backgroundColor = '#f8f9fa';
    } else {
        fechaFinEduInput.disabled = false;
        fechaFinEduInput.style.backgroundColor = '';
    }
}

// =============== INICIALIZACION ===============
async function init() {
    await loadAllUsers();
    await loadSavedData();
}

async function loadAllUsers() {
    try {
        const response = await fetch(`${API_BASE}/usuarios`);
        const result = await response.json();
        
        if (result.status === 'success') {
            allUsers = result.usuarios;
            updateCVSelector();
        }
    } catch (error) {
        console.log('Error cargando usuarios:', error);
    }
}

function updateCVSelector() {
    cvSelector.innerHTML = '<option value="">Crear nuevo CV...</option>';
    
    allUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.nombre} (${user.email}) - ${user.created_at || 'Sin fecha'}`;
        cvSelector.appendChild(option);
    });
}

async function loadSelectedCV() {
    const selectedId = cvSelector.value;
    if (!selectedId) {
        handleNew();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/usuario/${selectedId}`);
        const result = await response.json();
        
        if (result.status === 'success') {
            currentUser = result.usuario;
            localStorage.setItem('currentUserId', selectedId);
            fillForm(currentUser);
            await loadExperiences();
            await loadEducation();
            updatePreview();
            setViewMode();
            saveBtn.textContent = 'Actualizar Datos';
            showMessage('CV cargado exitosamente', 'success');
        }
    } catch (error) {
        showMessage('Error cargando CV: ' + error.message, 'error');
    }
}

// =============== MANEJO DE USUARIOS ===============
async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        resumen: document.getElementById('resumen').value
    };
    
    try {
        let response;
        
        if (currentUser && currentUser.id) {
            response = await fetch(`${API_BASE}/usuario/${currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(`${API_BASE}/usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
            if (!currentUser) {
                currentUser = { ...formData, id: result.usuario_id };
                localStorage.setItem('currentUserId', result.usuario_id);
            } else {
                currentUser = { ...currentUser, ...formData };
            }
            
            updatePreview();
            setViewMode();
            await loadAllUsers();
            showMessage(currentUser.id ? 'Datos actualizados exitosamente' : 'Datos guardados exitosamente', 'success');
        } else {
            if (result.existing_user_id) {
                const loadExisting = confirm(result.message + ' ¿Desea cargar el CV existente?');
                if (loadExisting) {
                    cvSelector.value = result.existing_user_id;
                    await loadSelectedCV();
                }
            } else {
                showMessage('Error: ' + result.message, 'error');
            }
        }
    } catch (error) {
        showMessage('Error de conexion: ' + error.message, 'error');
    }
}

function toggleEdit() {
    if (isEditing) {
        setViewMode();
    } else {
        setEditMode();
    }
}

function setViewMode() {
    isEditing = false;
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => input.disabled = true);
    
    saveBtn.style.display = 'none';
    editBtn.style.display = 'inline-block';
    editBtn.textContent = 'Editar';
    deleteBtn.style.display = 'inline-block';
    newBtn.style.display = 'inline-block';
    
    if (currentUser && currentUser.id) {
        sectionsNav.style.display = 'block';
        showSection(activeSection);
    }
}

function setEditMode() {
    isEditing = true;
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => input.disabled = false);
    
    saveBtn.style.display = 'inline-block';
    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    newBtn.style.display = 'none';
    sectionsNav.style.display = 'none';
    experiencesSection.style.display = 'none';
    educationSection.style.display = 'none';
}

async function handleDelete() {
    if (!currentUser || !currentUser.id) return;
    
    if (!confirm('¿Estas seguro de que quieres eliminar este CV? Esta accion no se puede deshacer.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/usuario/${currentUser.id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showMessage('CV eliminado exitosamente', 'success');
            await loadAllUsers();
            
            if (allUsers.length > 0) {
                cvSelector.value = allUsers[0].id;
                await loadSelectedCV();
            } else {
                handleNew();
            }
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        showMessage('Error de conexion: ' + error.message, 'error');
    }
}

function handleNew() {
    currentUser = null;
    currentExperiences = [];
    currentEducation = [];
    localStorage.removeItem('currentUserId');
    form.reset();
    cvSelector.value = '';
    previewDiv.innerHTML = '<p>Los datos aparecera aqui...</p>';
    sectionsNav.style.display = 'none';
    experiencesSection.style.display = 'none';
    educationSection.style.display = 'none';
    hideExperienceForm();
    hideEducationForm();
    setEditMode();
    saveBtn.textContent = 'Guardar Datos';
}

// =============== MANEJO DE EXPERIENCIAS ===============
async function loadExperiences() {
    if (!currentUser || !currentUser.id) return;
    
    try {
        const response = await fetch(`${API_BASE}/usuario/${currentUser.id}/experiencias`);
        const result = await response.json();
        
        if (result.status === 'success') {
            currentExperiences = result.experiencias;
            renderExperiences();
        }
    } catch (error) {
        console.log('Error cargando experiencias:', error);
    }
}

function renderExperiences() {
    if (currentExperiences.length === 0) {
        experiencesList.innerHTML = '<p class="no-data">No hay experiencias registradas</p>';
        return;
    }
    
    const sortedExperiences = [...currentExperiences].sort((a, b) => {
        if (!a.fecha_fin && b.fecha_fin) return -1;
        if (a.fecha_fin && !b.fecha_fin) return 1;
        if (!a.fecha_fin && !b.fecha_fin) {
            return new Date(b.fecha_inicio || 0) - new Date(a.fecha_inicio || 0);
        }
        return new Date(b.fecha_fin || 0) - new Date(a.fecha_fin || 0);
    });
    
    const experiencesHTML = sortedExperiences.map(exp => {
        const isCurrentJob = !exp.fecha_fin;
        const dateText = isCurrentJob ? 
            `${formatDate(exp.fecha_inicio)} - <span class="current-job">Presente</span>` :
            `${formatDate(exp.fecha_inicio)} - ${formatDate(exp.fecha_fin)}`;
            
        return `
            <div class="experience-item">
                <div class="experience-header">
                    <div class="experience-title">
                        <h4>${exp.cargo}</h4>
                        <p>${exp.empresa}</p>
                    </div>
                    <div class="experience-actions">
                        <button class="btn-small btn-edit" onclick="editExperience(${exp.id})">Editar</button>
                        <button class="btn-small btn-delete" onclick="deleteExperience(${exp.id})">Eliminar</button>
                    </div>
                </div>
                <div class="experience-dates">
                    ${dateText}
                </div>
                ${exp.descripcion ? `<div class="experience-description">${exp.descripcion}</div>` : ''}
            </div>
        `;
    }).join('');
    
    experiencesList.innerHTML = experiencesHTML;
}

function showExperienceForm() {
    editingExperienceId = null;
    experienceFormTitle.textContent = 'Nueva Experiencia';
    expForm.reset();
    trabajoActualCheckbox.checked = false;
    fechaFinInput.disabled = false;
    fechaFinInput.style.backgroundColor = '';
    experienceForm.style.display = 'block';
    saveExpBtn.textContent = 'Guardar Experiencia';
}

function hideExperienceForm() {
    experienceForm.style.display = 'none';
    expForm.reset();
    editingExperienceId = null;
    trabajoActualCheckbox.checked = false;
    fechaFinInput.disabled = false;
    fechaFinInput.style.backgroundColor = '';
}

async function handleExperienceSubmit(e) {
    e.preventDefault();
    
    if (!currentUser || !currentUser.id) {
        showMessage('Primero debe guardar los datos personales', 'error');
        return;
    }
    
    const formData = {
        empresa: document.getElementById('empresa').value,
        cargo: document.getElementById('cargo').value,
        fecha_inicio: document.getElementById('fechaInicio').value,
        fecha_fin: trabajoActualCheckbox.checked ? null : document.getElementById('fechaFin').value,
        descripcion: document.getElementById('descripcion').value
    };
    
    try {
        let response;
        
        if (editingExperienceId) {
            response = await fetch(`${API_BASE}/experiencia/${editingExperienceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(`${API_BASE}/usuario/${currentUser.id}/experiencias`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
            await loadExperiences();
            updatePreview();
            hideExperienceForm();
            showMessage(editingExperienceId ? 'Experiencia actualizada exitosamente' : 'Experiencia agregada exitosamente', 'success');
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        showMessage('Error de conexion: ' + error.message, 'error');
    }
}

// =============== MANEJO DE EDUCACION ===============
async function loadEducation() {
    if (!currentUser || !currentUser.id) return;
    
    try {
        const response = await fetch(`${API_BASE}/usuario/${currentUser.id}/educacion`);
        const result = await response.json();
        
        if (result.status === 'success') {
            currentEducation = result.educacion;
            renderEducation();
        }
    } catch (error) {
        console.log('Error cargando educacion:', error);
    }
}

function renderEducation() {
    if (currentEducation.length === 0) {
        educationList.innerHTML = '<p class="no-data">No hay educacion registrada</p>';
        return;
    }
    
    const sortedEducation = [...currentEducation].sort((a, b) => {
        if (!a.fecha_fin && b.fecha_fin) return -1;
        if (a.fecha_fin && !b.fecha_fin) return 1;
        if (!a.fecha_fin && !b.fecha_fin) {
            return new Date(b.fecha_inicio || 0) - new Date(a.fecha_inicio || 0);
        }
        return new Date(b.fecha_fin || 0) - new Date(a.fecha_fin || 0);
    });
    
    const educationHTML = sortedEducation.map(edu => {
        const isCurrentStudies = !edu.fecha_fin;
        const dateText = isCurrentStudies ? 
            `${formatDate(edu.fecha_inicio)} - <span class="current-studies">En curso</span>` :
            `${formatDate(edu.fecha_inicio)} - ${formatDate(edu.fecha_fin)}`;
            
        return `
            <div class="education-item">
                <div class="education-header">
                    <div class="education-title">
                        <h4>${edu.titulo}</h4>
                        <p>${edu.institucion}</p>
                    </div>
                    <div class="education-actions">
                        <button class="btn-small btn-edit" onclick="editEducation(${edu.id})">Editar</button>
                        <button class="btn-small btn-delete" onclick="deleteEducation(${edu.id})">Eliminar</button>
                    </div>
                </div>
                <div class="education-dates">
                    ${dateText}
                </div>
            </div>
        `;
    }).join('');
    
    educationList.innerHTML = educationHTML;
}

function showEducationForm() {
    editingEducationId = null;
    educationFormTitle.textContent = 'Nueva Educacion';
    eduForm.reset();
    estudiosActualesCheckbox.checked = false;
    fechaFinEduInput.disabled = false;
    fechaFinEduInput.style.backgroundColor = '';
    educationForm.style.display = 'block';
    saveEduBtn.textContent = 'Guardar Educacion';
}

function hideEducationForm() {
    educationForm.style.display = 'none';
    eduForm.reset();
    editingEducationId = null;
    estudiosActualesCheckbox.checked = false;
    fechaFinEduInput.disabled = false;
    fechaFinEduInput.style.backgroundColor = '';
}

async function handleEducationSubmit(e) {
    e.preventDefault();
    
    if (!currentUser || !currentUser.id) {
        showMessage('Primero debe guardar los datos personales', 'error');
        return;
    }
    
    const formData = {
        institucion: document.getElementById('institucion').value,
        titulo: document.getElementById('titulo').value,
        fecha_inicio: document.getElementById('fechaInicioEdu').value,
        fecha_fin: estudiosActualesCheckbox.checked ? null : document.getElementById('fechaFinEdu').value
    };
    
    try {
        let response;
        
        if (editingEducationId) {
            response = await fetch(`${API_BASE}/educacion/${editingEducationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(`${API_BASE}/usuario/${currentUser.id}/educacion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
            await loadEducation();
            updatePreview();
            hideEducationForm();
            showMessage(editingEducationId ? 'Educacion actualizada exitosamente' : 'Educacion agregada exitosamente', 'success');
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        showMessage('Error de conexion: ' + error.message, 'error');
    }
}

// =============== FUNCIONES GLOBALES ===============
window.editExperience = async function(expId) {
    const experience = currentExperiences.find(exp => exp.id === expId);
    if (!experience) return;
    
    editingExperienceId = expId;
    experienceFormTitle.textContent = 'Editar Experiencia';
    
    document.getElementById('empresa').value = experience.empresa;
    document.getElementById('cargo').value = experience.cargo;
    document.getElementById('fechaInicio').value = experience.fecha_inicio || '';
    document.getElementById('fechaFin').value = experience.fecha_fin || '';
    document.getElementById('descripcion').value = experience.descripcion || '';
    
    const isCurrentJob = !experience.fecha_fin;
    trabajoActualCheckbox.checked = isCurrentJob;
    if (isCurrentJob) {
        fechaFinInput.disabled = true;
        fechaFinInput.style.backgroundColor = '#f8f9fa';
    } else {
        fechaFinInput.disabled = false;
        fechaFinInput.style.backgroundColor = '';
    }
    
    experienceForm.style.display = 'block';
    saveExpBtn.textContent = 'Actualizar Experiencia';
}

window.deleteExperience = async function(expId) {
    if (!confirm('¿Estas seguro de eliminar esta experiencia?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/experiencia/${expId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            await loadExperiences();
            updatePreview();
            showMessage('Experiencia eliminada exitosamente', 'success');
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        showMessage('Error de conexion: ' + error.message, 'error');
    }
}

window.editEducation = async function(eduId) {
    const education = currentEducation.find(edu => edu.id === eduId);
    if (!education) return;
    
    editingEducationId = eduId;
    educationFormTitle.textContent = 'Editar Educacion';
    
    document.getElementById('institucion').value = education.institucion;
    document.getElementById('titulo').value = education.titulo;
    document.getElementById('fechaInicioEdu').value = education.fecha_inicio || '';
    document.getElementById('fechaFinEdu').value = education.fecha_fin || '';
    
    const isCurrentStudies = !education.fecha_fin;
    estudiosActualesCheckbox.checked = isCurrentStudies;
    if (isCurrentStudies) {
        fechaFinEduInput.disabled = true;
        fechaFinEduInput.style.backgroundColor = '#f8f9fa';
    } else {
        fechaFinEduInput.disabled = false;
        fechaFinEduInput.style.backgroundColor = '';
    }
    
    educationForm.style.display = 'block';
    saveEduBtn.textContent = 'Actualizar Educacion';
}

window.deleteEducation = async function(eduId) {
    if (!confirm('¿Estas seguro de eliminar esta educacion?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/educacion/${eduId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            await loadEducation();
            updatePreview();
            showMessage('Educacion eliminada exitosamente', 'success');
        } else {
            showMessage('Error: ' + result.message, 'error');
        }
    } catch (error) {
        showMessage('Error de conexion: ' + error.message, 'error');
    }
}

// =============== UTILIDADES ===============
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
}

function updatePreview() {
    if (!currentUser) return;
    
    // Generar HTML de experiencias
    let experiencesHTML = '';
    if (currentExperiences.length > 0) {
        const sortedExperiences = [...currentExperiences].sort((a, b) => {
            if (!a.fecha_fin && b.fecha_fin) return -1;
            if (a.fecha_fin && !b.fecha_fin) return 1;
            if (!a.fecha_fin && !b.fecha_fin) {
                return new Date(b.fecha_inicio || 0) - new Date(a.fecha_inicio || 0);
            }
            return new Date(b.fecha_fin || 0) - new Date(a.fecha_fin || 0);
        });
        
        experiencesHTML = sortedExperiences.map(exp => {
            const isCurrentJob = !exp.fecha_fin;
            const dateText = isCurrentJob ? 
                `${formatDate(exp.fecha_inicio)} - <span class="current">Presente</span>` :
                `${formatDate(exp.fecha_inicio)} - ${formatDate(exp.fecha_fin)}`;
                
            return `
                <div class="cv-experience-item">
                    <div class="cv-exp-header">
                        <div>
                            <div class="cv-exp-title">${exp.cargo}</div>
                            <div class="cv-exp-company">${exp.empresa}</div>
                        </div>
                        <div class="cv-exp-dates">
                            ${dateText}
                        </div>
                    </div>
                    ${exp.descripcion ? `<div class="cv-exp-description">${exp.descripcion}</div>` : ''}
                </div>
            `;
        }).join('');
    } else {
        experiencesHTML = '<p><em>No hay experiencias registradas</em></p>';
    }
    
    // Generar HTML de educacion
    let educationHTML = '';
    if (currentEducation.length > 0) {
        const sortedEducation = [...currentEducation].sort((a, b) => {
            if (!a.fecha_fin && b.fecha_fin) return -1;
            if (a.fecha_fin && !b.fecha_fin) return 1;
            if (!a.fecha_fin && !b.fecha_fin) {
                return new Date(b.fecha_inicio || 0) - new Date(a.fecha_inicio || 0);
            }
            return new Date(b.fecha_fin || 0) - new Date(a.fecha_fin || 0);
        });
        
        educationHTML = sortedEducation.map(edu => {
            const isCurrentStudies = !edu.fecha_fin;
            const dateText = isCurrentStudies ? 
                `${formatDate(edu.fecha_inicio)} - <span class="current">En curso</span>` :
                `${formatDate(edu.fecha_inicio)} - ${formatDate(edu.fecha_fin)}`;
                
            return `
                <div class="cv-education-item">
                    <div class="cv-edu-header">
                        <div>
                            <div class="cv-edu-title">${edu.titulo}</div>
                            <div class="cv-edu-institution">${edu.institucion}</div>
                        </div>
                        <div class="cv-edu-dates">
                            ${dateText}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        educationHTML = '<p><em>No hay educacion registrada</em></p>';
    }
    
    const cvHTML = '<div class="cv-content">' +
        '<div class="cv-header">' +
            '<div class="cv-name">' + currentUser.nombre + '</div>' +
            '<div class="cv-contact">' +
                currentUser.email + ' | ' + (currentUser.telefono || '') + ' | ' + (currentUser.direccion || '') +
            '</div>' +
        '</div>' +
        (currentUser.resumen ? 
            '<div class="cv-section">' +
                '<h3>Resumen Profesional</h3>' +
                '<p>' + currentUser.resumen + '</p>' +
            '</div>' : '') +
        '<div class="cv-section">' +
            '<h3>Experiencia Laboral</h3>' +
            experiencesHTML +
        '</div>' +
        '<div class="cv-section">' +
            '<h3>Educacion</h3>' +
            educationHTML +
        '</div>' +
        '<div class="cv-section">' +
            '<h3>Habilidades</h3>' +
            '<p><em>Seccion en desarrollo...</em></p>' +
        '</div>' +
    '</div>';
    
    previewDiv.innerHTML = cvHTML;
}

async function loadSavedData() {
    const savedUserId = localStorage.getItem('currentUserId');
    if (!savedUserId) {
        setEditMode();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/usuario/${savedUserId}`);
        const result = await response.json();
        
        if (result.status === 'success') {
            currentUser = result.usuario;
            cvSelector.value = savedUserId;
            fillForm(currentUser);
            await loadExperiences();
            await loadEducation();
            updatePreview();
            setViewMode();
            saveBtn.textContent = 'Actualizar Datos';
        } else {
            localStorage.removeItem('currentUserId');
            setEditMode();
        }
    } catch (error) {
        console.log('No se pudieron cargar datos guardados');
        setEditMode();
    }
}

function fillForm(userData) {
    document.getElementById('nombre').value = userData.nombre || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('telefono').value = userData.telefono || '';
    document.getElementById('direccion').value = userData.direccion || '';
    document.getElementById('resumen').value = userData.resumen || '';
}

function showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + type;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(function() {
        messageDiv.remove();
    }, 3000);
}