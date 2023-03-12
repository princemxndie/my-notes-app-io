import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this._handlers());
    
    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();
    
    this._setNotes(notes);
    
    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
    }
  }
  
  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNotesList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }
  
  _setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }

  _handlers() {
    return {
      onNoteSelect: noteId => {
        const selectedNote = this.notes.find(note => note.id == noteId);
        this._setActiveNote(selectedNote);
        
        const notePreview = document.querySelector(".notes__preview");
        const btnViewNoteList = document.querySelector(".notes__view");
        
        notePreview.classList.remove("--hidden-right");
        notePreview.classList.add("--slide-in-from-right", "--bg-dark-alt");
        btnViewNoteList.style.display = "flex";
        
        btnViewNoteList.addEventListener("click", [onBlankNote, onNoteView]);
      },
      
      onNoteAdd: () => {
        
        const newNote = {
          title: "",
          body: ""
        }
        
        const notePreview = document.querySelector(".notes__preview");
        const btnViewNoteList = document.querySelector(".notes__view");
        
        notePreview.classList.remove("--hidden-right");
        notePreview.classList.add("--slide-in-from-right", "--bg-dark-alt");
        btnViewNoteList.style.display = "flex";
        
        NotesAPI.saveNote(newNote);
        this._refreshNotes();
      },
      
      onNoteEdit: (title, body) => {
        NotesAPI.saveNote({
          id: this.activeNote.id,
          title,
          body
        });
        
        this._refreshNotes();
      },
      
      onNoteDelete: noteId => {
        NotesAPI.deleteNote(noteId);
        this._refreshNotes();
      },
      /*
      onBlankNote: noteId => {
        NotesAPI.deleteNote(noteId);
        this._refreshNotes();
      },
      */
      onNoteView(event) {
        const notePreview = document.querySelector(".notes__preview");
        const btnViewNoteList = document.querySelector(".notes__view");
        //const inpTitle = document.querySelector(".note__title");
        notePreview.classList.add("--hidden-right");
        notePreview.classList.remove("--slide-in-from-right", "--bg-light-alt");
        btnViewNoteList.style.display = "none";
      }
    }
  }
}