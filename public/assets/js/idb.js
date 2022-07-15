//create variable to hold db connection
let db;

//establish a connection to IndexedDB, set it to version 1
//acts as an event listener everytime we open the connection
const request = indexedDB.open('pizza_hunt', 1);

//event will emit if the database version changes
request.onupgradeneeded = function(event) {
    //save a reference to the database
    const db = event.target.result;
    //creating an object store, setting it to have auto increment
    db.createObjectStore('new_pizza', {autoIncrement: true});
};

//upon a successful 
request.onsuccess = function(event) {
    //when db is successfully created with its object store
    //or simply established a connection, save a reference to db in global variable
    db = event.target.result;

    //check if app is online, if yes, run uploadPizza() function to send all local data to api
    if (navigator.onLine){
        uploadPizza()
    }
};

request.onerror = function(event){
    //log error here
    console.log(event.target.errorCode);
};

//function will be executed if we attempt to submit a new pizzza and there's no internet connection
function saveRecord(record){
    //transaction = temporary connection. Data isnt in flux at all time
    //open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'],'readwrite');

    //access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //add record to the store with add method 
    pizzaObjectStore.add(record);
}

function uploadPizza(){
    //open a transaction
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //acces the object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    //upon a succesful .getAll() execution, run this function 
    getAll.onsuccess = function() {
        //if there was data in indexedDb's store, send it to the api server
        if(getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept:'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message){
                    throw new Error(serverResponse)
                }
                //open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                //access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                //clear all items in your store
                pizzaObjectStore.clear();

                alert(' All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
};

window.addEventListener('online', uploadPizza);