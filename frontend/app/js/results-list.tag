<results-list>
  <h1>{opts.title}</h1>
  <hr/>

  <div class="list-group">
    <li class="list-group-item" each={ opts.results.filter(whatShow) }>
      <span class="badge">{ points || 0 }</span>
      <h4 class="list-group-item-heading">{ title }</h4>
      <p class="list-group-item-text">{ team }</p>
    </li>
  </div>

  <script>
    var self = this

    whatShow(item) {
      return !item.hidden
    }
  </script>
</results-list>
