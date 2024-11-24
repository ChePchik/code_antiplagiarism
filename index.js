const fs = require("fs");
const esprima = require("esprima");

// Функция для получения токенов из кода
function getTokens(code) {
	const tokens = esprima.tokenize(code, { range: true });
	return tokens.map((token) => token.type);
}

// Функция для создания N-грамм
function createNGrams(tokens, n) {
	let ngrams = [];
	for (let i = 0; i < tokens.length - n + 1; i++) {
		ngrams.push(tokens.slice(i, i + n).join(" "));
	}
	return ngrams;
}

// Функция для сравнения N-грамм
function compareNGrams(ngrams1, ngrams2) {
	let matches = 0;
	let ngramsSet2 = new Set(ngrams2);
	for (let ngram of ngrams1) {
		if (ngramsSet2.has(ngram)) {
			matches++;
		}
	}
	let total = Math.max(ngrams1.length, ngrams2.length);
	return (matches / total) * 100; // процент совпадения
}

// Чтение двух файлов кода
const code1 = fs.readFileSync("code1.js", "utf8");
const code2 = fs.readFileSync("code2.js", "utf8");

const tokens1 = getTokens(code1);
const tokens2 = getTokens(code2);

const ngrams1 = createNGrams(tokens1, 3); // 3-граммы
console.log("🚀 ~ ngrams1:", ngrams1);
const ngrams2 = createNGrams(tokens2, 3);

const similarity = compareNGrams(ngrams1, ngrams2);

console.log(`Сходство кода: ${similarity.toFixed(2)}%`);

if (similarity > 70) {
	// Пороговое значение сходства
	console.log("Высокая вероятность плагиата.");
} else {
	console.log("Коды отличаются.");
}
