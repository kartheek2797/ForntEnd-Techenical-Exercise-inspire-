let booksData = [];
function deleteBook(title) {
    const bookIndex = booksData.data.books.findIndex(book => book.title === title);
    if (bookIndex !== -1) {
        booksData.data.books.splice(bookIndex, 1);
        displayBookList(booksData);
    }
}

function displayBookList(books) {
    const bookListElement = document.getElementById('book-list');
    while (bookListElement.firstChild) {
        bookListElement.removeChild(bookListElement.firstChild);
    }
    const sortSelectElement = document.getElementById('sort-select');
    const sortedBooks = sortBooks(books.data.books, sortSelectElement.value);
    sortedBooks.forEach(book => {
        const bookElement = createBookElement(book);
        bookListElement.appendChild(bookElement);
    });
}

function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');

    const imgElement = document.createElement('img');
    imgElement.src = book.imageUrl;
    imgElement.alt = book.title;

    const titleElement = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.href = book.purchaseLink;
    titleLink.target = '_blank';
    titleLink.classList.add('bookLink')
    titleLink.textContent = book.title;
    titleElement.appendChild(titleLink);

    const publishDateElement = document.createElement('p');
    publishDateElement.textContent = `Publish Date: ${book.PublishDate}`;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('btn-primary','btn')
    editButton.addEventListener('click', () => editBook(book.title));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn-danger','btn')
    deleteButton.addEventListener('click', () => deleteBook(book.title));

    bookElement.appendChild(imgElement);
    bookElement.appendChild(titleElement);
    bookElement.appendChild(publishDateElement);
    bookElement.appendChild(editButton);
    bookElement.appendChild(deleteButton);

    return bookElement;
}
function toggleFields(){
    var checkbox = document.getElementById('toggleCheckbox');
    var textField = document.getElementById('textField');
    var fileField = document.getElementById('fileField');

    if(checkbox.checked){
        textField.style.display = 'none';
        fileField.style.display = 'block';
    }
    else{
        textField.style.display = 'block';
        fileField.style.display = 'none';
    }
}
function sortBooks(books, sortBy) {
    return books.slice().sort((a, b) => {
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        } else if (sortBy === 'publishDate') {
            return new Date(a.publishDate) - new Date(b.publishDate);
        }
    });
}
function editBook(title) {
    toggleFields()
    const bookToEdit = booksData.data.books.find(book => book.title === title);
    if (bookToEdit) {
        document.getElementById('newTitle').value = bookToEdit.title;
        document.getElementById('textImageField').value = bookToEdit.imageUrl;
        document.getElementById('newPurchaseUrl').value = bookToEdit.purchaseLink;
        document.getElementById('newPublishDate').value = bookToEdit.PublishDate;
        document.getElementById('oldTitle').value = title;
        const editModal = document.getElementById('editModal');
        editModal.style.display = 'block';
    }
}

function addtoggleFields(){
    var checkbox = document.getElementById('addtoggleCheckbox');
    var addtextField = document.getElementById('addtextField');
    var addfileField = document.getElementById('addfileField');

    if(checkbox.checked){
        addtextField.style.display = 'none';
        addfileField.style.display = 'block';
    }
    else{
        addtextField.style.display = 'block';
        addfileField.style.display = 'none';
    }
}

function closeEditModal() {
    const editModal = document.getElementById('editModal');
    editModal.style.display = 'none';
}
function saveEdit() {
    const newTitle = document.getElementById('newTitle').value;
    const newPurchaseUrl = document.getElementById('newPurchaseUrl').value;
    const newPublishDate = document.getElementById('newPublishDate').value;
    const oldTitle = document.getElementById('oldTitle').value;
    let newImage;

    const checkedStatus = document.getElementById('toggleCheckbox').checked;

    function handleFileRead(event) {
        newImage = event.target.result;
        const bookToEdit = booksData.data.books.find(book => book.title === oldTitle);
        if (bookToEdit) {
            bookToEdit.title = newTitle;
            bookToEdit.imageUrl = newImage;
            bookToEdit.purchaseLink = newPurchaseUrl;
            bookToEdit.PublishDate = newPublishDate;
        }

        displayBookList(booksData);
        closeEditModal();
    }

    if (!checkedStatus) {
        newImage = document.getElementById('textImageField').value;
        handleFileRead({ target: { result: newImage } });
    } else {
        const fileImageField = document.getElementById('fileImageField');
        if (fileImageField.files.length > 0) {
            const reader = new FileReader();
            reader.onload = handleFileRead;
            reader.readAsDataURL(fileImageField.files[0]);
        }
    }
}


function openAddModal() {
    addtoggleFields()
    const addModal = document.getElementById('addModal');
    addModal.style.display = 'block';
}
function closeAddModal() {
    const addModal = document.getElementById('addModal');
    addModal.style.display = 'none';
}
function addBook() {
    const newTitle = document.getElementById('addTitle').value;
    const newPurchaseUrl = document.getElementById('addnewPurchaseUrl').value;
    const newPublishDate = document.getElementById('addnewPublishDate').value;
    let newImage;
    const checkedStatus = document.getElementById('addtoggleCheckbox').checked;
    function handleFileRead(event) {
        newImage = event.target.result;
        const newBook = {
            title: newTitle,
            imageUrl: newImage,
            purchaseLink: newPurchaseUrl,
            PublishDate: newPublishDate
        };
        booksData.data.books.push(newBook);
        displayBookList(booksData);
        closeAddModal();
        document.getElementById('addTitle').value = '';
        document.getElementById('addtextImageField').value = '';
        document.getElementById('addfileImageField').filename = '';
        document.getElementById('addnewPurchaseUrl').value = '';
        document.getElementById('addnewPublishDate').value = '';
    }

    if (!checkedStatus) {
        newImage = document.getElementById('addtextImageField').value;
        handleFileRead({ target: { result: newImage } }); 
    } else {
        const fileImageField = document.getElementById('addfileImageField');
        if (fileImageField.files.length > 0) {
            const reader = new FileReader();
            reader.onload = handleFileRead;
            reader.readAsDataURL(fileImageField.files[0]);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const authorNameElement = document.getElementById('author-name');
    const authorBirthdayElement = document.getElementById('author-birthday');
    const authorBirthplaceElement = document.getElementById('author-birthplace');
    fetch('https://s3.amazonaws.com/api-fun/books.json')
        .then(response => response.json())
        .then(data => {
            booksData = data;
            displayAuthorInfo(data.data);
            displayBookList(booksData);
        })
        .catch(error => console.error('Error fetching data:', error));
    function displayAuthorInfo(author) {
        authorNameElement.textContent = `Author: ${author.author}`;
        authorBirthdayElement.textContent = `Birthday: ${author.birthday}`;
        authorBirthplaceElement.textContent = `Birthplace: ${author.birthPlace}`;
    }
});