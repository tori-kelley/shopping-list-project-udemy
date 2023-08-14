const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearButton = document.getElementById("clear");
const itemsFilter = document.getElementById("filter");


function addItem(e) {
    e.preventDefault();

    const newItem = itemInput.value.toLowerCase();

    //Validate input
    if (newItem === "") {
        alert("Please add an item.");
        return;
    }

    //create list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(newItem));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    // add li to the DOM
    itemList.appendChild(li);
    checkUI();

    itemInput.value = "";
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

function removeItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        if (confirm("Are you sure you want to remove this item?")) {
            e.target.parentElement.parentElement.remove();
        }
    }
}

function clearItems(e) {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
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
    const items = itemList.querySelectorAll("li");
    if (items.length === 0) {
        clearButton.style.display = "none";
        itemsFilter.style.display = "none";
    }
    else {
        clearButton.style.display = "block";
        itemsFilter.style.display = "block";
    }
}

//event listeners
itemForm.addEventListener("submit", addItem);
itemList.addEventListener("click", removeItem);
clearButton.addEventListener("click",clearItems);
itemsFilter.addEventListener("input",filterItems);

checkUI();