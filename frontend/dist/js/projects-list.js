riot.tag2('projects-list', '<h3>{opts.title}</h3> <ul class="list-group"> <li class="list-group-item {active: points > 0}" each="{items.filter(whatShow)}" onclick="{parent.toggle}"> <span class="badge" if="{points > 0}">{points}</span> {title} </li> </ul> <form onsubmit="{add}" class="form-inline"> <div class="form-group"> <label class="sr-only" for="name">Sun nimi</label> <input name="name" type="text" class="form-control" id="name" placeholder="Sun nimi"> </div> <button class="btn btn-success">Lähetä</button> <button onclick="{reset}" class="btn btn-danger">cancel</button> </form>', '', '', function(opts) {
    this.items = opts.items

    this.votes = []

    function pointsFor(item, votes) {
      var index = votes.indexOf(item)
      if(index >= 0) {
        return 5 - index * 2
      }
    }

    this.add = function(e) {
      for(i in this.votes) {
        var data = new FormData

        var item = this.items[i]
        data.append('voter', e.target[0])
        data.append('title', item.title)
        data.append('points', item.points)

        var request = new XMLHttpRequest()
        request.open('POST', opts.url, true)
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            console.log("voted" + item.title)
          }
        }
        request.send(data)
      }
    }.bind(this)

    this.whatShow = function(item) {
      return !item.hidden
    }.bind(this)

    this.reset = function() {
      this.votes = []
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
