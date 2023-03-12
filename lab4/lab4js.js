const titleInput = document.getElementById("title-input");
const contentInput = document.getElementById("note-input");
const submitButton = document.getElementById("submit-button");
const colorSelect = document.getElementById("color-select");
const noteList = document.getElementById("note-list");

submitButton.addEventListener("click", function(e) {
  e.preventDefault();
  addNote(titleInput.value, contentInput.value, colorSelect.value);
  titleInput.value = "";
  contentInput.value = "";
});

fetchNotes();

function addNote(title, content, color) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  let dateHelper = new Date().toLocaleString('pl-PL');
  noteId = Date.now(); 
  notes.push({noteId:noteId, noteTitle:title, noteContent:content, noteColor:color, createdAt:dateHelper, isPinned:false});
  localStorage.setItem("notes", JSON.stringify(notes));
  let isPinned = false;
  createCard(noteId, title, content, color, dateHelper, isPinned)
}

function fetchNotes() {
  noteList.innerHTML = "";
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.sort((a, b) => b.isPinned - a.isPinned)
  notes.forEach(note => {
      createCard(note.noteId, note.noteTitle, note.noteContent, note.noteColor, note.createdAt, note.isPinned);
  })
}

function createCard(noteId, title, content, color, createdAt, isPinned) {
  // tworzenie notatki
  const newNote = document.createElement("div");
  newNote.classList.add("card", "text-white", "bg-secondary");
  newNote.setAttribute("data-note-id", noteId);
  newNote.style.marginBottom = "1rem";

  // tworzenie tła
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  cardBody.style.backgroundColor = color;
  newNote.appendChild(cardBody);

  // tworzenie pina
  const pinButton = document.createElement("button")
  pinButton.classList.add("pin-button")
  if(isPinned){
    pinButton.style.background='#000000';
    pinButton.style.color='#FFFFFF';
    pinButton.innerText = "Odepnij";
  }
  else
  pinButton.innerText = "Przypnij";
  cardBody.appendChild(pinButton)

  // tworzenie tytułu
  const titleElement = document.createElement("h5");
  titleElement.classList.add("card-title");
  titleElement.contentEditable = "false"
  titleElement.innerText = title;
  cardBody.appendChild(titleElement);

  // create content
  const noteElement = document.createElement("p");
  noteElement.classList.add("card-text");
  noteElement.innerText = content;
  cardBody.appendChild(noteElement);
  
  // create date
  const dateElement = document.createElement("p");
  dateElement.classList.add("card-text-date");
  dateElement.innerText = createdAt;
  cardBody.appendChild(dateElement);

  // edytowanie
  const editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.classList.add("btn", "edit-button");
  newNote.appendChild(editButton);

  editButton.addEventListener('click', function(){
    this.style.display = 'none';
    saveButton.style.display = 'block';
    let noteCard = this.closest('.card');
    noteCard.querySelector('.card-title').setAttribute('contenteditable', true);
    noteCard.querySelector('.card-text').setAttribute('contenteditable', true);
  });

  // zapisywanie
  const saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.classList.add("btn", "btn-primary", "save-button");
  saveButton.style.display = "none";
  newNote.appendChild(saveButton);

  saveButton.addEventListener("click", function() {
    this.style.display = 'none';
    let noteCard = this.closest('.card');
    noteCard.querySelector('.edit-button').style.display = 'block';
    noteCard.querySelector('.card-title').setAttribute('contenteditable', false);
    noteCard.querySelector('.card-text').setAttribute('contenteditable', false);
    let newTitle = noteCard.querySelector('.card-title').textContent;
    let newContent = noteCard.querySelector('.card-text').textContent;
    let noteId = this.parentNode.getAttribute("data-note-id");
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let noteIndex = notes.findIndex(note => note.noteId == noteId);            
    notes[noteIndex] = {noteId:noteId, noteTitle:newTitle, noteContent:newContent, noteColor:color, createdAt:createdAt, isPinned:isPinned};
    localStorage.setItem("notes", JSON.stringify(notes));
  });

  // usuwanie
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.addEventListener("click", function() {
      newNote.remove();
      let notes = JSON.parse(localStorage.getItem("notes")) || [];
      let noteIndex = notes.findIndex(note => note.noteId == noteId);
      notes.splice(noteIndex, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
  });
  newNote.appendChild(deleteButton);

  pinButton.addEventListener("click", function() {
    let noteCard = this.closest('.card');
    let Title = noteCard.querySelector('.card-title').innerHTML;
    let Content = noteCard.querySelector('.card-text').innerHTML;
    let noteId = this.parentNode.parentNode.getAttribute("data-note-id");
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let noteIndex = notes.findIndex(note => note.noteId == noteId);
    if(notes[noteIndex].isPinned == true){
      isPinned = false
    }
    else {
      isPinned = true
    }
    notes[noteIndex] = {noteId:noteId, noteTitle:Title, noteContent:Content, noteColor:color, createdAt:createdAt, isPinned:isPinned};
    localStorage.setItem("notes", JSON.stringify(notes));
    fetchNotes();
  });

  noteList.appendChild(newNote);
}
