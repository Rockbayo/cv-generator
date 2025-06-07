from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Date, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

class Usuario(Base):
    __tablename__ = 'usuarios'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefono = Column(String(20))
    direccion = Column(Text)
    resumen = Column(Text)
    created_at = Column(DateTime)
    
    experiencias = relationship("Experiencia", back_populates="usuario")
    educacion = relationship("Educacion", back_populates="usuario")
    habilidades = relationship("Habilidad", back_populates="usuario")

class Experiencia(Base):
    __tablename__ = 'experiencias'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    empresa = Column(String(100), nullable=False)
    cargo = Column(String(100), nullable=False)
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    descripcion = Column(Text)
    
    usuario = relationship("Usuario", back_populates="experiencias")

class Educacion(Base):
    __tablename__ = 'educacion'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    institucion = Column(String(100), nullable=False)
    titulo = Column(String(100), nullable=False)
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    
    usuario = relationship("Usuario", back_populates="educacion")

class Habilidad(Base):
    __tablename__ = 'habilidades'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    nombre = Column(String(50), nullable=False)
    nivel = Column(Enum('Básico', 'Intermedio', 'Avanzado', 'Experto'), nullable=False)
    tipo = Column(Enum('Técnica', 'Blanda'), nullable=False)
    
    usuario = relationship("Usuario", back_populates="habilidades")

# Configuración de conexión a BD
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME', 'cv_generator')

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False)
