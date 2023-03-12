export default class NotesView {
  constructor(root, {onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete, onNoteView} = {}) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.onNoteView = onNoteView;
    this.root.innerHTML = `
      <section class="--container-free-type --padding-2sm notes__sidebar">
        <div class="--bg-shader-1x --padding-left-sm --border-radius-4sm --overflow-hid --z-index-0 notes__list" id="note__list"></div>
        
        <div class="--navbar-horizontal-type --position-fixed --bottom-0 --left-0 --padding-left-right-2sm --bg-blur-sm --z-index-9">
          <button class="--bg-none --c-yellow-alt --display-flex --border-0 --text-decoration-0 --font-size-4md --font-weight-700 notes__view">
            <span class="fas fa-angle-left"></span>&nbsp;Notes
          </button>
          
          <span class="--font-weight-700 notes__counter"></span>
          <button class="--bg-none --c-yellow-alt --border-0 --text-decoration-0 --font-size-md notes__add">+</button>
        </div>
      </section>
      
      <section class="--container-free-type --c-shader-3x --text-center --display-flex --jf-center --flex-col --position-fixed --top-0 --left-0 --bottom-0 --z-index-1 
        --font-size-3md --font-weight-900 add__note-prompt">
        <div class="--width-fxl --padding-4sm --position-fixed --top-0 --left-0 --bg-yellow-alt notification__banner">
          <span class="notification__msg--holder"></span>
        </div>
        
        <img class="--gallery-image --max-width-f3xl" src="../img/pencil.png" alt="img">
        
        Add Some Notes
      </section>
      
      <section class="--container-free-type --padding-2sm --hidden-right --position-fixed notes__preview">
        <textarea class="--width-fxl --border-0 --font-size-2md --font-weight-800 --bg-none --c-inherit note__title" type="text" placeholder="enter a title"></textarea>
        <textarea class="--width-fxl --border-0 --font-size-3sm --bg-none --c-inherit note__body" rows="8" cols="40" placeholder="take note..."></textarea>
      </section>
    `;
    
    const notificationBanner = this.root.querySelector(".notification__banner");
    const notificationBannerModClasses = ["--height-0", "--overflow-hid"];
    
    const MSG_HOLDER = this.root.querySelector(".notification__msg--holder");
    MSG_HOLDER.innerHTML = `
      <p class="--c-light --font-size-xs">💡 Remember to double click on a note to edit.</p>
    `;
    
    function removeNotificationBanner() {
      notificationBanner.classList.remove("--padding-4sm");
      notificationBanner.classList.add(...notificationBannerModClasses);
    }
    setTimeout(removeNotificationBanner, 5000);
  
    const btnAddNote = this.root.querySelector(".notes__add");
    const btnViewNotes = this.root.querySelector(".notes__view");
    const inpTitle = this.root.querySelector(".note__title");
    const inpBody = this.root.querySelector(".note__body");
    const breakPoint = 20;
    
    
    btnAddNote.addEventListener("click", () => {
      btnAddNote.style.display = "none";
      this.onNoteAdd();
    });
    
    btnViewNotes.style.display = "none";
    
    btnViewNotes.addEventListener("click", () => {
      btnAddNote.style.display = "flex";
      this.onNoteView();
      //if (inpTitle = "") {
        //this.onNoteDelete(noteListItem.dataset.noteId);
        //console.log("no title!");
      //}
    });
    
    [inpTitle, inpBody].forEach(inputField => {
      inputField.addEventListener("blur", () => {
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();
        
        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });
    
    this.updateNotePreviewVisibility(false);
    //console.log(this._createListItemHTML(300, "New", "New Body", new Date()));
  }
  
  _createListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 20;
    
    return `
        <div class="--position-relative --user-select-no --overflow-hid notes__list-item" data-note-id="${id}">
          <div class="--c-shader-3x --font-size-3sm --font-weight-900 notes__small-title">
            ${title.substring(0, MAX_BODY_LENGTH)}
            ${title.length > MAX_BODY_LENGTH ? "..." : ""}
          </div>
          <div class="--c-shader-2x --font-size-4sm notes__small-body">
            ${body.substring(0, MAX_BODY_LENGTH)}
            ${body.length > MAX_BODY_LENGTH ? "..." : ""}
          </div>
          <div class="--c-shader-2x --font-size-4sm notes__small-updated">
            ${updated.toLocaleString(undefined, {dateStyle: "full", timeStyle: "short"})}
          </div>
          <button class="--bg-none --c-yellow-alt --font-size-4sm --border-0 --border-radius-xs
          --display-flex --jf-center --position-absolute options__btn" 
          style="width:40px;top:0;right:0;">•••</button>
        </div>
    `;
  }
  
  updateNotesList(notes) {
    const noteListContainer = this.root.querySelector(".notes__list");
    
    // Clear Notes Container
    noteListContainer.innerHTML = "";
    
    // Method for each note to be rendered in the notes container
    for (const note of notes) {
      const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
      
      noteListContainer.insertAdjacentHTML("beforeend", html);
    }
        
    // Select and Delete event listeners for saved notes
    noteListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
      const noteListItemClasses = ["--padding-top-bottom-xs", "--border-0", "--border-bottom-width-4xs", "--border-solid", "--c-shader-2x"];
      
      noteListItem.addEventListener("dblclick", () => {
        this.onNoteSelect(noteListItem.dataset.noteId);
      });
      
      noteListItem.classList.add(...noteListItemClasses);
      /*
      if (noteListItem) {
        noteListItemClasses.splice(noteListItemClasses.indexOf("--border-bottom-width-4xs"), 1);
      }*/
      
      // Custom Dialog box to be displayed when user clicks on an elipsis button
      const dialogBOX = document.createElement('div');
      const dialogMSG = "Delete Note?";
      const dialogINFO = "You won't be able to recover it once it's deleted!";
        
      dialogBOX.classList.add("--container-free-type", "--height-fxl", "--display-flex", 
        "--jf-center", "--bg-blur-sm", "--position-fixed", "--top-0", "--bottom-0", "--left-0", "--z-index-9");
      
      dialogBOX.innerHTML = `
        <div class="--container-free-type --bg-shader-alt-3x --c-disabled --max-width-f3xl --margin-auto --border-radius-4sm 
          --box-shadow-spread-2x --position-fixed --overflow-hid" style="margin-top:-15%;">
        
          <div class="--width-fxl --text-center --font-size-2sm --font-weight-800 --padding-3sm --dialog-msg">
            ${dialogMSG}
            <br>
            <span class="--font-size-4sm --font-weight-500">${dialogINFO}</span>
          </div>
            
          <div class="--width-fxl --border-top-width-3xs --border-solid --border-0 --c-shader-2x --display-flex --jf-space-bw message">
            <button class="--width-fxl --bg-none --font-size-3sm --padding-4sm --border-0 --border-right-width-3xs --border-solid --c-shader-2x Y-BTN">Yes</button>
            <button class="--width-fxl --bg-none --font-size-3sm --padding-4sm --border-0 N-BTN">No</button>
          </div>
        </div>
      `;
      
      const dialogY = dialogBOX.querySelector(".Y-BTN").addEventListener("click", () => {
        this.onNoteDelete(noteListItem.dataset.noteId);
        ROOT.removeChild(dialogBOX);
      });
        
      const dialogN = dialogBOX.querySelector(".N-BTN").addEventListener("click", () => {
        ROOT.removeChild(dialogBOX);
      });
      
      const ROOT = document.getElementById("app");

      const elipsisBtn = noteListItem.querySelectorAll(".options__btn").forEach(btn => {
        btn.addEventListener("click", () => {
          ROOT.appendChild(dialogBOX);
        });
      });
    });

    // Notes counter and "Add a new note" prompt
    const notesCounter = document.querySelector(".notes__counter");
    const addNotePrompt = document.querySelector(".add__note-prompt");
    
    if (notes.length < 1) {
      notesCounter.innerText = notes.length + " " + "Notes";
      addNotePrompt.classList.remove("--display-0");
      addNotePrompt.classList.add("--display-flex");
    } else if (notes.length === 1) {
      notesCounter.innerText = notes.length + " " + "Note";
      addNotePrompt.classList.add("--display-0");
      addNotePrompt.classList.remove("--display-flex");
    } else if (notes.length > 1) {
      notesCounter.innerText = notes.length + " " + "Notes";
      addNotePrompt.classList.add("--display-0");
      addNotePrompt.classList.remove("--display-flex");
    }
  }
  
  updateActiveNote(note) {
    this.root.querySelector(".note__title").value = note.title;
    this.root.querySelector(".note__body").value = note.body;
    
    this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
      noteListItem.classList.remove("notes__list-item--selected");
    });
    
    this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
  }
  
  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
  }
}