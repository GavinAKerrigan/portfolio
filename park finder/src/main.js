import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js"
import * as firebase from "./firebase.js"

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let favoriteIds = storage.readFromLocalStorage("gak6718-favorites");
if(!favoriteIds){favoriteIds = new Array();}
let geojson;

let addBtn = document.querySelector("#add");
let deleteBtn = document.querySelector("#delete");

// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatNYS);
	}
	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45,0);
		map.flyTo(lnglatNYS);
	}
	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatUSA);
	}
	refreshFavorites();
}

const getFeatureById = (id) =>{
	for(let i = 0; i < geojson.features.length; i++){
		if(geojson.features[i].id == id){
			return geojson.features[i];
		}
	}
}

const showFeatureDetails = (id) => {
	deleteBtn.disabled = true;
	addBtn.disabled = true;
	
	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	document.querySelector("#details-2").innerHTML = `
	<p>Address: ${feature.properties.address}</p>
	<p>Phone: <a href="tel:+${feature.properties.phone}">${feature.properties.phone}</a></p>
	<p>Website: <a href="${feature.properties.url}">${feature.properties.url}</a></p> 
	`;
	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;

	addBtn.value = feature.id;
	deleteBtn.value = feature.id;

	for (const id of favoriteIds){
		if(id == feature.id){ deleteBtn.disabled = false; }
	};

	if(deleteBtn.disabled == true){
		addBtn.disabled = false;
	}
};

const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for (const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	};
	storage.writeToLocalStorage("gak6718-favorites", favoriteIds);
};

const createFavoriteElement = (id) =>{
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};
	a.innerHTML = `
	<span class="panel-icon">
		<i class="fas fa-map-pin"></i>
	</span>
	${feature.properties.title}
	`;
	return a;
}

const addToFavorites = (id) => {
	for(const arrayId of favoriteIds){
		if(arrayId == id){ return }
	};
	favoriteIds.push(id);
}

const deleteFavorite = (id) => {
	let removeId;
	for (let i = 0; i < favoriteIds.length; i++){
		if(favoriteIds[i] == id){removeId = i}
	};
	if(removeId == undefined){ return }
	favoriteIds.splice(removeId, 1);
}

const favoriteCounter = () => {
	for (const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	};
};


const init = () => {
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		//console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});
};

addBtn.onclick = () => {
	addToFavorites(addBtn.value);
	firebase.incrementPush(addBtn.value);
	refreshFavorites();
	showFeatureDetails(addBtn.value);
}

deleteBtn.onclick = () => {
	deleteFavorite(deleteBtn.value);
	firebase.decrementPush(deleteBtn.value);
	refreshFavorites();
	showFeatureDetails(deleteBtn.value);
}

init();