riot.tag2('projects-list', '<h3>{opts.title}</h3> <ul class="list-group"> <li class="list-group-item {active: points > 0}" each="{items.filter(whatShow)}" onclick="{parent.toggle}"> <span class="badge" if="{points > 0}">{points}</span> {title} </li> </ul> <form onsubmit="{add}"> <button class="btn btn-success">Submit</button> <button onclick="{reset}" class="btn btn-danger">cancel</button> </form>', '', '', function(opts) {
    this.items = opts.items

    this.votes = []

    function pointsFor(item, votes) {
      var index = votes.indexOf(item)
      if(index >= 0) {
        return 5 - index * 2
      }
    }

    this.edit = function(e) {
      this.text = e.target.value
    }.bind(this)

    this.add = function(e) {
      if (this.text) {
        this.items.push({ title: this.text })
        this.text = this.input.value = ''
      }
    }.bind(this)

    this.removeAllDone = function(e) {
      this.items = this.items.filter(function(item) {
        return !item.done
      })
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
