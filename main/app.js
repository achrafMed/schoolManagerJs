
var { ipcRenderer } = require('electron');
const table = document.querySelector('.ajouter')
const tBody = table.querySelector('.tbody');
let n_options = document.querySelector('.n_options');
document.querySelector('.n_class').hidden = true;
$('.ajouter').attr('hidden', true);
$('.trouver').attr('hidden', true);
$('.new, .f, .remove, .add, .show').on('click', e => {
    n_options = document.querySelector('.n_options');
    let css = $('n_options').attr('class');
    n_options.classList.add('clicked');
})
$(".new").click(() => {
    $('.remove').attr('disabled', true);
    $('.ajouter').attr('hidden', false);
    $('.trouver').attr('hidden', true);
    $('.find').attr('hidden', true);
    $('label').attr('hidden', true);
    $('.classes').attr('hidden', true);
    $('.f_class').attr('hidden', true);
    $('.n_class').find('.valider').attr('hidden', true);
    $('.tbody').find('tr').remove();
    let row = tBody.insertRow(0);
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
    $(cell8).attr('class', 'b')
    $(cell7).attr('class', 'b')
    //a detects if school;
    var a;
    $(".s_i-off").click(() => {
        cell7.hidden = false;
        cell7.innerHTML = '<input class="sh" type="text"/>'
        a = false;
    });
    $(".s_i-on").click(() => {
        cell7.hidden = true;
        a = true;
    })
    $('.submit').click(() => {
        let name = $('.p_n').val();
        if(name === ""){ alert("veuillez entrer le prenom"); return;}
        console.log(name)
        let l_name = $('.n').val();
        if(l_name === "") {alert("veuillez entrer le nom"); return; }
        // bd: date de naissance;
        let bd = $('.d_n').val();
        if(isNaN(Date.parse(bd)) == true) {alert('veuillez entrer une date de naissance valide'); return; }
        let address = $('.a').val();
        if(address === "") {alert('veuillez entrer une address'); return; }
        let parent = $('.n_t').val();
        if(parent === "") {alert('veuillez entrer le nom de tuteur');return; }
        let p_num = $('.num_t').val();
        if(p_num == "") {alert('veuillez entrer un numero de telephone'); return; }
        if(a == undefined){
            alert('veuillez preciser le champ de scolarite interieur');
            return;
        } else if(a == false && $(".sh").val() == ""){
            alert("veuillez specifier le champ de scholarité interne");
            return;
        }
        if(a == false && $('.sh').val() != ""){
            let info = [name, l_name, bd,address, parent, p_num, $(".sh").val()];
            ipcRenderer.send('data-message', info);
        }
        if(a == true){
            let info = [name, l_name, bd, address, parent, p_num, a];
            ipcRenderer.send('data-message', info);
        }
        console.log(a);
        let reply;

    });

});
$('.find').click(() => {
    let div = document.querySelector('.classes')
    if(div.hidden == true){
        $('.f').trigger('click');
    }
})
ipcRenderer.on('data-reply', (event, arg) =>{
    reply = arg;
    alert(reply);
})
$('.f').click(() => {
    $('#name').text("nom de l'élève: ");
    $('.ajouter').attr('hidden', true);
    $('.find').attr('hidden', false);
    $('.trouver').attr('hidden', false);
    $('label').attr('hidden', false);
    $('.classes').attr('hidden', true);
    $('.n_class').find('.valider').attr('hidden', true);
    $('.remove').attr('disabled', false);
    $('.f_class').attr('hidden', true);
    ipcRenderer.send('student-request', 'all students');
})
let students;
ipcRenderer.send('student-request', 'for class');
ipcRenderer.on('class-students', (event, args) => {
    students = args;
    console.log(args)
});


