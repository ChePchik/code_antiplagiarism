const fs = require("fs");
const esprima = require("esprima");

// Функция для нормализации кода
function normalizeCode(code) {
	const ast = esprima.parseScript(code, { range: true });

	let id = 0;
	const identifiersMap = {};

	const replaceIdentifiers = (node) => {
		if (node.type === "Identifier") {
			if (!identifiersMap[node.name]) {
				identifiersMap[node.name] = `var${id++}`;
			}
			node.name = identifiersMap[node.name];
		}

		for (let key in node) {
			if (node.hasOwnProperty(key) && typeof node[key] === "object" && node[key] !== null) {
				replaceIdentifiers(node[key]);
			}
		}
	};

	replaceIdentifiers(ast);

	return ast;
}

// Чтение и нормализация двух файлов кода
const code1 = fs.readFileSync("code1.js", "utf8");
const code2 = fs.readFileSync("code2.js", "utf8");

const normalizedAst1 = normalizeCode(code1);
const normalizedAst2 = normalizeCode(code2);

// Сравнение нормализованных AST
const areSimilar = JSON.stringify(normalizedAst1) === JSON.stringify(normalizedAst2);
console.log("🚀 ~ normalizedAst2:", normalizedAst2);
console.log("🚀 ~ normalizedAst1:", normalizedAst1);

if (areSimilar) {
	console.log("Коды очень похожи или идентичны (возможен плагиат).");
} else {
	console.log("Коды различаются.");
}
