function condition(i, num) {
	return array[i][num].toLowerCase().indexOf(query) != -1;
}

function search() {
	query = document.getElementById("searchbutton").value.toLowerCase();
	var counter = 0;
	
	for (var i = 0; i < array.length; i++) {
		if (condition(i, 1) || condition(i, 3) || condition(i, 4)) {
			counter++;
			console.log(array[i][1]);
		}
	}
	alert(counter + " Results");
}

var inv = new XMLHttpRequest();
var k, item, query;
var array = [];
inv.onreadystatechange = function() {
	if(inv.status == 200 && inv.readyState == 4) {
		var file = inv.responseText;
		item = file.split('\n');
	
		for(var i = 0; i < item.length; i++){
			k = item[i].split(',');
			array.push(k);
			//console.log(k);
		}
	console.log(array);
	}
};
inv.open("GET", "inventory.csv", true);
inv.send();