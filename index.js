//loads menu based on the menu.txt
function loadMenu(pass) {
	var drop = new XMLHttpRequest();
	drop.overrideMimeType("text/plain");
	drop.onreadystatechange = function(){
		if (drop.status == 200 && drop.readyState == 4){
			var file = drop.responseText;
			var cell = file.split('\n');
			var links = document.createElement("div");
			links.id = "links";
			var ul = document.createElement("ul");
			ul.id = "menu";
			links.appendChild(ul);
			document.getElementsByTagName("html")[0].insertBefore(links, document.getElementsByTagName("body")[0]);
			
			for (var i = 0; i < cell.length - 1; i++) {
				cell[i] = cell[i].split(',');
				createMenu(cell[i], i);
			}
			if (pass == true) {
				createBar();
			}
		}
	};
	drop.open("GET", "menu.txt", true);
	drop.send();
}
var content = 0;

//creates menu using createElement() and is based on which the second column of the text file
function createMenu(menuItem, num) {
	var name = 0, className = 1, ref = 2;
	
	if (menuItem[className] == "none") {
		var list = document.createElement("li");
		list.id = "list" + num;
		var anchor = document.createElement("a");
		anchor.href = menuItem[ref];
		anchor.id = "anchor" + num;
		document.getElementById("menu").appendChild(list);
		document.getElementById("list" + num).appendChild(anchor);
		var descrip = document.createTextNode(menuItem[name]);
		document.getElementById("anchor" + num).appendChild(descrip);
	} else if (menuItem[className] == "dropdown") {
		var dropdown = document.createElement("li");
		var divDropdown = document.createElement("div");
		divDropdown.className = menuItem[className];
		var dropdownMenu = document.createElement("div");
		dropdownMenu.id = menuItem[className];
		dropdownMenu.className = "content";
		var text = document.createTextNode(menuItem[name]);
		divDropdown.appendChild(text);
		dropdown.appendChild(divDropdown);
		document.getElementById("menu").appendChild(dropdown);
		divDropdown.appendChild(dropdownMenu);
	} else {
		for (var x = 0; x < menuItem.length; x++) {
			var list = document.createElement("li");
			var item = document.createElement("a");
			var itemText = document.createTextNode(menuItem[x]);
			x++;
			item.href = menuItem[x];
			item.appendChild(itemText);
			list.appendChild(item);
			document.getElementsByClassName("content")[content].appendChild(list);
		}
		content++;
	}
}

//creates search bar
function createBar() {
	var box = document.createElement("div");
	box.id = "box"
	var field = document.createElement("div");
	field.id = "field";
	var searchbar = document.createElement("input");
	searchbar.type = "search";
	searchbar.id = "searchbutton";
	searchbar.placeholder = "Search...";
	var searchbarimage = document.createElement("input");
	searchbarimage.type = "image";
	searchbarimage.id = "mag";
	searchbarimage.src = "Images/icon.png";
	searchbarimage.setAttribute("onClick", "search()");
	field.appendChild(searchbarimage);
	field.appendChild(searchbar);
	box.appendChild(field);
	document.getElementById("menu").appendChild(box);
}

/*when the plus button is clicked, it gets the name of the picture which is the id. 
After it searches for the name of the storage, it takes the value and add it by one. Updates the number as well*/
function countUp(name, id) {
	var number = parseInt(document.getElementById("count" + id).innerHTML) + 1;
	
	if (number > 99) {
		number = number - 1;
	}
	sessionStorage[name] = number;
	document.getElementById("count" + id).innerHTML = number;
	addCart();
}

function countDown(name, id) {
	var number = parseInt(document.getElementById("count" + id).innerHTML) - 1;
	
	if (number < 0) {
		number = number + 1;
	}
	sessionStorage[name] = number;
	document.getElementById("count" + id).innerHTML = number;
	addCart();
}

var cell = new Array();
var filterArray;

//reads the invenotry.txt and puts it in an array
function inventory() {
	var inv = new XMLHttpRequest();
	inv.overrideMimeType("text/plain");
	inv.onreadystatechange = function(){
		if (inv.status == 200 && inv.readyState == 4){
			var file = inv.responseText;
			temp = file.split('\n');
			
			for (var i = 0; i < temp.length; i++) {
				temp[i] = temp[i].split(',');
				if (temp[i] != "") {
					cell.push(temp[i]);
				}
			}
			filterArray = cell;
			productPage(cell);
		}
	};
	inv.open("GET", "inventory.txt", true);
	inv.send();
}

//unchecks all the input boxes(radio buttons and checkboxes)
function uncheck() {
	for (var i = 0; document.getElementsByTagName("input")[i] != undefined; i++) {
		document.getElementsByTagName("input")[i].checked = false;
	}
}

