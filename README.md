# Generador de CV Profesional

Sistema web completo para crear y gestionar CVs profesionales con múltiples plantillas y funcionalidades avanzadas.

## 🎯 Estado del Proyecto (Actualizado)

- ✅ **FASE 1**: CRUD de Usuarios Completo
- ✅ **FASE 2**: Gestión de Experiencias Laborales  
- ✅ **FASE 3**: Gestión de Educación Académica
- 🔄 **FASE 4**: Habilidades y Competencias (70% completada)

### 📊 Progreso FASE 4 - Habilidades y Competencias

**✅ BACKEND COMPLETADO (100%)**
- Tabla `habilidades` creada y configurada
- APIs REST completas y probadas:
  - `GET /api/usuario/{id}/habilidades` ✅
  - `POST /api/usuario/{id}/habilidades` ✅  
  - `PUT /api/habilidad/{id}` ✅
  - `DELETE /api/habilidad/{id}` ✅
- Modelo SQLAlchemy corregido ✅
- Validaciones y manejo de errores ✅

**✅ FRONTEND ESTRUCTURA (90%)**
- HTML sección completa ✅
- CSS estilos implementados ✅
- Tab "Habilidades" habilitado ✅
- Formularios creados ✅

**🔄 FRONTEND FUNCIONALIDAD (30%)**
- Navegación básica entre tabs ✅
- Event listeners básicos ✅
- Falta: CRUD completo JavaScript
- Falta: Integración con APIs
- Falta: Vista previa en CV

## 📋 Stack Tecnológico

- **Backend**: Python + Flask
- **Base de Datos**: MySQL + SQLAlchemy (ORM)
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)
- **Generación PDF**: ReportLab (pendiente)

## 🏗️ Arquitectura del Sistema

```
cv-generator/
├── backend/
│   ├── app.py              # APIs REST + Configuración Flask
│   ├── models.py           # Modelos SQLAlchemy
│   └── [archivos auxiliares]
├── frontend/
│   ├── index.html          # Interfaz principal
│   ├── css/styles.css      # Estilos responsive
│   └── js/app.js           # Lógica JavaScript
├── database/
│   └── schema.sql          # Esquema base de datos
└── [archivos configuración]
```

## ⚡ Instalación y Configuración

### Requisitos Previos
- Python 3.8+
- MySQL 8.0+
- Git

### Configuración Completa
```powershell
# 1. Clonar repositorio
git clone https://github.com/Rockbayo/cv-generator.git
cd cv-generator

# 2. Configurar entorno virtual
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar base de datos
mysql -u root -p cv_generator < database/schema.sql

# 5. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales MySQL

# 6. Ejecutar aplicación
cd backend
python app.py
# Servidor: http://localhost:5000

# 7. Abrir interfaz
# Navegador: file:///ruta/completa/cv-generator/frontend/index.html
```

## 🛠️ APIs Disponibles y Probadas

### Usuarios
- `GET /api/usuarios` - Listar usuarios ✅
- `POST /api/usuario` - Crear usuario ✅
- `GET /api/usuario/{id}` - Obtener usuario ✅
- `PUT /api/usuario/{id}` - Actualizar usuario ✅
- `DELETE /api/usuario/{id}` - Eliminar usuario ✅

### Experiencias Laborales
- `GET /api/usuario/{id}/experiencias` - Listar experiencias ✅
- `POST /api/usuario/{id}/experiencias` - Crear experiencia ✅
- `PUT /api/experiencia/{id}` - Actualizar experiencia ✅
- `DELETE /api/experiencia/{id}` - Eliminar experiencia ✅

### Educación Académica
- `GET /api/usuario/{id}/educacion` - Listar educación ✅
- `POST /api/usuario/{id}/educacion` - Crear educación ✅
- `PUT /api/educacion/{id}` - Actualizar educación ✅
- `DELETE /api/educacion/{id}` - Eliminar educación ✅

### 🆕 Habilidades y Competencias
- `GET /api/usuario/{id}/habilidades` - Listar habilidades ✅
- `POST /api/usuario/{id}/habilidades` - Crear habilidad ✅
- `PUT /api/habilidad/{id}` - Actualizar habilidad ✅
- `DELETE /api/habilidad/{id}` - Eliminar habilidad ✅

**Ejemplo de uso con curl:**
```bash
# Crear habilidad
curl -X POST http://localhost:5000/api/usuario/2/habilidades \
-H "Content-Type: application/json" \
-d '{"nombre":"JavaScript","nivel":"Avanzado","tipo":"Tecnica"}'

# Listar habilidades
curl http://localhost:5000/api/usuario/2/habilidades
```

## 📊 Funcionalidades Completadas

### ✅ Gestión Completa de Usuarios
- CRUD completo con validaciones
- Manejo de emails únicos
- Persistencia con localStorage
- Selector de CVs existentes

### ✅ Experiencias Laborales
- CRUD completo con ordenamiento inteligente
- Checkbox "Trabajo actual" (deshabilita fecha fin)
- Vista previa en tiempo real
- Validaciones de fechas

### ✅ Educación Académica  
- CRUD completo con ordenamiento inteligente
- Checkbox "Estudios en curso" (deshabilita fecha fin)
- Navegación por tabs entre secciones
- Integración completa en vista previa

### 🔄 Habilidades y Competencias (En desarrollo)
- ✅ Backend APIs completas y probadas
- ✅ Estructura HTML y CSS
- ✅ Navegación básica
- ❌ CRUD JavaScript (pendiente)
- ❌ Vista previa en CV (pendiente)

## 🔮 Roadmap - Próximas Fases

