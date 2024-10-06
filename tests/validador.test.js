const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

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
	// Obtener la rama principal de forma más robusta
	const branches = execSync('git branch -r').toString().trim().split('\n');
	const mainBranch = branches.find(branch => branch.includes('->')) ? branches.find(branch => branch.includes('->')).split('->')[1].trim() : 'origin/master';

	// Se obtiene la lista de archivos modificados comparados con la rama principal
	const changedFiles = execSync(`git diff --name-only ${mainBranch}...HEAD`) // Cambiado aquí
	  .toString() // Convierte el resultado en una cadena de texto
	  .split('\n') // Divide la cadena por líneas (cada archivo en una línea)
	  .filter(file => file.includes('public/data') && file.includes('info.json')); // Filtra solo los archivos info.json en public/data

	// Si no hay archivos modificados, se agrega una prueba que indica que no hay archivos para validar
	if (changedFiles.length === 0) {
	  test('No hay archivos para validar', () => {
		console.log('No se modificaron archivos info.json en public/data');
	  });
	  return;
	}
  
	// Iterar sobre los archivos modificados y validar cada info.json
	changedFiles.forEach(file => {
	  test(`Validar ${file}`, () => {
		const jsonFilePath = path.join(__dirname, `../${file}`); // Se construye la ruta completa al archivo modificado
		validateJsonFile(jsonFilePath); // Valida el archivo modificado
	  });
	});
});
