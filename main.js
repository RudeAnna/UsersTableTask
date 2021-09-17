
const table = document.getElementById('table');
const modalAddBtn = document.querySelector('#add-button');
const modalBg = document.querySelector('.modal_bg');
const modalClose = document.querySelector('.modal-close');


const inputId = document.querySelector(".input-id");
const inputName = document.querySelector('#input-full-name');
const inputEmail = document.querySelector('#input-email');
const inputCity = document.querySelector('#input-city');
const inputStreet = document.querySelector('#input-street');
const inputSuite = document.querySelector('#input-suite');
const inputCompanyName = document.querySelector('#input-company-name');
const inputZipcode = document.querySelector('#input-zipcode');

const modalSave = document.getElementById('save-button');
const modalEditSave = document.getElementById('save-edit-button');

let mainUsers = [];

fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
        return response.json();
    })
    .then(data => {
        mainUsers = data;
        for(let user of mainUsers) {
            addRow(user);
        }
    })
    .catch(error => {
        console.log(error); 
});

function renderTable() {
    table.innerHTML = '';
    for(let user of mainUsers) {
        addRow(user);
    }
    
} 

function addRow(user){
    
    function addUserId() { return mainUsers.indexOf(user) + 1; };
    let userId = addUserId();

    let row = `
    <tr id="user${userId}">
        <td class="user${userId}-id">${userId}</td>
        <td class="user${userId}-name">${user.name}</td>
        <td class="user${userId}-email">${user.email}</td>
        <td class="user${userId}-address">${user.address.city}, ${user.address.street}, ${user.address.suite} </td>
        <td class="user${userId}-company">${user.company.name}</td>
        <td class="user${userId}-zipcode">${user.address.zipcode}</td>
        <td><button type="button" id="edit-button${userId}" class="btn btn-outline-dark button-edit">Edit</button> <button type="button" id="remove-button${userId}" class="btn btn-outline-secondary">Remove</button></td>
    </tr>`
    
    table.insertAdjacentHTML('beforeend', row);

    const editBtn = document.getElementById(`edit-button${userId}`);
    const removeBtn = document.getElementById(`remove-button${userId}`);

    editBtn.addEventListener('click', function(e){

        e.stopPropagation();
        modalBg.classList.add('active');
        modalEditSave.classList.remove('display');
        modalSave.classList.add('display');
    
        //console.log(`edit button id`, editBtn.id);
        inputId.value = userId;
        inputName.value = user.name;
        inputEmail.value = user.email;
        inputCity.value = user.address.city;
        inputSuite.value = user.address.suite;
        inputStreet.value = user.address.street;
        inputZipcode.value = user.address.zipcode;
        inputCompanyName.value = user.company.name; 
        console.log(mainUsers)
    })

    removeBtn.addEventListener('click', function(e){  
        e.stopPropagation()     
        mainUsers.splice(userId - 1, 1);
        renderTable();
    })   
    
    const userRow = document.getElementById(`user${userId}`);

    userRow.addEventListener('click', function(){ 
        console.log(userRow);
        modalBg.classList.add('active');
    })

}    


//<td>${user.id}</td>


//BUTTONS EVENTS

modalAddBtn.addEventListener('click', function(){
    clearValue();
    modalBg.classList.add('active');
    modalEditSave.classList.add('display');
    modalSave.classList.remove('display');
    
})

modalClose.addEventListener('click', function(){
    modalBg.classList.remove('active');
    clearValue();
})

modalSave.addEventListener('click', function() {
    
    let newUser = {}; 
    newUser.id = mainUsers.length + 1;
    newUser.name = inputName.value;
    newUser.email = inputEmail.value;
    newUser.address = {
        city: inputCity.value,
        suite: inputSuite.value,
        street: inputStreet.value,
        zipcode: inputZipcode.value
    }
    newUser.company = {
        name: inputCompanyName.value
    }

    mainUsers.push(newUser);
    modalBg.classList.remove('active');
    
    renderTable();
    clearValue();
})


function clearValue() {
    inputName.value = "";
    inputEmail.value = "";
    inputCity.value = "";
    inputSuite.value = "";
    inputStreet.value = "";
    inputZipcode.value = "";
    inputCompanyName.value = "";
};


let editableUser;
modalEditSave.addEventListener('click', function(){
    
    editableUser = mainUsers.find(item => item.id == inputId.value);
    console.log(editableUser) 
    editableUser.id = inputId.value;
    editableUser.name = inputName.value;
    editableUser.email = inputEmail.value;
    editableUser.address = {
        city: inputCity.value,
        suite: inputSuite.value,
        street: inputStreet.value,
        zipcode: inputZipcode.value
    }
    editableUser.company = {
        name: inputCompanyName.value
    }

    let editedUsers = [];

    for (let user of mainUsers) {
        if (user.id == editableUser.id) {
            editedUsers.push(editableUser)
        } else {
            editedUsers.push(user)
        }
    }
    
    mainUsers = editedUsers;

    modalBg.classList.remove('active');
    renderTable();      
})




//SORTING
let sortDirection = false;
function sortColumn(columnName) {
    const dataType = typeof mainUsers[0][columnName];
    sortDirection = !sortDirection;

    if (columnName === 'address') {
        mainUsers = mainUsers.sort((p1, p2) => {
            return sortDirection 
            ? p1.address.city.localeCompare(p2.address.city) 
            : p2.address.city.localeCompare(p1.address.city);
        });
    }

    if (columnName === 'company') {
        mainUsers = mainUsers.sort((p1, p2) => {
            return sortDirection 
            ? p1.company.name.localeCompare(p2.company.name) 
            : p2.company.name.localeCompare(p1.company.name);
        });
    }

    if (columnName === 'zipcode') {
        mainUsers = mainUsers.sort((p1, p2) => {
            return sortDirection 
            ? p1.address.zipcode.localeCompare(p2.address.zipcode) 
            : p2.address.zipcode.localeCompare(p1.address.zipcode);
        });
    }

    switch(dataType) {
        case 'number':
            sortNumberColumn(sortDirection, columnName);
        break
        case 'string':
            sortStringColumn(sortDirection, columnName);
        break    
    }
    renderTable();
}

function sortNumberColumn(sort, columnName) {
    mainUsers = mainUsers.sort((p1, p2) => {
        return sort 
        ? p1[columnName] - p2[columnName] 
        : p2[columnName] - p1[columnName];
    });
}
function sortStringColumn(sort, columnName) {
    mainUsers = mainUsers.sort((p1, p2) => {
        return sort 
        ? p1[columnName].localeCompare(p2[columnName]) 
        : p2[columnName].localeCompare(p1[columnName]);
    });
}

