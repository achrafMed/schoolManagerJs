const{ app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const Datastore = require('nedb');
const db = new Datastore({
    filename: 'data/students.db',
    autoload: true
});
const db1 = new Datastore({
    filename: 'data/factures.db',
    autoload: true
})
const db2 = new Datastore({
    filename: './data/classes.db',
    autoload: true
})
let win;
const ws = fs.createWriteStream('./data.csv');
function createWindow(){
    win = new BrowserWindow({
        width: 800,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('./main/index.html');
    win.webContents.openDevTools();
    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

ipcMain.on('data-message', (event, args) => {
    if(Array.isArray(args)){
        console.log(args);
        if(args[6] == true){
            args[6] = "école"
        }
        
        let newDoc = {
            prénom: args[0],
            nom: args[1],
            date: args[2],
            address: args[3],
            nom_t: args[4],
            num_t: args[5],
            s_i: args[6]
        }
        db.find({prénom: newDoc.prénom, nom: newDoc.nom}, (err, doc) => {
            if(doc.length == 0){
                db.insert(newDoc, (err, doc) => {
                    if(err) throw err;
                    event.sender.send('data-reply', 'éléve ajouté')
                })
            }
            else{
                event.sender.send('data-reply', 'élève existant');
                console.log(doc);
            }
        })
        
    }
});
let students;
ipcMain.on('student-request', (event, args) => {
    db.find({}, (err, docs) =>{
        if(err) throw err;
        event.sender.send('student-reply', docs);
    })
    console.log(args);
});

ipcMain.on('student-call', (event, args) => {
    students = args
})

ipcMain.on('student-ask', (event, args) => {
    event.reply('student-card', students);
    console.log(args)
});
ipcMain.on('payment-request', (event, arg) => {
    db1.find({name: arg.name + " " + arg.l_name}, (err, docs) => {
        if(err) throw err;
        event.reply('payment-reply', docs)
    })
})
ipcMain.on('facture-detail', (event, args) => {
    let doc = {
        name: args[0],
        month: args[1],
        amount: args[2],
        method: args[3]
    }
    db1.insert(doc, (err, d) =>{
        if(err) throw err;
        event.reply('facture-state', doc);
    })
})
ipcMain.on('class-add', (event, args) => {
    let doc =args
    db2.insert(doc, (err, d) => {
        if(err) throw err;
        event.reply('class-reply', 'classe ajoutée')
    })
})

ipcMain.on('class-request', (event, args) => {
    if(args == 'all classes'){
        db2.find({}, (err, docs) => {
            if(err) throw err;
            event.reply('class-all', docs)
        })
    }
})
ipcMain.on('class-students', (event, args) => {
    db.find({class: {nom: args.nom, niveau: args.niveau}}, (err, docs) => {
        if(err) throw err;
        event.reply('this-class', docs)
    })
})