//whenever this function runs it will make the main-contain blank and adds products based on the the array it has recieved
function productPage(productCell) {
	document.getElementsByClassName("main-contain")[0].innerHTML = "<div id = 'imageclick' class = 'cover'><a href = '#'></a><div class = 'popup' id = 'popup'></div></div>";
	var invArray = ["add", "remove", "info", "numproducts"];

	for (var i = 0; i < productCell.length; i++) {
		var pcontain = document.createElement("div");
		pcontain.className = "products-contain";
		var cbutton = document.createElement("div");
		cbutton.id = "cartButtons";
		var productImage = document.createElement("a");
		productImage.href = "#imageclick";
		productImage.setAttribute("onclick", "popupLink(" + i + ")");
		var product = document.createElement("img");
		product.src = "Images/productpictures/" + productCell[i][6];
		productImage.appendChild(product);
		cbutton.appendChild(productImage);
		
		for (var x = 0; x < invArray.length; x++) {
			var nameLabel = invArray[x];
			nameLabel = document.createElement("label");
			nameLabel.id = invArray[x];
			nameLabel.className = "cart";
			var nameSpan = document.createElement("span");
			
			if (invArray[x] == "add") {
				nameSpan.setAttribute("onClick", "countUp('" + productCell[i][1] + "'," + i + ")");
			} else if (invArray[x] == "remove") {
				nameSpan.setAttribute("onClick", "countDown('" + productCell[i][1] + "'," + i + ")");
			} else if (invArray[x] == "numproducts") {
				nameSpan.id = "count" + i;
				if (sessionStorage.getItem(productCell[i][1]) != null){
					nameSpan.innerHTML = sessionStorage.getItem(productCell[i][1]);
				} else {
					sessionStorage.setItem(productCell[i][1], "0");
					nameSpan.innerHTML = sessionStorage.getItem(productCell[i][1]);
				}						
			}  else if (invArray[x] == "info") {
				var content = document.createElement("span");
				content.setAttribute("onclick", "popupLink(" + i + ")");
				nameSpan = document.createElement("a");
				nameSpan.href = "#imageclick";
				nameSpan.appendChild(content);
			}
			nameLabel.appendChild(nameSpan);
			cbutton.appendChild(nameLabel);
		}
		pcontain.appendChild(cbutton);
		document.getElementsByClassName("main-contain")[0].insertBefore(pcontain, document.getElementsByClassName("cover")[0]);
	}
	addCart();
}

//this updates the shopping tab on the right
function addCart() {
	document.getElementById("innerTab").innerHTML = "<span id = 'numProd'>#</span><span id = 'productName'>Product Name</span><span id = 'priceProd'>Price</span>";
	var prodStore = new Array();
	var numStore = new Array();
	var price = new Array();
	var total = 0;
	
	for (var j = 0; j < sessionStorage.length; j++) {
		if (sessionStorage.getItem(cell[j][1]) != "0") {
			prodStore.push(cell[j][1]);
			numStore.push(sessionStorage.getItem(cell[j][1]));
			price.push(cell[j][5]);
		}
	}
	
	for (var k = 0; k < prodStore.length; k++) {
		var shoppingCart = document.createElement("div");
		shoppingCart.id = "shoppingCart";
		var num = document.createElement("span");
		var numText = document.createTextNode(numStore[k]);
		num.id = "numProd";
		num.appendChild(numText);
		var priceProd = document.createElement("span");
		var priceTotal = parseFloat(price[k]) * parseFloat(numStore[k]);
		var priceProdText = document.createTextNode("$" + priceTotal.toString());
		priceProd.id = "priceProd";
		priceProd.appendChild(priceProdText);
		var productNameSpan = document.createElement("span");
		productNameSpan.id = "productName";
		var productName = document.createTextNode(prodStore[k]);
		productNameSpan.appendChild(productName);
		shoppingCart.appendChild(num);
		shoppingCart.appendChild(productNameSpan);
		shoppingCart.appendChild(priceProd);
		document.getElementById("innerTab").appendChild(shoppingCart);
		total+= priceTotal;
	}
	document.getElementById("total").innerHTML = "$" + total.toFixed(2);
}

//searching everything based on the user's input and send it to another function: productPage()
function search() {
	var query = document.getElementById("searchbutton").value.toLowerCase();
	var results = new Array();
	
	for (var i = 0; i < cell.length; i++) {
		var check = cell[i].toString().toLowerCase();
		if (check.indexOf(query) > -1) {
			results.push(cell[i]);
		}
	}
	filterArray = results;
	productPage(results);
}

