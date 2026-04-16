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
  alumno_id: number;    // Cambiado de alumnoId a alumno_id
  materia_id: number;   // Cambiado de materiaId a materia_id
  nombre_alumno?: string; 
  nombre_materia?: string;
}