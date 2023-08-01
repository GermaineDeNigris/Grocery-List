import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue,remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appDatabase = {
    databaseURL: "https://grocery-app-d8d1f-default-rtdb.europe-west1.firebasedatabase.app/"
}

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const groceryListEl = document.getElementById("grocery-list")

const app = initializeApp(appDatabase)
const database = getDatabase(app)
const groceryItemsInDB = ref(database, "groceries")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value

    push(groceryItemsInDB, inputValue)

    clearInput()

// causing a duplicate render (already rendered in onValue function)
    // renderNewItemHTML(inputValue)

})

onValue(groceryItemsInDB, function(snapshot){

    if(snapshot.exists()){
    let groceryArray = Object.entries(snapshot.val())

    clearListEl()

    for (let i = 0; i < groceryArray.length; i++) {
        let currentItem = groceryArray[i]
        let currentItemID = currentItem[0]
        let currentItemValue = currentItem[1]

        renderNewItemHTML(currentItem)
    }
    } else {
        groceryListEl.innerHTML = `&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Your list is empty`
    }
})

function clearListEl(){
    groceryListEl.innerHTML = ""
}

function clearInput(){
    inputFieldEl.value = ""
}

function renderNewItemHTML(item){
    let itemId = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("dblclick", function(){
        let exactLocationOfItemInDB = ref(database, `groceries/${itemId}`)

        remove(exactLocationOfItemInDB)
    })

    groceryListEl.append(newEl)
}