ipcRenderer.on('student-reply', (event, args) => {
    const table2 = document.querySelector('.tr');
    $('.tr').find('tr').remove();
    students = args;
    args.forEach((arg, index) => {
        var row = table2.insertRow(index);
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
        //$(cell8).attr('class', "b")
        //$(cell7).attr('class', 'b')
    })
    $('.find').on('keyup',() => {
        let text = $('.find').val()
        students.forEach((arg, index) =>{
            let fullName = arg.prénom + " " + arg.nom
            if(fullName.includes(text) != true){
                $(`.row${index}`).attr('hidden', true)
            }
            else{
                $(`.row${index}`).attr('hidden', false);
            }
        })
    });
    $('.redirect').click((e) => {
        let ind = parseInt($(e.target).attr('class').slice(9));
        console.log(students[ind]);
        ipcRenderer.send('student-call', students[ind])
        window.location.replace('../student/index.html');
    })

});
$('.trouver').on('click', '.modifier',(e) => {
    let ind = parseInt(e.target.className.slice(11))
    console.log(students[ind])
    ipcRenderer.send('student-call', students[ind])
    ipcRenderer.send('modifie-student', 'modifie');
    window.location.replace('../student/index.html')
});
let d = true;
$('.remove').click((e) => {
    if(d === true){
        $('.delete').attr('hidden', false);
        $('.remove').text('suprimer !')
        d = false;
    } else {
        if(checked.length != 0){
            ipcRenderer.send('remove-request', checked);
        }
        checked = [];
        $('.remove').text('suprimer un élève');
        $('.delete').attr('hidden', true);
        d = true;
    }
});
let checked = [];
$('.trouver').click((event) => {
    let css = $(event.target).attr('class');
    if(css == undefined) return;
    if(css.includes('delete') == false) return;
    let ind =css.slice(9)
    if($(event.target).is(':checked')){
        checked.push(students[ind]);
    } else if($(event.target).is(':not(:checked)')){
        checked  = checked.filter(item => item != students[ind]);
    }
});
ipcRenderer.on('remove-status', (event, args) => {
    alert(`${args} élèves suprimé`);
    $('.f').trigger('click');
});

let c_students = [];

$('.add').click((e) => {
    console.log('new class added');
    $('.trouver').attr('hidden', true);
    $('.classes').attr('hidden', false);
    $('.n_class').find('.valider').attr('hidden', false);
    $('.ajouter').attr('hidden', true);
    $('.find').attr('hidden', false);
    $('label').attr('hidden', false);
    $('.remove').attr('disabled', true);
    $('.f_class').attr('hidden', true);
})
$('.n_class').find('.valider').click(e => {
    console.log('données validé');
    if($('.classes').find('.nom').val() == ""){
        alert('veuillez entrer le nom de la class')
        return;
    }
    if($('.classes').find('.niveau').val() == ""){
        alert('veuillez entrer le niveau');
        return;
    }else{
        let data = {
            nom: $('.classes').find('.nom').val(),
            niveau: $('.classes').find('.niveau').val(),
            students: c_students
        }
        console.log(data);
        ipcRenderer.send('class-add', data);
    }
});

$('.names').click(e => {
    let table2 = document.querySelector('.tr');
    $('.trouver').attr('hidden', false);
    $('.ajouter').attr('hidden', true);
    $('.find').attr('hidden', false);
    $('label').attr('hidden', false);
    $('.f_class').attr('hidden', true);
    $('.tr').find('tr').remove();
    students.forEach((arg, index) => {
        var row = table2.insertRow(index);
        row.classList.add(`row-${index}`);
        let cell = row.insertCell(0);
        let cell0 = row.insertCell(1);
        let cell1 = row.insertCell(2);
        let cell2 = row.insertCell(3);
        let cell3 = row.insertCell(4);
        let cell4 = row.insertCell(5);
        let cell5 = row.insertCell(6);
        let cell6 = row.insertCell(7);
        cell.innerHTML = `<input type="checkbox" class="class r-${index}"/>`;
        cell0.innerHTML = arg.prénom;
        cell1.innerHTML = arg.nom;
        cell2.innerHTML = arg.date;
        cell3.innerHTML = arg.address;
        cell4.innerHTML = arg.nom_t;
        cell5.innerHTML = arg.num_t;
        cell6.innerHTML = arg.s_i;
        //$(cell8).attr('class', "b")
        //$(cell7).attr('class', 'b')
    })
    $('.find').on('keyup',() => {
        let text = $('.find').val()
        students.forEach((arg, index) =>{
            let fullName = arg.prénom + " " + arg.nom
            if(fullName.includes(text) != true){
                $(`.row-${index}`).attr('hidden', true)
            }
            else{
                $(`.row-${index}`).attr('hidden', false);
            }
        });
    });
});
$('.tr').click(e => {
    let css = $(e.target).attr('class');
    if(css == undefined) return;
    if(css.includes('class') != true) return;
    if($(e.target).is(':checked')){
        let ind = css.slice(8);
        c_students.push(students[ind]);
    } else if($(e.target).is(':not(:checked)')){
        let ind = css.slice(8);
        c_students.filter(item => item != students[ind]);
    }

});

