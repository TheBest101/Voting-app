$('document').ready(() => {
  function test(boolean){
    boolean = JSON.parse(boolean)
    if(!boolean.Success){
      if(boolean.message === "Name"){
        $('#message').html('<h3 style="color:red" id="message">Poll name already in use. Choose a different name</h3>')
      }else{
        $('#message').html('<h3 style="color:red" id="message">Poll needs two options. Make another choice</h3>')
      }
    }else{
      $('#message').html('<h3 style="color:green" id="message">Success!</h3>')
    }
  }
  $('#submit').on('click', () => {
    let name = $('#Title').val()
    let options = $('#Options').val().split(/\n/g)
    ajaxFunctions.ajaxRequest('POST',`${appUrl}/api/create?name=${name}&options=${options}`, test)
  })
})
