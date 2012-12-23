url = if process.env.PORT
    "http://electric-rain-8443.herokuapp.com/"
  else
    "http://localhost"

exports.start = (app, lobby) ->
  app.get '/', (req, res) ->
    console.log('####################')
    console.log(lobby)
    locals = {
      msg: 'hello',
      url: url,
      rooms: (r.name for r in lobby.rooms),
    }
    res.render('index.ejs', {locals: locals})
