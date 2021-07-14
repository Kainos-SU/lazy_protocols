function isNumber(string) {
	return !isNaN(parseInt(string.trim()));
}

function isUKPZE (string) {
	if(string.startsWith("~")) {return -1}
	return string.indexOf("УКПЗЭ");
}

function isBKZE (string) {
	if(string.startsWith("~")) {return -1}
	return string.indexOf("БКЗЭ");
}

function getBlockNumber (string) {
	let startString;
	if (isUKPZE(string)) {startString = "УКПЗЭ";}
	else if (isBKZE(string)) {startString = "БКЗЭ";}
	else {throw "Uknown type of protocol!";}
	
	const startText = string.indexOf(startString) + startString.length - 1;
	const endText = string.indexOf("№", startText);
	let counter = 0;
	
	while (true) {
		const index = counter++ + endText;
		if (isNumber(string.slice(index))) {
			return parseInt(string.slice(index));
		}
	}
}

function compareProtocols (a, b) {
	if (isUKPZE(a) && isBKZE(b)) {
		return -1;
	}
	
	if (isBKZE(a) && isUKPZE(b)) {
		return 1;
	}
	
	const aNumber = getBlockNumber(a);
	const bNumber = getBlockNumber(b);
	
	if (aNumber < bNumber) {
		return -1;
	}
	if (aNumber > bNumber) {
		return 1;
	}
	return 0;
}

module.exports = {isNumber, isUKPZE, isBKZE, compareProtocols, getBlockNumber};