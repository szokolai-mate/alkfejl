$projectid=((window.location.pathname).split("/"))[2]
$token=($('[name="_csrf"]').first().val())

function refresh(){
Promise.resolve(
$.get("/ajax/project/" + $projectid + "/comments"))
    .then(function (data) {
        $list=$("#commentlist")
        $loggedin=data['loggedin']
        let string = ""
        data['projectcomments'].forEach(i => {            
           
            string+=`<li class="list-item">
            <div class="`
            
             if(i.ownitem==1){
                string+=" own-item "
            }
            
            string+=`">
            <div class="description">`

            i.content.forEach( line => {
                string+=line + "<br>";
            })

            string+=`</div>
            <div class="stats">
            <div class="score">`

            string+= i.score
            string+=`</div>`
            if($loggedin==1){
            string+=`<div class="voter">
                <form  id="negative-vote-form" action="/show/`
            string+=$projectid + `/vote/` + i.id +`" method="post">`
                + `<input name="_csrf" value="` +  $token + `" type="hidden">`  +
                    `<input type="checkbox" style="display:none;" name="positive">
                <button class="negative-vote `
            if(i.voted==-1){ string+=" voted "}
            string+=`"></button>
                </form>
                <form id="positive-vote-form" action="/show/` + $projectid + `/vote/` + i.id + `" method="post">`
                                + `<input name="_csrf" value="` +  $token + `" type="hidden">`  +
                    `<input type="checkbox" checked style="display:none;" name="positive">
                <button class="positive-vote `;
                if(i.voted==1){ string+=" voted "}
                string+=`"></button>
                </form>
            </div>`
            }
            string+=`<div class = "owner">
            <a href="/profile/` + i.ownerID + `">` + i.owner.displayName + `</a>
            </div>
            </div>
            </div>
            </li>`

        } )
        $list2=$list
        $list2.html(string)
        $list.fadeOut("fast",function(){
        $list.replaceWith($list2)
        $list2.hide().fadeIn("fast")
        })
                    putvotes()

    })
    .catch(function (error) {
        console.log(error);
    })
}

function getScore(id,type){
    $data={ id:id }
    const headers = {
    'csrf-token': $('[name="_csrf"]').val()
    }
    switch(type){
        case("project"):
        $data["type"]="project"
    }
   result = Promise.resolve(
    $.ajax({
      url: "/ajax/votes",
      method: 'POST',
      dataType: 'json',
      headers,
      data :$data
    })
  )

  return result
}

$("#projectcommentbutton").on('click',function(e){
    //e.preventDefault()
    refresh();
})


$("#newcomment-form").on('submit',function(e){
    e.preventDefault()
    console.log($('#newcomment-form').serialize())
    const headers = {
    'csrf-token': $('[name="_csrf"]').val()
  }
  Promise.resolve(
    $.ajax({
      url: "/ajax/project/" + $projectid + "/comment",
      method: 'POST',
      dataType: 'json',
      headers,
      data : $('#newcomment-form').serialize()
    })
  ).then(function(data){
      refresh()
  })
})

function putvotes () {
$(".voter").each(function(e){
    $this=$(this)
    $score=$this.siblings(".score")
    $id=$(this).find("form").first().attr("action")
    $id=$id.substr($id.lastIndexOf("/")+1)
    $positivevote=$this.find(".positive-vote")
    $negativevote=$this.find(".negative-vote")

    $negativevote.on('click',function(e){
        e.preventDefault()
        const headers = {
        'csrf-token': $('[name="_csrf"]').val()
    }

    $voter=$(this).closest('.voter')
    $id=$(this).parents("form").first().attr("action")
    $id=$id.substr($id.lastIndexOf("/")+1)
    $score=$voter.siblings(".score")
    $negativevote=$voter.find(".negative-vote")
    $positivevote=$voter.find(".positive-vote")

    Promise.resolve(
        $.ajax({
        url: "/ajax/show/" + $projectid  + "/vote/" +  $id ,
        method: 'GET',
        dataType: 'json',
        headers,
        data : $(this).find('#negative-vote-form').serialize()
        })
    ).then(function(data){
        getScore($id,"project").then(function(data){

        $voter.fadeOut("fast",function(){
        $negativevote.attr("class","negative-vote voted")
        $positivevote.attr("class","positive-vote")
        $score.fadeOut("fast",function(){
        $score.html(data['score'])
        $score.hide().fadeIn("fast")
        })
        $voter.hide().fadeIn("fast")
        })
    })

    
    })

    })
    $positivevote.on('click',function(e){
        e.preventDefault()
        const headers = {
        'csrf-token': $('[name="_csrf"]').val()
    }

    $voter=$(this).closest('.voter')
    $id=$(this).parents("form").first().attr("action")
    $id=$id.substr($id.lastIndexOf("/")+1)
    $score=$voter.siblings(".score")
    $negativevote=$voter.find(".negative-vote")
    $positivevote=$voter.find(".positive-vote")

    Promise.resolve(
        $.ajax({
        url: "/ajax/show/" + $projectid  + "/vote/" +  $id ,
        method: 'GET',
        dataType: 'json',
        headers,
        data : $this.find('#positive-vote-form').serialize()
        })
    ).then(function(data){
       getScore($id,"project").then(function(data){
        $voter.fadeOut("fast",function(){
        $negativevote.attr("class","negative-vote")
        $positivevote.attr("class","positive-vote voted")
        $score.fadeOut("fast",function(){
        $score.html(data['score'])
        $score.hide().fadeIn("fast")
        })
        $voter.hide().fadeIn("fast")
        })
    })
    })
    
})
})
}

putvotes()