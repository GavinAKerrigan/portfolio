// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, push, onValue, increment } from  "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQdJgZbRhTvN3o2pitexn5pg5Bt5rzPj8",
  authDomain: "favorites-4aab2.firebaseapp.com",
  projectId: "favorites-4aab2",
  storageBucket: "favorites-4aab2.appspot.com",
  messagingSenderId: "999441389726",
  appId: "1:999441389726:web:59df2e6b4f7e3849a6c38f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

const favoritesPath = "df-favorites"
const favoriteList = document.querySelector("#favorite-list");

const parks = {
  p79   : "Letchworth State Park",
  p20   : "Hamlin Beach State Park",
  p180  : "Brookhaven State Park",
  p35   : "Allan H. Treman State Marine Park",
  p118  : "Stony Brook State Park",
  p142  : "Watkins Glen State Park",
  p62   : "Taughannock Falls State Park",
  p84   : "Selkirk Shores State Park",
  p43   : "Chimney Bluffs State Park",
  p200  : "Shirley Chisholm State Park",
  p112  : "Saratoga Spa State Park"
};

const incrementPush = park => {
  const favRef = ref(db, `favorites/${park}`);
  
  let parkName = parks[park];

  set(favRef, 
    {park, 
    parkName,
    likes: increment(1)
  });
}

const decrementPush = park => {
  const favRef = ref(db, `favorites/${park}`);

  let parkName = parks[park];

  set(favRef, 
    {park, 
    parkName,
    likes: increment(-1)
  });
}

const favoriteCounter = (snapshot) => {
  favoriteList.innerHTML = "";
  snapshot.forEach(fav => {
    const childKey = fav.key;
    const childData = fav.val();
    console.log(childKey,childData);
    favoriteList.innerHTML += `<li><b>${childData.parkName} (${childData.park})</b>- likes ${childData.likes}</li>`;
  })
}

export { db, favoritesPath, ref, set, push, incrementPush, decrementPush, favoriteCounter, onValue };