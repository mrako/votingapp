riot.tag2('projects-list', '<h1>{opts.title}</h1> <hr> <errors></errors> <messages></messages> <div if="{!voted}"> <authorize></authorize> <form onsubmit="{add}" class="form-inline pull-right"> <div class="form-group"> <input name="name" type="text" class="form-control" placeholder="Sähköposti" value="{email}"> </div> <button class="btn btn-success">Lähetä</button> <button onclick="{resetForm}" class="btn btn-danger">Peruuta</button> </form> <div class="clearfix"></div> <hr> <div class="list-group"> <a href="#" class="list-group-item {active: points > 0}" each="{opts.projects.filter(whatShow)}" onclick="{parent.toggle}"> <span class="badge" if="{points > 0}">{points}</span> <h4 class="list-group-item-heading">{title}</h4> <p class="list-group-item-text">{team}</p> </a> </div> </div> <div if="{voted}"> <h3>Kiitos äänestyksestäsi!</h3> </div>', '', '', function(opts) {
    var self = this

    this.items = opts.projects

    this.user = this.email = ""

    this.errors = []
    this.messages = []
    this.votes = []

    this.voted = false

    function pointsFor(item, votes) {
      var index = votes.indexOf(item)
      if(index >= 0) {
        return 5 - index * 2
      }
    }

    this.isAllowedToVote = function(email) {
      var xmlhttp = new XMLHttpRequest();
      var url = opts.url + "/" + self.user + "/allowed";

      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          send()
        }
        if (xmlhttp.readyState == 4 && xmlhttp.status == 405) {
          self.errors.push({message: "Olet jo äänestänyt"})
          self.update()
        }
      }
      xmlhttp.open("GET", url, true)
      xmlhttp.send()
    }.bind(this)

    this.setEmail = function(email) {
      self.user = self.email = email
      self.update()
    }.bind(this)

    function reqListener () {
      console.log(this.status);
    }

    function send() {
      
      self.votesSent = 0

      for(i in self.votes) {
        var item = self.votes[i]

        var xmlhttp = new XMLHttpRequest()
        xmlhttp.open("POST", opts.url, true)

        xmlhttp.addEventListener("load", function() {
          if (this.status >= 200 && this.status < 400) {
            self.voted = true

            self.votesSent++
            if (self.votesSent >= 3) {
              reset()
            }
          }
        });

        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify({voter: self.user, points: item.points, projectId: item.id}))
      }
    }

    this.add = function(e) {
      error = false

      if (self.votes.length < 3) {
        self.errors.push({message: "Merkitse kolme ääntä"})
        error = true
      }
      if (self.user.length == 0) {
        self.errors.push({message: "Anna palvelulle lupa lukea sähköpostiosoitteesi"})
        error = true
      }

      if (!error) {
        self.isAllowedToVote()
      }
    }.bind(this)

    this.whatShow = function(item) {
      return !item.hidden
    }.bind(this)

    this.resetForm = function(e) {
      reset()
    }.bind(this)

    function reset() {
      self.errors = []
      self.votes = []
      self.user = self.email = ""
      for(i in self.items) {
        self.items[i].points = 0
      }
      self.update()
    }

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

riot.tag2('messages', '<div class="alert alert-danger" role="alert" each="{parent.messages}"> <a href="#" class="close" onclick="{close}">&times;</a> {message} </div>', '', '', function(opts) {
    var self = this

    this.close = function(e) {
      var index = self.parent.messages.indexOf(e.item);
      if (index > -1) {
        self.parent.messages.splice(index, 1);
      }
    }.bind(this)
});

riot.tag2('authorize', '<button class="btn btn-success" onclick="{auth}">Hae sähköpostisi googlesta</button>', '', '', function(opts) {
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

            self.parent.isAllowedToVote()
          })
        });
      })
    }.bind(this)
});

