<new-project>
  <h1>{opts.title}</h1>
  <hr/>

  <form onsubmit={create} class="form-inline pull-right">
    <div class="form-group">
      <input name="title" type="text" class="form-control" placeholder="Projektin nimi" value={title}>
      <input name="team" type="text" class="form-control" placeholder="Projektitiimi" value={team}>
    </div>

    <button class="btn btn-success">Tallenna</button>
  </form>

  <script>
    var self = this

    create(e) {
      var url = opts.url + "/projects";

      var xmlhttp = new XMLHttpRequest()
      xmlhttp.open("POST", url, true)

      xmlhttp.onload = function() {
        if (xmlhttp.status >= 200 && xmlhttp.status < 400) {

        }
      }

      xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xmlhttp.send(JSON.stringify({title: item.title, team: item.team}))
    }

  </script>
</new-project>
