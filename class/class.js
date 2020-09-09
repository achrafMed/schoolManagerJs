const { ipcRenderer } = require('electron');

ipcRenderer.send('class-request', 'all classes');
let students;
ipcRenderer.on('class-all', (event, args) => {
    students = args;
    let table = document.querySelector('.class');
    args.forEach((arg, index) => {
        let row = table.insertRow(index);
        let cell0 = row.insertCell(0)
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        cell0.innerHTML = arg.nom;
        cell1.innerHTML = arg.niveau;
        cell2.innerHTML = `<button class="student s-${index}">afficher les étudiants</button>`
    })
});
$('.class').click((e) => {
    let css = $(e.target).attr('class');
    if(css.includes('student') == true){
            
    }
})