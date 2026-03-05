const theme = localStorage.getItem('themedarkwhite');

if (theme === "white") {
    document.body.style.backgroundColor = '#ffffff';
} else if (theme === "dark") {
    document.body.style.backgroundColor = '#1e1e1e';
} else {
    document.body.style.backgroundColor = '#ffffff'; 
}
let noteCount = localStorage.getItem('noteCount') ? parseInt(localStorage.getItem('noteCount')) : 0; // Лічильник для унікальних ID нотаток

function create() {
    noteCount++; // Збільшуємо лічильник для нового ID
    localStorage.setItem('noteCount', noteCount); // Зберігаємо лічильник у localStorage
    const noteId = `note${noteCount}`; // Генеруємо унікальний ID для нотатки

    const note = document.createElement('div');
    note.className = 'draggable';
    note.setAttribute('data-id', noteId); // Додаємо атрибут data-id для нотатки
    
    // Встановлюємо початкову позицію
    note.style.left = '100px'; 
    note.style.top = '100px'; 

    // Створюємо кнопку закриття
    const closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;'; // Хрестик (символ)
    note.appendChild(closeButton); // Додаємо кнопку закриття до нотатки

    // Створюємо textarea елемент
    const textarea = document.createElement('textarea'); 
    textarea.placeholder = 'Введіть текст...'; 
    note.appendChild(textarea); // Додаємо textarea до нотатки

    document.body.appendChild(note);

    // Додаємо функціонал перетягування
    addDragAndDrop(note);

    // Додаємо обробник подій для кнопки закриття
    closeButton.addEventListener('click', () => {
        removeNoteData(noteId); // Видаляємо дані з localStorage
        document.body.removeChild(note); // Видаляємо нотатку при натисканні на кнопку закриття
    });

    // Зберігаємо дані кожну секунду
    setInterval(() => {
        const noteData = {
            id: noteId,
            content: textarea.value,
            position: {
                left: note.style.left,
                top: note.style.top
            }
        };
        saveNoteData(noteData);
    }, 1000);
}

// Функція для збереження даних у localStorage
function saveNoteData(noteData) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    
    // Знайти індекс нотатки за ID
    const existingNoteIndex = notes.findIndex(note => note.id === noteData.id);
    
    if (existingNoteIndex > -1) {
        notes[existingNoteIndex] = noteData; // Оновлюємо існуючу нотатку
    } else {
        notes.push(noteData); // Додаємо нову нотатку
    }
    
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Функція для видалення нотатки з localStorage
function removeNoteData(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== noteId); // Фільтруємо нотатки, видаляючи ту, що має даний ID
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Функція для відновлення нотаток при завантаженні
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(noteData => {
        const note = createNoteElement(noteData);
        document.body.appendChild(note);
    });
}

// Функція для створення елемента нотатки
function createNoteElement(noteData) {
    const note = document.createElement('div');
    note.className = 'draggable';
    note.setAttribute('data-id', noteData.id); // Додаємо атрибут data-id для нотатки
    note.style.left = noteData.position.left;
    note.style.top = noteData.position.top;

    const closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    note.appendChild(closeButton);

    const textarea = document.createElement('textarea');
    textarea.value = noteData.content;
    note.appendChild(textarea);

    // Додаємо обробник подій для кнопки закриття
    closeButton.addEventListener('click', () => {
        removeNoteData(noteData.id); // Видаляємо дані з localStorage
        document.body.removeChild(note);
    });

    // Додаємо функціонал перетягування
    addDragAndDrop(note);

    return note;
}

// Функція для додавання функціоналу перетягування
function addDragAndDrop(note) {
    let offsetX, offsetY, isDragging = false;

    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - note.getBoundingClientRect().left;
        offsetY = e.clientY - note.getBoundingClientRect().top;
        note.style.cursor = 'grabbing';
        note.style.zIndex = 999; // Піднімаємо нотатку на передній план
        // Знижуємо z-index для всіх інших нотаток
        document.querySelectorAll('.draggable').forEach(otherNote => {
            if (otherNote !== note) {
                otherNote.style.zIndex = 99;
            }
        });
    }

    function drag(e) {
        if (isDragging) {
            note.style.left = (e.clientX - offsetX) + 'px';
            note.style.top = (e.clientY - offsetY) + 'px';
        }
    }

    function endDrag() {
        isDragging = false;
        note.style.cursor = 'grab';
    }

    note.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Додатково для мобільних пристроїв
    note.addEventListener('touchstart', (e) => {
        startDrag(e.touches[0]);
    });
    document.addEventListener('touchmove', (e) => {
        drag(e.touches[0]);
    });
    document.addEventListener('touchend', endDrag);
}
// Викликаємо функцію для завантаження нотаток при завантаженні сторінки
window.onload = loadNotes;