ipcRenderer.on('class-reply', (event, args) => {
    alert(args);
});

$('.show').click(e => {
    $('.f-class').find('tr').remove();
    $('.classes').attr('hidden', true);
    $('.trouver').attr('hidden', true);
    $('.ajouter').attr('hidden', true);
    $('.find').attr('hidden', false);
    $('label').attr('hidden', false);
    $('.f_class').attr('hidden', false);
    $('#name').text('nom de la class: ');
    ipcRenderer.send('class-request', 'all classes');
});
var classes;
ipcRenderer.on('class-all', (event, args) => {
    classes = args;
    let tbody = document.querySelector('.f-class');
    args.forEach((arg, index) => {
        let row = tbody.insertRow(index);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        $(row).attr('class', `${index}`);
        cell1.innerHTML = arg.nom;
        cell2.innerHTML = arg.niveau;
        cell3.innerHTML = `<button class="class-${index}">afficher les élèves</button>`;
        cell4.innerHTML = `<button class="c-ajouter">ajouter des élèves</button>`;
        cell5.innerHTML = `<button class="c_delete ${index}">suprimer un élève</button>`;
    });
});

$('.f-class').click((e) => {
    let css = $(e.target).attr('class');
    if(css == undefined) return;
    if(css.includes('class') == false) return;
    css = parseInt(css.slice(6));
    add = css;
    ipcRenderer.send('class-students', classes[css]);
});

function showStudents(args){
    $('.tr').find('tr').remove();
    args.forEach((arg, index) => {
        var table2 = document.querySelector('.tr');
        var row = table2.insertRow(index);
        row.classList.add(`row-${index}`);
        let cell = row.insertCell(0);
        let cell0 = row.insertCell(1);
        let cell1 = row.insertCell(2);
        let cell2 = row.insertCell(3);
        let cell3 = row.insertCell(4);
        let cell4 = row.insertCell(5);
        let cell5 = row.insertCell(6);
        let cell6 = row.insertCell(7);
        cell.innerHTML = `<input type="checkbox" class="delete r-${index}" hidden="true"/>`;
        cell0.innerHTML = arg.prénom;
        cell1.innerHTML = arg.nom;
        cell2.innerHTML = arg.date;
        cell3.innerHTML = arg.address;
        cell4.innerHTML = arg.nom_t;
        cell5.innerHTML = arg.num_t;
        cell6.innerHTML = arg.s_i;
    });
}


