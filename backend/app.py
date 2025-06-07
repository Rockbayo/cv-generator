from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from models import engine, Usuario, Experiencia, Educacion, Habilidad
import os
from dotenv import load_dotenv
from datetime import datetime, date

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@app.route('/')
def home():
    return jsonify({'message': 'CV Generator API funcionando correctamente'})

@app.route('/api/test-db')
def test_db():
    try:
        session = SessionLocal()
        result = session.execute(text('SELECT 1')).fetchone()
        session.close()
        return jsonify({'status': 'success', 'message': 'Conexion a BD exitosa'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# =============== USUARIOS ===============
@app.route('/api/usuarios', methods=['GET'])
def listar_usuarios():
    session = None
    try:
        session = SessionLocal()
        usuarios = session.query(Usuario).all()
        
        usuarios_list = []
        for usuario in usuarios:
            usuarios_list.append({
                'id': usuario.id,
                'nombre': usuario.nombre,
                'email': usuario.email,
                'telefono': usuario.telefono,
                'created_at': usuario.created_at.strftime('%Y-%m-%d %H:%M') if usuario.created_at else None
            })
        
        return jsonify({
            'status': 'success',
            'usuarios': usuarios_list
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

@app.route('/api/usuario', methods=['POST'])
def crear_usuario():
    session = None
    try:
        data = request.json
        session = SessionLocal()
        
        existing_user = session.query(Usuario).filter(Usuario.email == data['email']).first()
        if existing_user:
            return jsonify({
                'status': 'error', 
                'message': f'Ya existe un CV con el email {data["email"]}. Use un email diferente o cargue el CV existente.',
                'existing_user_id': existing_user.id
            }), 400
        
        nuevo_usuario = Usuario(
            nombre=data['nombre'],
            email=data['email'],
            telefono=data.get('telefono'),
            direccion=data.get('direccion'),
            resumen=data.get('resumen')
        )
        
        session.add(nuevo_usuario)
        session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Usuario creado exitosamente',
            'usuario_id': nuevo_usuario.id
        })
    except Exception as e:
        if session:
            session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

@app.route('/api/usuario/<int:usuario_id>', methods=['GET'])
def obtener_usuario(usuario_id):
    session = None
    try:
        session = SessionLocal()
        usuario = session.query(Usuario).filter(Usuario.id == usuario_id).first()
        
        if not usuario:
            return jsonify({'status': 'error', 'message': 'Usuario no encontrado'}), 404
        
        return jsonify({
            'status': 'success',
            'usuario': {
                'id': usuario.id,
                'nombre': usuario.nombre,
                'email': usuario.email,
                'telefono': usuario.telefono,
                'direccion': usuario.direccion,
                'resumen': usuario.resumen
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

@app.route('/api/usuario/<int:usuario_id>', methods=['PUT'])
def actualizar_usuario(usuario_id):
    session = None
    try:
        data = request.json
        session = SessionLocal()
        
        usuario = session.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            return jsonify({'status': 'error', 'message': 'Usuario no encontrado'}), 404
        
        if data.get('email') != usuario.email:
            existing_user = session.query(Usuario).filter(Usuario.email == data['email']).first()
            if existing_user:
                return jsonify({
                    'status': 'error', 
                    'message': f'Ya existe otro CV con el email {data["email"]}'
                }), 400
        
        usuario.nombre = data.get('nombre', usuario.nombre)
        usuario.email = data.get('email', usuario.email)
        usuario.telefono = data.get('telefono', usuario.telefono)
        usuario.direccion = data.get('direccion', usuario.direccion)
        usuario.resumen = data.get('resumen', usuario.resumen)
        
        session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Usuario actualizado exitosamente'
        })
    except Exception as e:
        if session:
            session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

@app.route('/api/usuario/<int:usuario_id>', methods=['DELETE'])
def eliminar_usuario(usuario_id):
    session = None
    try:
        session = SessionLocal()
        
        usuario = session.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            return jsonify({'status': 'error', 'message': 'Usuario no encontrado'}), 404
        
        session.delete(usuario)
        session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Usuario eliminado exitosamente'
        })
    except Exception as e:
        if session:
            session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

# =============== EXPERIENCIAS ===============
@app.route('/api/usuario/<int:usuario_id>/experiencias', methods=['GET'])
def listar_experiencias(usuario_id):
    session = None
    try:
        session = SessionLocal()
        experiencias = session.query(Experiencia).filter(Experiencia.usuario_id == usuario_id).all()
        
        experiencias_list = []
        for exp in experiencias:
            experiencias_list.append({
                'id': exp.id,
                'empresa': exp.empresa,
                'cargo': exp.cargo,
                'fecha_inicio': exp.fecha_inicio.strftime('%Y-%m-%d') if exp.fecha_inicio else None,
                'fecha_fin': exp.fecha_fin.strftime('%Y-%m-%d') if exp.fecha_fin else None,
                'descripcion': exp.descripcion
            })
        
        return jsonify({
            'status': 'success',
            'experiencias': experiencias_list
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

@app.route('/api/usuario/<int:usuario_id>/experiencias', methods=['POST'])
def crear_experiencia(usuario_id):
    session = None
    try:
        data = request.json
        session = SessionLocal()
        
        usuario = session.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            return jsonify({'status': 'error', 'message': 'Usuario no encontrado'}), 404
        
        fecha_inicio = datetime.strptime(data['fecha_inicio'], '%Y-%m-%d').date() if data.get('fecha_inicio') else None
        fecha_fin = datetime.strptime(data['fecha_fin'], '%Y-%m-%d').date() if data.get('fecha_fin') else None
        
        nueva_experiencia = Experiencia(
            usuario_id=usuario_id,
            empresa=data['empresa'],
            cargo=data['cargo'],
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            descripcion=data.get('descripcion')
        )
        
        session.add(nueva_experiencia)
        session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Experiencia creada exitosamente',
            'experiencia_id': nueva_experiencia.id
        })
    except Exception as e:
        if session:
            session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

@app.route('/api/experiencia/<int:experiencia_id>', methods=['PUT'])
def actualizar_experiencia(experiencia_id):
    session = None
    try:
        data = request.json
        session = SessionLocal()
        
        experiencia = session.query(Experiencia).filter(Experiencia.id == experiencia_id).first()
        if not experiencia:
            return jsonify({'status': 'error', 'message': 'Experiencia no encontrada'}), 404
        
        if data.get('fecha_inicio'):
            experiencia.fecha_inicio = datetime.strptime(data['fecha_inicio'], '%Y-%m-%d').date()
        if data.get('fecha_fin'):
            experiencia.fecha_fin = datetime.strptime(data['fecha_fin'], '%Y-%m-%d').date()
        
        experiencia.empresa = data.get('empresa', experiencia.empresa)
        experiencia.cargo = data.get('cargo', experiencia.cargo)
        experiencia.descripcion = data.get('descripcion', experiencia.descripcion)
        
        session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Experiencia actualizada exitosamente'
        })
    except Exception as e:
        if session:
            session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

