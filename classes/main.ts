import { stringify } from "querystring";
import { ENOSPC, defaultCoreCipherList } from "constants";
import { endianness } from "os";
import { runInContext } from "vm";
import { setTimeout } from "timers";
import { isString } from "util";

interface Css {
    nom: string,
    niveau: string
}
export interface Query {
    prénom: string,
    nom: string,
    date,
    address: string,
    nom_t: string,
    num_t: string,
    s_i: string,
    class: Css,
    _id?;
}
type Options = 'nom'| 'prénom' | '_id' | 'class' | 'all' | 'unknown';
export class main {
    database;
    constructor (db) {
        this.database = db;
    }
    //don't put the docs inside a VARIABLE  in the callback function it won't work;
    //can't put it inside a variable att all
    getStudents (query: Css | string | Query,type: Options, callback: CallableFunction) {
        let data = {};
        //if the type of the first argument is not all so its name or last name ...
        if(type != 'all') {
            data[type] = query;
        }
        //if the query is an object and the type is a class
        if(query instanceof Object && type == 'class'){
            data[type] = query;
        }
        // if the query is unknown; 
        else if(query instanceof Object && type == 'unknown') {
            data = query;
        }
        else if(type == 'nom' || type == 'prénom' || type == '_id') {
            data[type] = query;
        }
        this.database.find(data, (err, doc) => {
            if(err) throw err;
            data['out']= doc;
            let message;
            if(doc.length == 0) {
                message = 'no students found';
            } else {
                message = `${doc.length} students found`;
            }
            callback(doc, message);
        })
        return data['out'];
    }
    /**
     * 
     * @param doc : doc is the document to be inserted. The whole document must be specified
     * @param callback : callback is the callback function
     */
    insertStudent(doc: Query, callback: CallableFunction) 
    {
        this.database.find(doc, (err, docs) => {
            if(err) throw err;
            if(docs.length != 0) {
                callback("student already in");
                return;
            }
            else{
                this.database.insert(doc, (err, document) => {
                    if(err) throw err;
                    callback(document);
                });
            }
        });
        
    }
    /**
     * 
     * @param student student is the student to be deleted it can be inserted as the whole student 
     * card or as the students _id: string
     * @param callback callback function for removing student
     */
    removeStudent(student: Query | string | Object, callback){
        if(typeof student === 'string') {
            student = { _id: student };
        }
        this.database.remove(student, {}, (err, numDocs) => {
            if(err) throw err;
            if(numDocs == 0) {
                callback('err: no students removed');
            } else {
                callback(`${numDocs} student removed`);
            }
        });
    }
    removeAllStudents(callback: CallableFunction) {
        this.database.remove({}, {multi: true}, (err, numDocs) => {
            if(err) throw err;
            callback(numDocs);
        });
    }
}

