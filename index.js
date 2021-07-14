const WordExtractor = require("word-extractor");
const fs = require("fs");

const extractor = new WordExtractor();
const dir = "E:\\Документация\\Протоколы РЗиА\\БКЗЭ\\Участок 1\\2021\\ТП-49";
//const dir = "E:\\Документация\\Протоколы РЗиА\\Протоколы самозапусков\\Участок 1\\2021\\ТП-49";
let files = fs.readdirSync(dir, {whithFileTypes: true});
files = files.filter(a=>{if(a.includes("БКЗЭ")){return true} return false})
files = files.sort((a,b)=>{
	const numberA = parseInt(a.slice(a.indexOf("№") + 1, a.indexOf("№") + 4));
	const numberB = parseInt(b.slice(b.indexOf("№") + 1, b.indexOf("№") + 4));
	if (numberA < numberB) {
		return -1;
	}
	if (numberA > numberB) {
		return 1;
	}
	return 0;
});

console.log(files);

const table = [];


for (let i = 0; i < files.length; ++i) {
	

	const extracted = extractor.extract(dir + "\\" + files[i]);

	extracted.then((doc)=>{
		const string = doc.getBody();
		let rowIndex = string.indexOf("зав. №");
		let textEnd = string.indexOf("№", rowIndex) + 1;
		let rowEnd = string.indexOf("\n", rowIndex);
				
		const blockNum = parseInt(string.slice(textEnd, rowEnd).trim());
		
		rowIndex = string.indexOf("Значение номинального тока Iном, A");
		textEnd = string.indexOf("A", rowIndex) + 1;
		rowEnd = string.indexOf("\n", rowIndex);
		const nominalCurrent = parseFloat(string.slice(textEnd, rowEnd).trim().replace(",", "."));
		rowIndex = string.indexOf("Время срабатывания Iвтз, сек");
		textEnd = string.indexOf("сек", rowIndex) + 3;
		rowEnd = string.indexOf("\n", rowIndex);
		const longCurrentTime = parseFloat(string.slice(textEnd, rowEnd).trim().replace(",", "."));
		rowIndex = string.indexOf("Значение тока заклинивания Iзкл, A");
		textEnd = string.indexOf("A", rowIndex) + 1;
		rowEnd = string.indexOf("\n", rowIndex);
		const instantCurren = parseFloat(string.slice(textEnd, rowEnd).trim().replace(",", "."));
		rowIndex = string.indexOf("Время срабатывания Iзкл, сек");
		textEnd = string.indexOf("сек", rowIndex) + 3;
		rowEnd = string.indexOf("\n", rowIndex);
		const instantCurrentTime = parseFloat(string.slice(textEnd, rowEnd).trim().replace(",", "."));
		
		console.log(table.length)
		if (blockNum) {
			table.push({blockNum, nominalCurrent, longCurrentTime, instantCurren, instantCurrentTime});	
		}
		
		if (table.length === files.length) {
			table.sort((a, b)=>{
				if (a.blockNum > b.blockNum)
					return 1;
				if (a.blockNum < b.blockNum)
					return -1;
				return 0;
			});
			fs.writeFile(dir + "\\list.json", JSON.stringify(table), err=>{
				if (err) {
					console.log(err);
					return;
				}
			});
			console.log(table);
		}
		
	});
}

