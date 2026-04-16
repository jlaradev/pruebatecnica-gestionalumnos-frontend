import api from './api';
import type { Alumno } from '../interfaces/types';

// La URL base para este servicio es /alumnos según tu @RequestMapping("/api/alumnos")
// Recuerda que la base "/api" ya debería estar en tu configuración de axios (api.ts)
const BASE_URL = '/alumnos';

export const alumnoService = {
  /**
   * GET: Obtiene la lista completa de alumnos
   * Mapea con @GetMapping en Spring Boot
   */
  obtenerTodos: async (): Promise<Alumno[]> => {
    const response = await api.get<Alumno[]>(BASE_URL);
    return response.data;
  },

  /**
   * GET: Obtiene un alumno por su ID
   * Mapea con @GetMapping("/{id}")
   */
  obtenerPorId: async (id: number): Promise<Alumno> => {
    const response = await api.get<Alumno>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * POST: Crea un nuevo alumno
   * Mapea con @PostMapping y usa AlumnoRequestDTO
   */
  crear: async (alumno: Alumno): Promise<Alumno> => {
    const response = await api.post<Alumno>(BASE_URL, alumno);
    return response.data;
  },

  /**
   * PUT: Actualiza un alumno existente
   * Mapea con @PutMapping("/{id}")
   */
  actualizar: async (id: number, alumno: Alumno): Promise<Alumno> => {
    const response = await api.put<Alumno>(`${BASE_URL}/${id}`, alumno);
    return response.data;
  },

  /**
   * DELETE: Elimina un alumno
   * Mapea con @DeleteMapping("/{id}")
   */
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  }
};