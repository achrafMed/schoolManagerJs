import {Query, main} from '../classes/main';
import {student} from '../classes/student';
import { isObject } from 'util';
console.log('hey there');
const {ipcMain} = require("electron");
const Datastore = require("nedb");
const studentsDb = new Datastore({
    filename: "../data/students.db",
    autoload: true
})
const classes = new Datastore({
    filename: "../data/classes.db",
    autoload: true
})
const factures = new Datastore({
    filename: '../data/factures.db',
    autoload: true
});
/**
 * channels:
 *      student-request / student-reply
 *      all-students / all-reply
 *      insert-student / inserted-reply
 *      remove-student / removed-reply
 *      update-student / updated-reply
 *      facture-request / facture-reply
 *      facture-add / added-reply
 *      facture-remove / removed-facture-reply
 *      add-class / class-added-reply
 *      all-classes / all-classes-reply
 *      remove-class / class-removed-reply
 *      update-class / class-updated-reply
 */
let students = new main(studentsDb);
var thisStudent;
ipcMain.on('student-request', (event, args) => {
    if(args instanceof Object)
    {
        // when sending the data it should be sent as such:
        /**
         * argument{
         *    message <-will be entered into the method in main class,
         *    body <- the body
         * }
         */
        students.getStudents(args.body.query, args.body.type, (doc, res) => {
            event.reply('student-reply', doc);
        })


    } else {
        console.log("err: message is not an object");
    }
});
ipcMain.on('all-students', (event, args) => {
    students.getStudents('', 'all', (docs, message) => {
        if(message == 'no students found') {
            return;
        }
        event.reply('all-reply', docs)
    })
});
ipcMain.on('insert-Student', (event, args) => {
    students.insertStudent(args.body, (document) => {
        if(document == "student already in") {
            event.reply('inserted-reply', document);
            return;
        } else {
            event.reply(document);
        }
    })
});
ipcMain.on('remove-students', (event, args) => {
    if(args.isArray == true) {
        args.forEach(element => {
            students.removeStudent(element, (num) => {
                console.log(num);
            });
        });
    }
    else {
        students.removeStudent(args, (num) => {
            event.reply(num)
        })
    }
});