ipcRenderer.on('this-class', (event, args) => {
    $('.trouver').attr('hidden', false);
    $('.classes').attr('hidden', true);
    $('.trouver').attr('hidden', false);
    $('.ajouter').attr('hidden', true);
    $('.find').attr('hidden', false);
    $('label').attr('hidden', false);
    $('.f_class').attr('hidden', false);
    $('#name').text("nom de l'élève: ");
    $('.aucun').remove();
    if(args.length == 0){
      $('.trouver').attr('hidden', true);
      $('.trouver').after('<p class="aucun">aucun élève trouvé</p>');
      $('.c_name').remove();
      $('.trouver').before(`<h3 class="c_name">${classes[add].nom}</button>`);
      return;
    }
    $('.tr').find('tr').remove();
    showStudents(args);
    $('.c_name').remove();
    $('.confirme').attr('hidden', true);
    $('.trouver').before(`<h3 class="c_name">${classes[add].nom}</button>`);
});
let add;
let data;
$('.f-class').on('click', '.c-ajouter', (e) => {
    let css = $(e.target).parent().parent().attr('class');;
    add = css;
    $('.trouver').attr('hidden', false);
    showStudents(students);
    $('.tr').find('.delete').attr('class', 'c_ajouter');
    $('.c_ajouter').attr('hidden', false);
    $('.confirme').remove();
    $('.c_name').remove();
    $('.trouver').after('<button class="confirme">valider</button>');
    $('.trouver').before(`<h3 class="c_name">${classes[add].nom}</button>`);
});

$('.tr').click((e) => {
    let css = $(e.target).attr('class')
    if(css == undefined) return;
    if(css.includes('c_ajouter') == false) return;
    css = $(e.target).parent().parent().attr('class');
    css = parseInt(css.slice(4));
    if($(e.target).is(':checked')){
        checked.push(students[css]);
    } else if($(e.target).is(':not(:checked)')){
        checked = checked.filter(item => item != students[css]);
    }

});
$(document).on('click', '.confirme',(e) => {
    ipcRenderer.send('student-plus', {class: classes[add], students: checked});
    checked = [];
    console.log('done');
    ipcRenderer.send('student-request', 'for class');
    ipcRenderer.send('class-students', classes[add]);
})
ipcRenderer.on('reply', (event, args) => {
  alert(args);
});
let info;
let this_class = [];
let csss;
$('.f-class').on('click', '.c_delete', (e) => {
  let css = $(e.target).parent().parent().attr('class');
  let body = document.querySelector('.f-class');
  let button = body.querySelector('.finish');
  if(css == undefined) csss = css;
  if(button != null){
    button.className = ``;
    button.classList.add('c_delete');
    button.classList.add(`${csss}`)
  }
  css = parseInt(css);
  info = css;
  this_class = students.filter(item => item.class.nom == classes[css].nom);
  $('.trouver').attr('hidden', false);
  showStudents(this_class);
  $('.trouver').find('.delete').attr('hidden', false);
  $(`.c_delete.${css}`).attr('class', 'finish');
  $(`.finish`).text('suprimer!');
  $('.trouver').find('.delete').attr('class', 'cdelete');
  $(`.c_delete.${csss}`).text('suprimer un élève');
  $('.c_name').remove();
  $('.trouver').before(`<h3 class="c_name">${classes[css].nom}</h3>`);
  checked = []
  csss = css;
});
$('.trouver').click((e) => {
    let css = $(e.target).parent().parent().attr("class");
    if(css == undefined) return;
    if(css.includes('row') != true) return;
    if($(e.target).attr('class').includes('cdelete') == false) return;
    css = parseInt(css.slice(4));
    console.log(this_class);
    if($(e.target).is(':checked')){
        checked.push(this_class[css])
    }
    else if($(e.target).is(':not(:checked)')){
        checked = checked.filter(item => item != this_class[css]);
    }
    checked = checked.filter(item => item != undefined);
    console.log(checked);
})
$('.f-class').on('click', '.finish', (e) => {
    if(checked.length == 0){
        alert("aucun élève sélectionée");
        $('.finish').attr('class', `c_delete ${info}`);
        $('.c_delete').text('suprimer un élève');
        return;
    }
    ipcRenderer.send('delete-from-class', checked);
    $('.finish').attr('class', `c_delete ${info}`);
    $('.c_delete').text('suprimer un élève');
    checked = []
});

ipcRenderer.on('deleted-from-class', (event, arg) => {
    alert(arg);
    add = info;
    ipcRenderer.send('student-request', 'for class');
    console.log(classes[info]);
    ipcRenderer.send('class-students', classes[info]);

})
