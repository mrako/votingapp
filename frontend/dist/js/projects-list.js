riot.tag2('projects-list', '<h1>{opts.title}</h1> <hr> <errors></errors> <authorize></authorize> <form onsubmit="{add}" class="form-inline pull-right"> <div class="form-group"> <input name="name" type="text" class="form-control" placeholder="Sun nimi" value="{email}"> </div> <button class="btn btn-success">Lähetä</button> <button onclick="{reset}" class="btn btn-danger">Peruuta</button> </form> <div class="clearfix"></div> <hr> <div class="list-group"> <a href="#" class="list-group-item {active: points > 0}" each="{opts.projects.filter(whatShow)}" onclick="{parent.toggle}"> <span class="badge" if="{points > 0}">{points}</span> <h4 class="list-group-item-heading">{title}</h4> <p class="list-group-item-text">{team}</p> </a> </div>', '', '', function(opts) {
    var self = this

    this.items = opts.projects

    this.user = this.email = ""

    this.errors = []
    this.votes = []

    function pointsFor(item, votes) {
      var index = votes.indexOf(item)
      if(index >= 0) {
        return 5 - index * 2
      }
    }

    function validate() {
      error = false

      if (self.votes.length < 3) {
        self.errors.push({message: "Merkitse kolme ääntä"})
        error = true
      }
      if (self.user.length == 0) {
        self.errors.push({message: "Anna palvelulle lupa lukea sähköpostiosoitteesi"})
        error = true
      }

      return !error
    }

    this.setEmail = function(email) {
      self.user = self.email = email
      self.update()
    }.bind(this)

    this.add = function(e) {
      if (!validate()) {
        return false
      }
      for(i in this.votes) {
        var item = this.votes[i]

        var xmlhttp = new XMLHttpRequest()
        xmlhttp.open("POST", opts.url, true)

        xmlhttp.onload = function() {
          if (xmlhttp.status >= 200 && xmlhttp.status < 400) {
            console.log("voted" + item.title)
          }
        }

        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify({voter: self.user, points: item.points, projectId: item.id}))
      }

      reset()
    }.bind(this)

    this.whatShow = function(item) {
      return !item.hidden
    }.bind(this)

    this.reset = function() {
      this.votes = []
      this.user = this.email = ""
      for(i in this.items) {
        this.items[i].points = 0
      }
    }.bind(this)

    this.toggle = function(e) {
      var item = e.item

      if (this.votes.length < 3 && this.votes.indexOf(item) < 0) {
        this.votes.push(item)
        item.points = pointsFor(item, this.votes)
      }
    }.bind(this)
});

riot.tag2('errors', '<div class="alert alert-danger" role="alert" each="{parent.errors}"> <a href="#" class="close" onclick="{close}">&times;</a> {message} </div>', '', '', function(opts) {
    var self = this

    this.close = function(e) {
      var index = self.parent.errors.indexOf(e.item);
      if (index > -1) {
        self.parent.errors.splice(index, 1);
      }
    }.bind(this)
});

riot.tag2('authorize', '<button class="btn btn-success" onclick="{auth}">Authorize</button>', '', '', function(opts) {
    var self = this

    this.auth = function() {
      var config = {
        'client_id': '692928060586-hdgprhok15rkcpdrkcmh4p3s5m12sdgb.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/userinfo.email'
      }
      gapi.auth.authorize(config, function() {
        gapi.client.load('oauth2', 'v2', function() {
          gapi.client.oauth2.userinfo.get().execute(function(resp) {
            console.log(resp.email)
            self.parent.setEmail(resp.email)
          })
        });
      })
    }.bind(this)
});

