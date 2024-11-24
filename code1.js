const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json()); // Для обработки JSON-запросов

// Роут для удаления страны
app.delete("/api/countries/:country", (request, response) => {
	const { country } = req.params;

	if (!country || typeof country !== "string") {
		return response.status(400).json({ error: "Неверное название страны" });
	}

	try {
		// Читаем данные из файла
		const data = JSON.parse(fs.readFileSync("./data/data.json", "utf-8"));

		// Проверяем наличие страны в списке
		const countryIndex = data.countries.findIndex((c) => c.toLowerCase() === country.toLowerCase());

		if (countryIndex === -1) {
			return response.status(404).json({ error: "Страна не найдена" });
		}

		// Удаляем страну из списка
		data.countries.splice(countryIndex, 1);

		// Сохраняем обновленные данные в файл
		fs.writeFileSync("./data/data.json", JSON.stringify(data, null, 2), "utf-8");

		res.status(200).json({ message: "Страна удалена", countries: data.countries });
	} catch (error) {
		console.error("Ошибка обработки файла:", error);
		res.status(500).json({ error: "Ошибка сервера" });
	}
});

// Пример запуска сервера
app.listen(3000, () => {
	console.log("Сервер запущен на http://localhost:3000");
});
