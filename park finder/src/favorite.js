import * as firebase from "./firebase.js"

const init = () =>{
    firebase.onValue(firebase.ref(firebase.db, "favorites/"),firebase.favoriteCounter);
}
document.querySelector("#send-btn").onclick = () => {
    let text = document.querySelector("#input-id").value;
    if(text){
        if(document.querySelector("#decrement").checked){
            firebase.decrementPush(text);
        }
        else{
            firebase.incrementPush(text);
        }
    }
}

init();