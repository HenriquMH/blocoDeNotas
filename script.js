const addNote = document.querySelector('#add-note');//Botão de para adicionar nota
const closeModal =  document.querySelector('#close-modal'); //fechar janela modal com os detalhes da nota.
const modal = document.querySelector('#modal'); //Modal para edição das notas
const modalView = document.querySelector('#modal-view'); //Modal para exibição dos detalhes da nota
const notes = document.querySelector('#notes');//Lista divs com dados das notas
const btnSaveNote = document.querySelector("#btn-save-note"); //icone para salvar nota
const btnCloseNote = document.querySelector("#btn-close-note");//icone para fechar modal de edição de nota.
const btnDelete = document.querySelector("#deletar-nota");
const btnEdit = document.querySelector('#editar-nota');

// ------------------------------------------------------------------
// ---------------------------EVENTOS--------------------------------
// ------------------------------------------------------------------

addNote.addEventListener("click", (evt) => {
    evt.preventDefault();
    console.log("Botão abrindo!");
    notes.style.display='none';
    modal.style.display='block';
    addNote.style.display='none';
});

btnCloseNote.addEventListener("click", (evt) => {
    evt.preventDefault();
    console.log("Botão fechando!");
    notes.style.display="flex";
    modal.style.display="none";
    addNote.style.display='block';
    document.querySelector('.texto-aviso').style.display = 'none';

    document.querySelector('#input-id').value = "";
    document.querySelector('#input-title').value = "";
    document.querySelector('#input-content').value = "";
    console.log("fechou");
    loadNotes();
    listNotes();
});

btnSaveNote.addEventListener("click", (evt) => {
    evt.preventDefault();
    let data = {
        id: document.querySelector("#input-id").value,
        title:document.querySelector("#input-title").value,
        content:document.querySelector("#input-content").value,
    };
    saveNote(data);
});

// ------------------------------------------------------------------
// ---------------------------FUNÇÕES--------------------------------
// ------------------------------------------------------------------

const saveNote = (note) => {
    let notes = loadNotes();
    note.lastTime = new Date().getTime();
    // console.log(note.lastTime);
    if(note.id.length > 0){
        note.id = parseInt(note.id);
        notes.forEach((item, i) => {
            if(item.id == note.id){
                notes[i] = note;
            }
        })
    }else{
        note.id = new Date().getTime();
        document.querySelector('#input-id').value = note.id;
        notes.push(note);
    }
    // console.log(notes);
    notes = JSON.stringify(notes);
    // console.log(notes);
    localStorage.setItem('notes', notes);
};

const deleteNote = (note) => {
    let notes = loadNotes();
    note.id = parseInt(note.id);
    notes.forEach((item, i) => {
        if(item.id == note.id){
            notes.splice(i, 1);
        }
    })
    notes = JSON.stringify(notes);
    localStorage.setItem('notes', notes);
    listNotes();
}

const loadNotes = () => {
    let notes = localStorage.getItem('notes');
    if(notes === null || (notes && JSON.parse(notes).length === 0)){
        notes = [];
        console.log("NAO tem NOta");
        document.querySelector('.mensagem').innerText = 'tomo sem notas no memomento senho 🫡';
        document.querySelector('.mensagem').style.display = 'block';
        } else {
        notes = JSON.parse(notes);
        document.querySelector('.mensagem').innerText = '';
    }
    return notes;
};

const listNotes = () => {
    let listNotes = localStorage.getItem('notes');
    listNotes = JSON.parse(listNotes);
    notes.innerHTML = "";
    listNotes.forEach((item) => {
        const divCard = document.createElement('div');
        divCard.className = 'card item-cartao';
        const divCardBody = document.createElement('div');
        divCardBody.className = 'card-body cartaozin';
        const h1 = document.createElement('h1');
        h1.className = 'card-title text-l';
        h1.innerText = item.title;
        const pContent = document.createElement('p');
        pContent.className = 'card-text text-l';
        pContent.innerText = item.content;
        //console.log(item);
        const pLastTime = document.createElement('p');
        let lastTime = new Date(item.lastTime).toLocaleDateString('pt-BR');
        pLastTime.innerText = `Last uptade: ${lastTime}`;
        pLastTime.className = 'text-l';


        divCardBody.appendChild(h1);
        divCardBody.appendChild(pContent);
        divCardBody.appendChild(pLastTime);
        divCard.appendChild(divCardBody);
        notes.appendChild(divCard);

        divCard.addEventListener("click", (evt) => {
            evt.preventDefault();
            showNote(item);
        });

        closeModal.addEventListener("click", (evt) => {
            evt.preventDefault();
            notes.style.display = 'flex';
            modalView.style.display = 'none';
            addNote.style.display = 'block';
            document.querySelector('.texto-aviso').style.display = 'none';
            loadNotes();
        });
    });
};

let currentNote = null;
let deleteListenerAdded = false; // Pra checar se o eventlistener foi adicionado ou não

// Define a função de alert pra deletar a nota
const deleteNoteConfirm = (evt) => {
    evt.preventDefault();
    if (currentNote && confirm("Are you sure you want to delete this note?")) {
        deleteNote(currentNote);
        console.log("Você confirmou!");
        notes.style.display = 'flex';
        modalView.style.display = 'none';
        addNote.style.display = 'block';
        loadNotes();
        listNotes();
    } else {
        console.log("Você cancelou!");
    }
};

const showNote = (note) => {
    notes.style.display = 'none';
    modalView.style.display = 'block';
    addNote.style.display = 'none';
    currentNote = note;

    document.querySelector('#title-note').innerHTML = "<h1>"+note.title+"</h1>";
    document.querySelector('#content-note').innerHTML = "<p>"+note.content+"</p>";
    document.querySelector('#content-note').innerHTML += "<p>Last update: "+new Date(note.lastTime).toLocaleDateString('pt-BR')+"</p>";

    btnEdit.addEventListener("click", (evt) => {
        evt.preventDefault();

        notes.style.display='none';
        modal.style.display='block';
        modalView.style.display = 'none';

        document.querySelector('#input-id').value = note.id;
        document.querySelector('#input-title').value = note.title;
        document.querySelector('#input-content').value = note.content;
    });

    // Se tiver um event listener, ele vai ser deletado e daí depois adicionado de novo
    if (deleteListenerAdded) {
        btnDelete.removeEventListener("click", deleteNoteConfirm);
    }

    // Aqui o eventlistener é adicionado
    btnDelete.addEventListener("click", deleteNoteConfirm);
    deleteListenerAdded = true; // Depois que adicionou o eventlistener, seta a checagem pra verdadeiro
};

loadNotes();
listNotes();