function settings() {
    // creating div element
    const settings = document.createElement("div");
    settings.id = "settingsUI";
    settings.style.position = "fixed";
    settings.style.bottom = "-200px";
    settings.style.right = "30px";
    settings.style.height = "160px";
    settings.style.width = "300px";
    settings.style.zIndex = "99999";
    settings.style.borderRadius = "10px 10px 0px 0px";
    settings.style.transition = "0.5s";
    setTimeout(() => {
        settings.style.bottom = "0px";
    });

    // closing div element
    document.body.appendChild(settings); 
    const ok = document.createElement("p")
    ok.id = "okset";
    ok.innerHTML = "Done";
    ok.onclick = function() {
        settings.style.bottom = "-200px";
        setTimeout(() => {
            settings.remove();
        }, 500)
    };
    settings.appendChild(ok);
    const mode = document.createElement("div");
    mode.id = "modediv";
    mode.width = "15px";
    settings.appendChild(mode)
    const modeimg = document.createElement("img");
    modeimg.src = "../static/img/sun.png";
    modeimg.id = "modeimg";
    mode.appendChild(modeimg);
    const modet = document.createElement("div")
    modet.id = "modet";
    mode.appendChild(modet);
    const modep = document.createElement("p")
    modep.id = "modep";
    modep.innerHTML = "Light / Night";
    mode.appendChild(modep);
    const modeC = document.createElement("div")
    modeC.id = "modeC";
    modeC.onclick = function() {
        if (modeCt.id === "modeCt") {
            modeCt.id = "modeCt2";
        } else if (modeCt.id === "modeCt2") {
            modeCt.id = "modeCt";
        }

        // Зміна кольору фону
        if (modeCt.id === "modeCt") {
            modeimg.src = "../static/img/sun.png"; 
            settings.style.backgroundColor = "#f3f3f3";
            mode.style.backgroundColor = "rgb(220, 220, 220)";
            modet.style.backgroundColor = "rgb(228, 228, 228)";
            modep.style.color = "black"; // Використовуйте === для порівняння
            document.body.style.backgroundColor = "#FFFFFF"; // Білий фон
            localStorage.setItem('themedarkwhite', 'white'); // Записуємо значення 'white' у localStorage
        } else if (modeCt.id === "modeCt2") {
            modeimg.src = "../static/img/moon.png";
            settings.style.backgroundColor = "#303030";
            mode.style.backgroundColor = "#383838";
            modet.style.backgroundColor = "#333333";
            modep.style.color = "white"; // Використовуйте === для порівняння
            document.body.style.backgroundColor = "#1e1e1e"; // Темний фон
            localStorage.setItem('themedarkwhite', 'dark'); // Записуємо значення 'dark' у localStorage
        }
    };
    mode.appendChild(modeC);
    const modeCt = document.createElement("button")
    modeCt.id = "modeCt";
    modeCt.style.transition = "0.5s";
    modeCt.onclick = function() {
        if (modeCt.id === "modeCt") {
            modeCt.id = "modeCt2";
        } else if (modeCt.id === "modeCt2") {
            modeCt.id = "modeCt";
        }

        // Зміна кольору фону
        if (modeCt.id === "modeCt") {
            modeimg.src = "../static/img/sun.png"; 
            settings.style.backgroundColor = "#f3f3f3";
            mode.style.backgroundColor = "rgb(220, 220, 220)";
            modet.style.backgroundColor = "rgb(228, 228, 228)";
            modep.style.color = "black"; // Використовуйте === для порівняння
            document.body.style.backgroundColor = "#FFFFFF"; // Білий фон
            localStorage.setItem('themedarkwhite', 'white'); // Записуємо значення 'white' у localStorage
        } else if (modeCt.id === "modeCt2") {
            modeimg.src = "../static/img/moon.png";
            settings.style.backgroundColor = "#303030";
            mode.style.backgroundColor = "#383838";
            modet.style.backgroundColor = "#333333";
            modep.style.color = "white"; // Використовуйте === для порівняння
            document.body.style.backgroundColor = "#1e1e1e"; // Темний фон
            localStorage.setItem('themedarkwhite', 'dark'); // Записуємо значення 'dark' у localStorage
        }
    };
    modeC.appendChild(modeCt)

    if (theme === "white") {
        modeimg.src = "../static/img/sun.png"; 
        settings.style.backgroundColor = "#f3f3f3";
        mode.style.backgroundColor = "rgb(220, 220, 220)";
        modet.style.backgroundColor = "rgb(228, 228, 228)";
        modep.style.color = "black"; // Використовуйте === для порівняння
        document.body.style.backgroundColor = "#FFFFFF";
    } else if (theme === "dark") {
        modeimg.src = "../static/img/moon.png";
        settings.style.backgroundColor = "#303030";
        mode.style.backgroundColor = "#383838";
        modet.style.backgroundColor = "#333333";
        modeCt.id = "modeCt2";
        modep.style.color = "white"; // Використовуйте === для порівняння
        document.body.style.backgroundColor = "#1e1e1e";
    } else {
        modeimg.src = "../static/img/sun.png"; 
        settings.style.backgroundColor = "#f3f3f3";
        mode.style.backgroundColor = "rgb(220, 220, 220)";
        modet.style.backgroundColor = "rgb(228, 228, 228)";
        modep.style.color = "black"; // Використовуйте === для порівняння
        document.body.style.backgroundColor = "#FFFFFF";
    }
};
