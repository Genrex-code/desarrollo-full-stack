const API_URL = 'http://localhost:3000/api';

export const discosService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/discos`);
      const data = await response.json();
      
      // EL TRADUCTOR: Convierte DB (español) -> Front (inglés)
      return (data.discos || []).map(disco => ({
        id: disco.id,
        title: disco.titulo,      // titulo es de tu DB
        artist: disco.artista,    // artista es de tu DB
        year: disco.anio,
        genre: disco.genero,
        format: disco.formato,
        image: disco.imagen_path,
        description: disco.descripcion,
        price: disco.precio || 25.00, // Si no tienes la columna aún, pone 25 por defecto
        stock: disco.stock || 10,     // Si no tienes la columna aún, pone 10 por defecto
        featured: disco.top === 1,
        heritage: disco.heritage === 1
      }));
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
};