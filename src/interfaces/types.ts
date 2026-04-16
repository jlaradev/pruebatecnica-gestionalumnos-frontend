export interface Alumno {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
}

export interface Materia {
  id?: number;
  nombre: string;
  codigo: string;
  creditos: number;
}

export interface Nota {
  id?: number;
  valor: number;
  fecha_registro?: string;
  alumnoId: number;
  materiaId: number;
  // Campos extra para mostrar en tablas sin tener que re-consultar
  nombre_alumno?: string; 
  nombre_materia?: string;
}