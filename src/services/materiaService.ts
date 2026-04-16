import api from './api';
import type { Materia } from '../interfaces/types';

/**
 * La URL base es /materias (asumiendo que /api ya está en la configuración de axios)
 * Basado en @RequestMapping("/api/materias")
 */
const BASE_URL = '/materias';

export const materiaService = {
  /**
   * GET: Obtener todas las materias
   * Mapea con @GetMapping de MateriaController
   */
  obtenerTodos: async (): Promise<Materia[]> => {
    const response = await api.get<Materia[]>(BASE_URL);
    return response.data;
  },

  /**
   * GET: Obtener materia por ID
   * Mapea con @GetMapping("/{id}")
   */
  obtenerPorId: async (id: number): Promise<Materia> => {
    const response = await api.get<Materia>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * POST: Crear nueva materia
   * Envía MateriaRequestDTO (nombre, codigo, creditos)
   */
  crear: async (materia: Materia): Promise<Materia> => {
    const response = await api.post<Materia>(BASE_URL, materia);
    return response.data;
  },

  /**
   * PUT: Actualizar materia existente
   * Mapea con @PutMapping("/{id}")
   */
  actualizar: async (id: number, materia: Materia): Promise<Materia> => {
    const response = await api.put<Materia>(`${BASE_URL}/${id}`, materia);
    return response.data;
  },

  /**
   * DELETE: Eliminar materia
   * Mapea con @DeleteMapping("/{id}")
   */
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  }
};