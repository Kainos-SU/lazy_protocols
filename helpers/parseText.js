const {isNumber, isBKZE, isUKPZE, getBlockNumber} = require ("./helperFunctions");

function parseUKPZE (string) {
	const number = getBlockNumber(string);
	const type = number>=600?"УКПЗЭ-2":"УКПЗЭ-1";
	const startStrings = [
		"Время паузы самозапуска, сек :",
		"Время задержки самозапуска, сек:"
	];
	let arrayIndex = 0;
	if (type === "УКПЗЭ-2") {
		arrayIndex = 1; 
	}
	
	const index = string.indexOf(startStrings[arrayIndex]);
	
	
	let pause;
	let counter = 0
	while (true) {
		const sugestedNumber = string.slice(index + startStrings[arrayIndex].length + counter++);
		if (isNumber(sugestedNumber)) {
			pause = parseInt(sugestedNumber);
			break;
		}
	}
	return {
		type,
		number,
		pause
	};
}

function parseBKZE (string) {
	const inspectedSubstrings = {
		nominalCurrent: "Значение номинального тока Iном, A",
		termalTrip: "Время срабатывания Iвтз, сек",
		stuckRotor: "Значение тока заклинивания Iзкл, A",
		stuckRotorTime: "Время срабатывания Iзкл, сек",
		protBlock: "Блокировка защиты"
	};
	
	const result = {};
	result.number = getBlockNumber(string);
	result.type = "БКЗЭ-1М";
	
	for (const key in inspectedSubstrings) {
		const index = string.indexOf(inspectedSubstrings[key]) + inspectedSubstrings[key].length;
		const endIndex = string.indexOf("\n", index);
		const valueSubstring = string.slice(index, endIndex).trim();
		//console.log(valueSubstring);
		if (valueSubstring.toLowerCase() === "да") {
			result[key] = true;
			continue;
		}
		if (valueSubstring.toLowerCase() === "нет") {
			result[key] = false;
			continue;
		}
		result[key] = parseFloat(valueSubstring.replace(",", "."));
	}
	
	return result;
}

module.exports = {parseUKPZE, parseBKZE};