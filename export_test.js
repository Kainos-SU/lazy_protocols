const WordExtractor = require("word-extractor");
const {isBKZE,isUKPZE, getBlockNumber, compareProtocols} = require ("./helpers/helperFunctions");
const {parseUKPZE, parseBKZE} = require("./helpers/parseText");
const fs = require("fs");

const extractor = new WordExtractor();
const dirs = [];
dirs.push("E:\\Документация\\Протоколы РЗиА\\БКЗЭ\\Участок 1\\2021\\ТП-49", "E:\\Документация\\Протоколы РЗиА\\Протоколы самозапусков\\Участок 1\\2021\\ТП-49");

const files = [];
	
for (const dir of dirs) {
	const fileList = fs.readdirSync(dir, {whithFileTypes: true});
	const ukpzeList = fileList.filter(a=>isUKPZE(a)!==-1);
	const bkzeList = fileList.filter(a=>isBKZE(a)!==-1);
	files.push({
		dir,
		UKPZE: ukpzeList,
		BKZE: bkzeList
	});
}

const docs = [];

for (const i of files) {
	docs.push((async (i)=>{
		const UKPZE = [];
		const BKZE = [];
		for (const j of i.UKPZE) {
			const extracted = await extractor.extract(i.dir + "\\" + j);
			const block = parseUKPZE(extracted.getBody());
			UKPZE.push(block);
		}
		for (const j of i.BKZE) {
			const extracted = await extractor.extract(i.dir + "\\" + j);
			const block = parseBKZE(extracted.getBody());
			BKZE.push(block);
		}
		return {
			dir: i.dir,
			UKPZE,
			BKZE,
		};
	})(i));
}

Promise.all(docs).then(arr=>{
	for (const i of arr) {
		//console.log(Array.isArray(i.UKPZE));
		
		let result = "УКПЗЭ\n";
		result += "Тип,Номер,Пауза самозапуска\n"
		if (i.UKPZE.length !== 0) {
			for (const j of i.UKPZE) {
				result += `${j.type},${j.number},${j.pause}\n`;
			}
		}
		result += "БКЗЭ\n";
		result += "Тип,Номер,Значение номинального тока,Время срабатывания Iвтз,Значение тока заклинивания Iзкл,Время срабатывания Iзкл,Блокировка защиты\n";
		if (i.BKZE.length !== 0) {
			for (const j of i.BKZE) {
				result += `${j.type},${j.number},${j.nominalCurrent},${j.termalTrip},${j.stuckRotor},${j.stuckRotorTime},${j.protBlock}\n`;
			}
		}
		fs.writeFile(i.dir + "\\base.csv", result, err=>{
			if (err) {
				console.warn(err);
			}
		});
	}
}).catch(err=>console.log(err));