### FASE 4 - Completar Habilidades (Pendiente)
- Implementar CRUD completo en JavaScript
- Integrar con APIs backend existentes
- Añadir habilidades a vista previa del CV
- Sistema de niveles con barras de progreso

### FASE 5 - Plantillas y Personalización
- Múltiples plantillas de CV (clásica, moderna, creativa)
- Selector de plantillas con vista previa
- Personalización de colores y fuentes
- Editor visual de layouts

### FASE 6 - Generación y Exportación
- Generación de PDF con ReportLab
- Exportación a Word (.docx)
- Sistema de versiones de CV
- Descarga directa desde navegador

### FASE 7 - Funcionalidades Avanzadas
- Sistema de múltiples usuarios con autenticación
- Dashboard de gestión de CVs
- Plantillas por industria/sector
- Palabras clave automáticas por sector

## 🎯 Metodología de Desarrollo Exitosa

### Principios Aplicados
1. **Desarrollo Incremental**: Una funcionalidad a la vez
2. **Separación de Responsabilidades**: Backend → Frontend → Integración
3. **Pruebas Continuas**: APIs probadas antes de frontend
4. **Commits Frecuentes**: Rollback seguro ante errores
5. **Documentación Actualizada**: Estado claro en cada fase

### Patrón de Implementación Exitoso
```
1. 📊 BACKEND PRIMERO
   - Crear/actualizar tabla BD
   - Implementar modelo SQLAlchemy  
   - Crear APIs REST
   - Probar con curl/Postman

2. 🎨 FRONTEND ESTRUCTURA
   - Agregar HTML secciones
   - Implementar CSS estilos
   - Crear navegación básica

3. ⚡ FRONTEND FUNCIONALIDAD
   - Event listeners
   - Funciones CRUD JavaScript
   - Integración con APIs
   - Vista previa actualizada

4. ✅ VALIDACIÓN COMPLETA
   - Pruebas end-to-end
   - Manejo de errores
   - Commit y documentación
```

## 🚀 Estado Técnico Detallado

### Base de Datos
```sql
-- Tabla habilidades (actualizada)
CREATE TABLE habilidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nivel ENUM('Basico','Intermedio','Avanzado','Experto') NOT NULL DEFAULT 'Basico',
    tipo ENUM('Tecnica','Blanda') NOT NULL DEFAULT 'Tecnica',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

### Configuración de Entorno
- **Python**: Versión 3.12 probada
- **MySQL**: Versión 8.4.4 configurada
- **Flask**: Puerto 5000 por defecto
- **Frontend**: Archivo local (no servidor web necesario)

## 🤝 Cómo Contribuir

### Para Desarrolladores
1. Fork el proyecto
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Seguir metodología incremental documentada
4. Probar APIs antes de frontend
5. Commit frecuentes con mensajes descriptivos
6. Pull Request con documentación actualizada

### Para Continuar FASE 4
Ver sección **"Prompt para Nuevo Chat"** más abajo.

## 📝 Comandos Útiles

```powershell
# Desarrollo
.\venv\Scripts\Activate.ps1          # Activar entorno
cd backend && python app.py         # Servidor Flask
Start-Process "frontend\index.html" # Abrir interfaz

# Base de datos
mysql -u root -p cv_generator        # Conectar MySQL
SHOW TABLES;                         # Ver tablas
DESCRIBE habilidades;                # Ver estructura tabla

# Git
git status                           # Ver cambios
git add . && git commit -m "mensaje" # Commit rápido
git log --oneline                    # Ver historial
```

## 🐛 Problemas Conocidos y Soluciones

### JavaScript
- **Error**: Sintaxis con comillas anidadas
- **Solución**: Usar `git restore frontend/js/app.js` para limpiar

### Base de Datos  
- **Error**: Caracteres especiales (acentos) 
- **Solución**: Usar valores sin acentos ('Tecnica', 'Basico')

### APIs
- **Error**: Usuario no encontrado
- **Solución**: Verificar que usuario existe con `GET /api/usuarios`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Rockbayo** - [ogrobayo@ucundinamarca.edu.co](mailto:ogrobayo@ucundinamarca.edu.co)

---

## 🎯 PROMPT PARA NUEVO CHAT - COMPLETAR FASE 4

Para continuar la implementación desde un nuevo chat, usar este contexto:

```markdown
# CONTEXTO: Completar FASE 4 - Habilidades CV Generator

## ESTADO ACTUAL (70% completado):
- ✅ Backend APIs habilidades funcionando 100% 
- ✅ HTML/CSS estructura completa
- ✅ Navegación básica entre tabs
- ❌ Falta: JavaScript CRUD completo  
- ❌ Falta: Integración vista previa CV

## OBJETIVO: 
Completar funcionalidad JavaScript para habilidades siguiendo metodología incremental exitosa.

## METODOLOGÍA A SEGUIR:
1. Primero verificar que APIs funcionan (probadas con curl)
2. Implementar JavaScript paso a paso
3. Probar cada función antes de continuar
4. Usar git restore si hay errores de sintaxis
5. Commits frecuentes

## PROYECTO:
Generador de CV Profesional - Sistema web Flask + MySQL + JavaScript vanilla.

## ARCHIVOS CLAVE:
- backend/app.py (APIs habilidades implementadas)
- frontend/js/app.js (funcionalidad principal)
- frontend/index.html (estructura HTML completa)

## SIGUIENTE PASO:
Implementar función loadSkills() y renderSkills() en JavaScript para conectar con APIs backend existentes.

Repositorio: https://github.com/Rockbayo/cv-generator
```

**Última actualización**: Junio 7, 2025  
**Estado**: 70% FASE 4 completada - Backend funcional, Frontend pendiente