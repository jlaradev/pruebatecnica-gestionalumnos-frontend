import api from './api';
import type { Nota } from '../interfaces/types';

/**
 * Base URL: /notas
 * Basado en @RequestMapping("/api/notas")
 */
const BASE_URL = '/notas';

export const notaService = {
  /**
   * POST: Crear una nota
   * Mapea con @PostMapping
   * El objeto debe incluir: valor, fecha_registro, alumno_id, materia_id
   */
  crear: async (nota: Nota): Promise<Nota> => {
    const response = await api.post<Nota>(BASE_URL, nota);
    return response.data;
  },

  /**
   * GET: Obtener notas de un alumno específico
   * Mapea con @GetMapping("/alumno/{alumnoId}")
   */
  obtenerPorAlumno: async (alumnoId: number): Promise<Nota[]> => {
    const response = await api.get<Nota[]>(`${BASE_URL}/alumno/${alumnoId}`);
    return response.data;
  }
};