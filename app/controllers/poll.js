$('document').ready(()=>{
  function graph (data, choices) {
    var tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('background', 'white')
      .style('padding', '0 10px')
    var height = 600,
        width = 900;
    var newData = []
    choices.forEach(v => {
      newData.push({'name':v, number: 0})
    })
    data.forEach(v => {
      newData.forEach(x => {
        if(x.name === v.choice){
          x.number++
        }
      })
    })

    var yScale = d3.scaleLinear()
      .domain([0,d3.max(newData.map(v=>v.number))])
      .range([0,height])
    var xScale = d3.scaleBand()
      .domain(newData.map(v=>v.name))
      .range([0, width])
      .padding(.1)
    var chart = d3.select('#graph').append('svg')
      .attr('height', height)
      .attr('width', width)
      .style('background','#81c784')
      .append('g')
    .selectAll('rect').data(newData)
      .enter().append('rect')
      .attr('height', function(d){
        return yScale(d.number)
      })
      .attr('width', function (d){
        return xScale.bandwidth();
      })
      .attr('x', function (d){
        return xScale(d.name);
      })
      .attr('y', function (d){
        return height - yScale(d.number)
      })
      .style('fill', '#ffcc80')
      .on('mouseover', function (d){
      d3.select(this)
        .style('opacity',0.5)
      tooltip.transition().duration(200)
        .style('opacity', .9)
      tooltip.html(`${d.name}: ${d.number}`)
        .style('left', (d3.event.pageX -35) + 'px')
        .style('top', (d3.event.pageY -30) + 'px')

    })
    .on('mouseout', function(d){
      d3.select(this)
        .style('opacity',1)
      tooltip.transition()
        .style('opacity', 0)
    })

  }
  const url = window.location.href
  const name = /(\?.+)$/.exec(url)[0].split('=')[1]
  //get this poll's data
  ajaxFunctions.ajaxRequest('GET', appUrl + `/api/one?name=${name}`, (poll)=>{
    poll = JSON.parse(poll)
    $('#title').text(poll.name)
    $('#share').on('click', () => {
      $('#shared').text(`Copy this link: ${appUrl}/pollStranger/vote?name=${poll.name}`)
    })
    options = poll.options
    for(let x=0;x<options.length;x++){
      $('#select').append(`<option>${options[x]}</option>`)
    }
    graph(poll.data, options)
    //boolean if owner
    ajaxFunctions.ajaxRequest('GET', appUrl + `/api/owner?name=${name}`, (boolean) => {
      boolean = JSON.parse(boolean)
      console.log(boolean)
      //if yes
      if(boolean.Success){
        $('#owner').append(`<a href="${appUrl}/api/delete?name=${name}" class="btn btn-danger" id="delete">Delete Poll</button>`)
        $('#addOption').append(`<textarea row="3" class="form-control" id="Options"></textarea>`)
        $('#addOption').append(`<button class="btn btn-primary" id="submitOptions">Add Option</button>`)
        //add options
        $('#submitOptions').on('click', () => {
          var addOption = $("#Options").val()
          ajaxFunctions.ajaxRequest('GET', appUrl + `/api/option?name=${name}&option=${addOption}`, () => {
            //update DOM
            ajaxFunctions.ajaxRequest('GET', appUrl + `/api/one?name=${name}`, (poll)=>{
              $('#select').append((`<option>${addOption}</option>`))
            })
          })
        })
      }
    })
  })
  //submit button
  $('#submit').on('click', ()=>{
    var selected = $('#select option:selected').val()
    console.log(selected)
    //vote
    ajaxFunctions.ajaxRequest('GET', appUrl + `/api/vote?name=${name}&choice=${selected}`, (boolean) => {
      boolean = JSON.parse(boolean)
      console.log(boolean)
      //update DOM
      if(boolean.Success){
        $('#message').html('<h3 id="message" style="color:green">Success!</h3>')
        ajaxFunctions.ajaxRequest('GET', appUrl + `/api/one?name=${name}`, (poll)=>{
          poll = JSON.parse(poll)
          $('#title').text(poll.name)
          options = poll.options
          $('#graph').text('')
          graph(poll.data, options)
        })
      }else{
        $('#message').html('<h3 id="message" style="color:red">You already voted</h3>')
      }
    })
  })

})
