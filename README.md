# Generador de CV Profesional

Sistema web completo para crear y gestionar CVs profesionales con múltiples plantillas y funcionalidades avanzadas.

##  Estado del Proyecto
-  **FASE 1**: CRUD de Usuarios Completo
-  **FASE 2**: Gestión de Experiencias Laborales
-  **FASE 3**: Gestión de Educación Académica
-  **FASE 4**: Habilidades y Competencias (SIGUIENTE)

##  Stack Tecnológico
- **Backend**: Python + Flask
- **Base de Datos**: MySQL + SQLAlchemy (ORM)
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Generación PDF**: ReportLab (pendiente)

##  Instalación Rápida

### Requisitos Previos
- Python 3.8+
- MySQL 8.0+
- Git

### Configuración
`powershell
# 1. Clonar repositorio
git clone https://github.com/Rockbayo/cv-generator.git
cd cv-generator

# 2. Configurar entorno virtual
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 5. Ejecutar aplicación
cd backend
python app.py
 Funcionalidades Implementadas
 Gestión Completa de Usuarios

Crear, leer, actualizar y eliminar CVs
Validación de email único
Persistencia de datos

 Experiencias Laborales

CRUD completo de experiencias
Checkbox "Trabajo actual"
Ordenamiento inteligente por fechas

 Educación Académica

CRUD completo de educación
Checkbox "Estudios en curso"
Navegación por tabs

 Próximas Funcionalidades
FASE 4 - Habilidades y Competencias

CRUD de habilidades técnicas y blandas
Sistema de niveles de competencia
Categorización de habilidades

 Autor
Rockbayo - ogrobayo@ucundinamarca.edu.co
