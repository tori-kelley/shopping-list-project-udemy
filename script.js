const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearButton = document.getElementById("clear");
const itemsFilter = document.getElementById("filter");
const formButton = itemForm.querySelector("button");
let isEditMode = false;


function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
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

    //create item DOM element
    addItemToDOM(newItem);

    //add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = "";
} 

function addItemToDOM(item) {
    //create list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    // add li to the DOM
    itemList.appendChild(li);
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
        removeItem(item);
        return;
    }
    else {
        setItemToEdit(e.target);
    }
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
    if (confirm("Are you sure you want to remove this item?")) {
        item.remove();
        const itemText = item.firstChild.textContent;
        removeItemFromStorage(itemText);
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.splice(itemsFromStorage.indexOf(item), 1);

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem("items");
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

    checkUI();
}

init();