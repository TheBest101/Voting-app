function updateList(poll) {
  poll = JSON.parse(poll)
  for(let x=0;x<poll.length;x++){
    $('#app').append(`<li class="list-group-item"><a href="/pollStranger/vote?name=${poll[x].name}">${poll[x].name}</li>`)
  }
}
$('document').ready(() => {
  ajaxFunctions.ajaxRequest('GET', appUrl + '/api', updateList)
})
