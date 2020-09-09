"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ipcMain, ipcRenderer } = require("electron");
class ui {
    constructor() {
        this.name = "ui";
    }
    showStudents(students, table) {
        students.forEach((arg, index) => {
            var row = table.insertRow(index + 1);
            row.classList.add(`row${index}`);
            let cell = row.insertCell(0);
            let cell0 = row.insertCell(1);
            let cell1 = row.insertCell(2);
            let cell2 = row.insertCell(3);
            let cell3 = row.insertCell(4);
            let cell4 = row.insertCell(5);
            let cell5 = row.insertCell(6);
            let cell6 = row.insertCell(7);
            let cell8 = row.insertCell(8);
            let cell9 = row.insertCell(9);
            cell.innerHTML = `<input type="checkbox" class="delete r-${index}" hidden="true"/>`;
            cell0.innerHTML = arg.prénom;
            cell1.innerHTML = arg.nom;
            cell2.innerHTML = arg.date;
            cell3.innerHTML = arg.address;
            cell4.innerHTML = arg.nom_t;
            cell5.innerHTML = arg.num_t;
            cell6.innerHTML = arg.s_i;
            cell8.innerHTML = `<button class="redirect ${index}">afficher la fiche</button>`;
            cell9.innerHTML = `<button class="modifier m-${index}">modifier !</button>`;
        });
    }
    addStudent(table) {
        let row = table.insertRow(1);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);
        let cell4 = row.insertCell(4);
        let cell5 = row.insertCell(5);
        let cell6 = row.insertCell(6);
        let cell7 = row.insertCell(7);
        let cell8 = row.insertCell(8);
        cell0.innerHTML = `<input class="p_n" type="text"/>`;
        cell1.innerHTML = `<input class="n" type="text"/>`;
        cell2.innerHTML = `<input class="d_n" type="date"/>`;
        cell3.innerHTML = `<input class="a" type="text"/>`;
        cell4.innerHTML = `<input class="n_t" type="text"/>`;
        cell5.innerHTML = `<input class="num_t" type="text"/>`;
        cell6.innerHTML = `<input class="s_i-on" type="radio" name="s_i"/>ecole <input class="s_i-off" type="radio" name="s_i"/>autre (specifier...)`;
        cell8.innerHTML = '<button class="submit">valider</button>';
    }
    sendStudent(student, channel, msg) {
        let objct = {
            message: msg,
            body: student
        };
        ipcRenderer.send('insert-Student', objct);
    }
    getStudent(query, type) {
        let objct = {
            message: '',
            body: {
                query: query,
                type: type
            }
        };
        ipcRenderer.send('student-request', objct);
    }
    getAllStudents() {
        ipcRenderer.send('all-students', '');
    }
}
exports.ui = ui;
class student extends ui {
    constructor(data) {
        super();
        this.all = data;
        this.prénom = data.prénom;
        this.lName = data.nom;
        this.date = data.date;
        this.address = data.address;
        this.name_t = data.nom_t;
        this.num_t = data.num_t;
    }
    studentCard(page) {
        ipcRenderer.send("this-student", this.all);
        window.location.replace(page);
    }
}
exports.student = student;
