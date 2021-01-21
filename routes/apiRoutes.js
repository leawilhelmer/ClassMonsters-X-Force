// Requiring our models
const db = require('../models');
var emoji = require('node-emoji');

// Routes
module.exports = (app) => {

//find all messages that belong to specific user
app.get('/api/messages/:id', (req, res) => {
  console.log(req.params.id)
  db.Messages.findAll({
    where: {
      toId: req.params.id
    }
  }).then((dbGetMess) => res.json(dbGetMess));
})


//Create messages
app.post('/api/messages', (req, res) => {
  db.Messages.create({
    subject: req.body.subject,
    message: req.body.message,
    read: req.body.read,
    fromId: req.body.fromId,
    toId: req.body.toId,
  }).then((dbGetMess) => res.json(dbGetMess))
});


//Delete Messages
app.delete('/api/messages/:id', (req, res) => {
  db.Messages.destroy({
    where: {
      id: req.params.id
    }, 
  }).then((dbMess) => res.json(dbMess))
})

 
//Update Messages
app.put('/api/messages/:id', (req, res, next) => { 
  db.Messages.update(
    {read: req.body.read},
    {where: {id: req.params.id}}
    ).then((results) => {
       res.json(results);
       console.log(results);
       if (results.changedRows === 0) {
         return res.status(404).end()
       }
         res.status(200).end();
      })
   .catch(next)
})

//Login Route
app.post('/api/login', function(req, res) {
  var username = req.body.userID;
  var password = req.body.password;
  console.log(username,password);
  if (username && password) {
// check if user exists
    db.Users.findOne({
      where: {
        username: username,
        password: password
        },include: [db.Role]
      })
      .then((data) => { 
        if(data){
          if(data.Role.name === 'Teacher'){
            res.redirect(`/teacher?uname=${username}&fname=${data.first_name}&lname=${data.last_name}&uid=${data.id}`)
          } else if (data.Role.name === 'Student'){
            res.redirect(`/student?uname=${username}&fname=${data.first_name}&lname=${data.last_name}&uid=${data.id}`)
          } else {
            res.json(data)
          }
        } else {
          return res.json([{"msg": "The userID or Password was invalid"}])
        }
        })
      .catch((err) => {throw err})
    }
 });
  
  app.get('/api/students', (req, res) => {
    const query = {};
    if (req.query.author_id) {
      query.AuthorId = req.query.author_id;
    }
    db.Student.findAll({
      where: query,
      include: [db.Author],
    }).then((dbPost) => res.json(dbPost));
  });

  app.get('/api/icons/:id', (req, res) => {
    emoji.get(req.params.id)
    console.log(abc)
    return(abc)
  });

  app.get('/api/posts/:id', (req, res) => {

    db.Post.findOne({
      where: {
        id: req.params.id,
      },
      include: [db.Author],
    }).then((dbPost) => res.json(dbPost));
  });

  // POST route for saving a new post
  app.post('/api/posts', (req, res) => {
    db.Post.create(req.body).then((dbPost) => res.json(dbPost));
  });
}
