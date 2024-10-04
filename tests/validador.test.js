const fs = require('fs');
const path = require('path');

// Campos requeridos
const requiredFields = [
	'nombre',
	'edad',
	'carrera',
	'semestre',
	'gustos',
	'noGustos',
	'foto',
	'redSocial',
];

// Función para validar un archivo JSON
const validateJsonFile = (filePath) => {
  	const data = JSON.parse(fs.readFileSync(filePath, 'utf8')); // Lee el archivo JSON y lo convierte a un objeto JavaScript
  	const missingFields = requiredFields.filter(field => !(field in data)); // Filtra los campos requeridos para encontrar cuáles faltan en el objeto data
	
	// Si hay campos que faltan, lanza un error con un mensaje que enumera los campos faltantes
  	if (missingFields.length > 0) {
  	  throw new Error(`No están los campos requeridos: ${missingFields.join(', ')}`);
  	}
};

// Se describen las pruebas que se van a hacer
describe('Validación de archivos JSON', () => {
  	// la ruta base al directorio donde están las carpetas de archivos JSON
  	const basePath = path.join(__dirname, '../public/data');

	// Se obtienen todas las carpetas dentro de public/data y se filtran solo las que son directorios
  	const folders = fs.readdirSync(basePath).filter(folder => fs.statSync(path.join(basePath, folder)).isDirectory());

  	// Iterar sobre cada carpeta y validar su info.json
  	folders.forEach(folder => {
		// Se define una prueba para validar el archivo info.json de cada carpeta
  	  	test(`Validar ${folder}/info.json`, () => {
			// Se construye la ruta completa al archivo info.json
  	  	  	const jsonFilePath = path.join(basePath, folder, 'info.json');

			// Se llama a la función de validación pasando la ruta del archivo JSON
  	  	  	validateJsonFile(jsonFilePath);
  	  	});
  	});
});