//based on the which picture the user clicks and makes a popup of the product's information
function popupLink(id) {
	document.getElementById("popup").innerHTML = "";
	var img = document.createElement("img");
	img.src = "Images/productpictures/" + filterArray[id][6];
	document.getElementById("popup").appendChild(img);
	var a = document.createElement("a");
	a.href = "#";
	a.innerHTML = "&times";
	document.getElementById("popup").appendChild(a);
	var div = document.createElement("div");
	div.id = "description";
	
	var index = [1, 4, 5];
	var idtag = ["title", "detail", "price"];
	
	for (var i = 0; i < 3; i++) {
		var ptag = document.createElement("P");
		ptag.id  = idtag[i];
		
		if (i == 0) {
			ptag.appendChild(document.createTextNode(filterArray[id][index[i]]));
			document.getElementById("popup").appendChild(ptag);
		} else {
			var label;
			
			if (i == 2) {
				label = document.createTextNode("Price: ");
			} else if (i == 1) {
				label = document.createTextNode("Description: ");
			}
			var content = document.createTextNode(filterArray[id][index[i]]);
			ptag.appendChild(label);
			ptag.appendChild(content);
			div.appendChild(ptag);			
		}
	}
	document.getElementById("popup").appendChild(div);
}

//when the priceFilter has been clicked(on the left) it will filter accordingly
function priceFilter() {
	var priceFilterResultMin = new Array(), priceFilterResultMax = new Array();
	var priceFilterOver = new Array();
	var result = new Array();
	
	for (var i = 0; document.getElementsByTagName("input")[i] != undefined; i++) {
		if (isFinite(document.getElementsByTagName("input")[i].id) && document.getElementsByTagName("input")[i].name == "price" && document.getElementsByTagName("input")[i].type == "checkbox" && document.getElementsByTagName("input")[i].checked == true) {
			if (document.getElementsByTagName("input")[i].className == "over") {
				priceFilterOver.push(parseFloat(document.getElementsByTagName("input")[i].id));
			} else {
				priceFilterResultMin.push(parseFloat(document.getElementsByTagName("input")[i].id));
				priceFilterResultMax.push(parseFloat(document.getElementsByTagName("input")[i].className));
			}
		}
	}
	var min = Math.min.apply(Math, priceFilterResultMin);
	var max = Math.max.apply(Math, priceFilterResultMax);
	
	for (var a = 0; a < cell.length; a++) {
		if (parseFloat(cell[a][5]) > min && parseFloat(cell[a][5]) < max || parseFloat(cell[a][5]) > Math.min.apply(Math, priceFilterOver)) {
			result.push(cell[a]);
		}
	}
	
	if (result.length == 0) {
		sortFilter();
	} else {
		filterArray = result;
		sortFilter();
	}
}

//sorts the array accordingly 
function sortFilter() {
	var name = new Array();
	var result = new Array();
	var num;
	
	for (var i = 0; document.getElementsByTagName("input")[i] != undefined; i++) {
		if (isFinite(document.getElementsByTagName("input")[i].id) && document.getElementsByTagName("input")[i].name == "sort" && document.getElementsByTagName("input")[i].type == "radio" && document.getElementsByTagName("input")[i].checked == true) {
			num = document.getElementsByTagName("input")[i].id;
		}
	}
	if (num == undefined) {
		for (var i = 0; i < filterArray.length; i++) {
			result.push(filterArray[i]);
		}
		productPage(result);
	} else if (num != undefined) {
		if (num == 1 || num == 2) {
			for (var i = 0; i < filterArray.length; i++) {
				name.push(filterArray[i][1]);
			}
			name.sort();
		} else if (num == 3 || num == 4){
			for (var i = 0; i < filterArray.length; i++) {
				name.push(parseFloat(filterArray[i][5]));
			}
			name.sort(function(a, b){return a-b});
		}
		if (num == 2 || num == 4) {
			name.reverse();
		}
		for (var a = 0; a < name.length; a++) {
			var temp = name[a].toString();
			for (var b = 0; b < cell.length; b++) {
				if (cell[b][1] == temp && (num == 1 || num == 2)) {
					result.push(cell[b]);
				} else if (cell[b][5] == temp && (num == 3 || num == 4)) {
					result.push(cell[b]);
				}
			}
		}
		filterArray = result;
		productPage(filterArray);
	}
}

//display the confirmation of the checkout
function display() {
	document.getElementById("checkpopup").style.display = "block";
}

//remove the confirmation of the checkout
function exit() {
	document.getElementById("checkpopup").style.display = "none";
	sessionStorage.clear();
	productPage(cell);
	uncheck();
}

function stop() {
	
}


