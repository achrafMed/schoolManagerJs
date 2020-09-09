$(document).ready(() => {
    const { ipcRenderer } = require('electron');
    let student;
    ipcRenderer.send('student-ask', 'please');
    ipcRenderer.send('modifie-question', 'modifie ?')
    ipcRenderer.on('modifie-reply', (event, args) => {
        if(args =="modifie"){
            $('.name').html(`<input type="text" class="prénom" value="${student.prénom}"/> <br> <input type="text" class="nom" value="${student.nom}"/>`)
            $('.bd').html(`<input type="text" class="naissance" value="${student.date}"/>`);
            $('.adress').html(`<input type="text" class="ad" value="${student.address}"/>`);
            $('.nom_t').html(`<input type="text" class="nomTuteur" value="${student.nom_t}"/>`);
            $('.num_t').html(`<input type="text" class="numero" value="${student.num_t}"/> <button class="modifier">modifier</button>`);

        }
    })
    ipcRenderer.on('student-card', (event, args) => {
        student = args;

        $('.name').text(`${args.prénom} ${args.nom}`);
        $('.adress').text(`${args.address}`);
        $('.bd').text(args.date);
        $('.nom_t').text(args.nom_t);
        $('.num_t').text(args.num_t);
    })
    $('.payment').click(() =>{
        ipcRenderer.send('payment-request', {name: student.prénom, l_name: student.nom});
    });
    let payment;
    ipcRenderer.on('payment-reply', (event, args) => {
        payment = args;
        if(Array.isArray(args) == true){
            $('.facture').find('tr').remove();
            if(args.length == 0){
                $('.facture').attr('hidden', true);
                $('#facture').append('<p>aucune facture ajouté pour cet élève</p>');
                $('#facture').append('<button id="add">ajouter !</button>');
            }
            else{
                console.log(args)
                args.forEach((arg, index) => {
                    let table = document.querySelector('.facture');
                    let row = table.insertRow();
                    $(row).attr("class", `row-${index}`);
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);
                    cell1.innerHTML = arg.month;
                    cell2.innerHTML = arg.amount;
                    cell3.innerHTML = arg.method;
                    if(index == args.length - 1){
                        let cell4 = row.insertCell(3);
                        cell4.innerHTML = '<button id="add">ajouter !</button>';
                    }
                })
            }
        }
    });
    $(document).on('click','#add',() => {
        $('.facture').attr('hidden', false);
        let table = document.querySelector('.facture')
        let row = table.insertRow();
        let prev = $(row).prev();
        let cl = $(prev).attr('class')
        console.log(cl)
        if(cl != undefined){
            $(row).attr('class', cl.slice(4));
        }
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        cell1.innerHTML = '<input type="text" id="month">';
        cell2.innerHTML = '<input type="text" id="amount">';
        cell3.innerHTML = '<input type="text" id="method">';
        cell4.innerHTML = '<button id="valid">valider</button>';
        $('#add').remove()
        $('#add').remove()
    });
    let month;
    let amount;
    let method;
    $(document).on('click','#valid',() => {
        month = $('#month').val();
        amount = $('#amount').val();
        method = $('#method').val();
        ipcRenderer.send('facture-detail', [student.prénom + " " + student.nom, month, amount, method]);
    })
    ipcRenderer.on('facture-state', (event, doc) => {
        alert('facture entrée avec succées');
        payment.push(doc)
        let tr = $('#month').parent().parent();
        tr.remove()
        let table = document.querySelector('.facture');
        let row = table.insertRow();
        let prev = $(row).prev();
        let cl = $(prev).attr('class')
        if(cl != undefined){
            cl = cl.slice(4);
            $(row).attr('class', `row-${parseInt(cl) + 1}`);
        }
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        cell1.innerHTML = month;
        cell2.innerHTML = amount;
        cell3.innerHTML = method;
        cell4.innerHTML = '<button id="add">ajouter !</button>';
    });
    $('.search').keyup(() => {
        payment.forEach((element, index) => {
            if(element.month.includes($(".search").val()) != true){
                $(`.row-${index}`).attr('hidden', true)
            }
            else{
                $(`.row-${index}`).attr('hidden', false)
            }
        })
    });
    $(document).on('click','.modifier',() => {
        let name = $('.prénom').val();
        if(name === ""){ alert("veuillez entrer le prenom"); return;}
        let l_name = $('.nom').val();
        if(l_name === "") {alert("veuillez entrer le nom"); return; }
        // bd: date de naissance;
        let bd = $('.naissance').val();
        if(isNaN(Date.parse(bd)) == true) {alert('veuillez entrer une date de naissance valide'); return; }
        let address = $('.ad').val();
        if(address === "") {alert('veuillez entrer une address'); return; }
        let parent = $('.nomTuteur').val();
        if(parent === "") {alert('veuillez entrer le nom de tuteur');return; }
        let p_num = $('.numero').val();
        if(p_num == "") {alert('veuillez entrer un numero de telephone'); return; }

        ipcRenderer.send('modifie-request', {
            prénom: name,
            nom: l_name,
            date: bd,
            address: address,
            nom_t: parent,
            num_t: p_num,
            s_i: student.s_i
        });
    });
    ipcRenderer.on('modifie-status', (event, args) => {
        alert(args);
    });
    $('.add').click('')
})