@app.route('/api/experiencia/<int:experiencia_id>', methods=['DELETE'])
def eliminar_experiencia(experiencia_id):
    session = None
    try:
        session = SessionLocal()
        
        experiencia = session.query(Experiencia).filter(Experiencia.id == experiencia_id).first()
        if not experiencia:
            return jsonify({'status': 'error', 'message': 'Experiencia no encontrada'}), 404
        
        session.delete(experiencia)
        session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Experiencia eliminada exitosamente'
        })
    except Exception as e:
        if session:
            session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

# =============== EDUCACION ===============
@app.route('/api/usuario/<int:usuario_id>/educacion', methods=['GET'])
def listar_educacion(usuario_id):
    session = None
    try:
        session = SessionLocal()
        educacion = session.query(Educacion).filter(Educacion.usuario_id == usuario_id).all()
        
        educacion_list = []
        for edu in educacion:
            educacion_list.append({
                'id': edu.id,
                'institucion': edu.institucion,
                'titulo': edu.titulo,
                'fecha_inicio': edu.fecha_inicio.strftime('%Y-%m-%d') if edu.fecha_inicio else None,
                'fecha_fin': edu.fecha_fin.strftime('%Y-%m-%d') if edu.fecha_fin else None
            })
        
        return jsonify({
            'status': 'success',
            'educacion': educacion_list
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

@app.route('/api/usuario/<int:usuario_id>/educacion', methods=['POST'])
def crear_educacion(usuario_id):
    session = None
    try:
        data = request.json
        session = SessionLocal()
        
        usuario = session.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            return jsonify({'status': 'error', 'message': 'Usuario no encontrado'}), 404
        
        fecha_inicio = datetime.strptime(data['fecha_inicio'], '%Y-%m-%d').date() if data.get('fecha_inicio') else None
        fecha_fin = datetime.strptime(data['fecha_fin'], '%Y-%m-%d').date() if data.get('fecha_fin') else None
        
        nueva_educacion = Educacion(
            usuario_id=usuario_id,
            institucion=data['institucion'],
            titulo=data['titulo'],
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin
        )
        
        session.add(nueva_educacion)
        session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Educacion creada exitosamente',
            'educacion_id': nueva_educacion.id
        })
    except Exception as e:
        if session:
            session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

@app.route('/api/educacion/<int:educacion_id>', methods=['PUT'])
def actualizar_educacion(educacion_id):
    session = None
    try:
        data = request.json
        session = SessionLocal()
        
        educacion = session.query(Educacion).filter(Educacion.id == educacion_id).first()
        if not educacion:
            return jsonify({'status': 'error', 'message': 'Educacion no encontrada'}), 404
        
        if data.get('fecha_inicio'):
            educacion.fecha_inicio = datetime.strptime(data['fecha_inicio'], '%Y-%m-%d').date()
        if data.get('fecha_fin'):
            educacion.fecha_fin = datetime.strptime(data['fecha_fin'], '%Y-%m-%d').date()
        
        educacion.institucion = data.get('institucion', educacion.institucion)
        educacion.titulo = data.get('titulo', educacion.titulo)
        
        session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Educacion actualizada exitosamente'
        })
    except Exception as e:
        if session:
            session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

@app.route('/api/educacion/<int:educacion_id>', methods=['DELETE'])
def eliminar_educacion(educacion_id):
    session = None
    try:
        session = SessionLocal()
        
        educacion = session.query(Educacion).filter(Educacion.id == educacion_id).first()
        if not educacion:
            return jsonify({'status': 'error', 'message': 'Educacion no encontrada'}), 404
        
        session.delete(educacion)
        session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Educacion eliminada exitosamente'
        })
    except Exception as e:
        if session:
            session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if session:
            session.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)