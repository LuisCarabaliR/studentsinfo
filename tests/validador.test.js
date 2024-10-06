const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

// Campos requeridos en el archivo JSON
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
	try {
		const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		const missingFields = requiredFields.filter(field => !(field in data));

		if (missingFields.length > 0) {
			throw new Error(`No están los campos requeridos: ${missingFields.join(', ')}`);
		}
	} catch (error) {
		throw new Error(`Error al validar el archivo JSON en ${filePath}: ${error.message}`);
	}
};

// Función para obtener la rama principal ('master' en este caso)
const getMainBranch = () => {
	try {
		// Verifica si existe 'master'
		execSync('git rev-parse --verify origin/master');
		return 'master';
	} catch (error) {
		throw new Error('No se encontró la rama "master". Verifica tu repositorio.');
	}
};

// Pruebas de validación de archivos JSON
describe('Validación de archivos JSON', () => {
	const mainBranch = getMainBranch(); // Obtiene la rama principal ('master')

	// Obtén los archivos modificados comparados con la rama 'master'
	const changedFiles = execSync(`git diff --name-only origin/${mainBranch}`)
		.toString()
		.split('\n')
		.filter(file => file.includes('public/data') && file.endsWith('info.json')); // Filtra solo archivos info.json en public/data

	// Si no hay archivos modificados, no se ejecutan las pruebas
	if (changedFiles.length === 0) {
		console.log('No se modificaron archivos info.json en public/data');
		return;
	}

	// Itera sobre los archivos modificados y valida cada uno
	changedFiles.forEach(file => {
		test(`Validar ${file}`, () => {
			const jsonFilePath = path.join(__dirname, `../${file}`);
			validateJsonFile(jsonFilePath);
		});
	});

	expect(changedFiles.length).toBeGreaterThan(0);
});
