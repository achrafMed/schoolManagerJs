const Datastore = require('nedb')

db = new Datastore({
  filename: 'factures.db',
  autoload: true
});

var rec = {
  prénom: 'achraf',
  nom: 'medyouni el hassouni',
  date: '20 dec 2003',
  address: '114 ain el atti',
  nom_t: 'khalil medyouni',
  num_t: '0632930118',
  s_i: 'ecole',
}
db.remove({}, {multi: true}, (err, rec) => {
  if(err) throw err;
  console.log(rec);
})
