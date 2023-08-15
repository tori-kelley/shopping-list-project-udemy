const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearButton = document.getElementById("clear");
const itemsFilter = document.getElementById("filter");
const formButton = itemForm.querySelector("button");
let isEditMode = false;


function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    const checkedFromStorage = getCheckedFromStorage();
    itemsFromStorage.forEach((item) => {
        let DOMItem = addItemToDOM(item);
        if (checkedFromStorage.includes(item)) {
            DOMItem.classList.add("checked-off");
        }
    });
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value.toLowerCase();

    //Validate input
    if (newItem === "") {
        alert("Please add an item.");
        return;
    }

    //check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector(".edit-mode");
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.remove();
        isEditMode = false;
    }
    else {
        if (checkIfItemExists(newItem)) {
            alert("That item already exists!");
            return;
        }
    }

    addItem(newItem);
} 

function addItem(newItem){
    //create item DOM element
    const liItem = addItemToDOM(newItem);

    //add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = "";
    return liItem;
}

function addItemToDOM(item) {
    //create list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    // add li to the DOM
    itemList.appendChild(li);
    return li
}

function addItemToStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //add new item to array
    itemsFromStorage.push(item); 

    //convert to json string and set to local storage
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    }
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }

    return itemsFromStorage;
}

function getCheckedFromStorage() {
    let checkedFromStorage;

    if (localStorage.getItem("checked") === null) {
        checkedFromStorage = [];
    }
    else {
        checkedFromStorage = JSON.parse(localStorage.getItem("checked"));
    }

    return checkedFromStorage;
}

function createButton(classes) {
    const button = document.createElement("button");
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        let item = e.target.parentElement.parentElement;
        removeItemWarn(item);
        return;
    }
    else if (e.target.parentElement.classList.contains("items")) {
        setItemToEdit(e.target);
    }
}

function onDoubleClickItem(e) {
    checkUI();
    if (e.target.parentElement.classList.contains("remove-item")) {
        return;
    }
    else if (e.target.classList.contains("checked-off")){
        e.target.classList.remove("checked-off");
        e.target.classList.remove("edit-mode");
    }
    else {
        removeItem(e.target);
        const newItem = addItem(e.target.textContent);
        newItem.classList.add("checked-off");
    }
    toggleCheckedInStorage(e.target.textContent);
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList
        .querySelectorAll("li")
        .forEach((i)=>i.classList.remove("edit-mode"));

    item.classList.add("edit-mode");
    formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formButton.style.backgroundColor = "#228B22";
    itemInput.value = item.textContent;
}
function removeItem(item) {
    item.remove();
    const itemText = item.firstChild.textContent;
    removeItemFromStorage(itemText);
}

function removeItemWarn(item) {
    if (confirm("Are you sure you want to remove this item?")) {
        removeItem(item);
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.splice(itemsFromStorage.indexOf(item), 1);

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function toggleCheckedInStorage(itemText){
    let checkedFromStorage = getCheckedFromStorage();
    if (checkedFromStorage.includes(itemText)) {
        checkedFromStorage.splice(checkedFromStorage.indexOf(itemText), 1);
        localStorage.setItem('checked',JSON.stringify(checkedFromStorage));
    }
    else {
        checkedFromStorage.push(itemText); 
        //convert to json string and set to local storage
        localStorage.setItem('checked',JSON.stringify(checkedFromStorage));
    }
}

function clearItems(e) {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem("items");
    localStorage.removeItem("checked");
    checkUI();
}

function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll("li");

    items.forEach(item => {
        const itemName = item.firstChild.textContent;
        if (itemName.indexOf(text) != -1) {
            item.style.display = "flex";
        }
        else {
            item.style.display = "none";
        }
    });
}

function checkUI() {
    itemInput.value = "";

    const items = itemList.querySelectorAll("li");
    if (items.length === 0) {
        clearButton.style.display = "none";
        itemsFilter.style.display = "none";
    }
    else {
        clearButton.style.display = "block";
        itemsFilter.style.display = "block";
    }

    formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
    formButton.style.backgroundColor = "#333";
    isEditMode = false;
}

//initializes app
function init() {    
    //event listeners
    itemForm.addEventListener("submit", onAddItemSubmit);
    itemList.addEventListener("click", onClickItem);
    clearButton.addEventListener("click",clearItems);
    itemsFilter.addEventListener("input",filterItems);
    document.addEventListener("DOMContentLoaded",displayItems);
    itemList.addEventListener("dblclick", onDoubleClickItem);

    checkUI();
}

init();