$token=($('[name="_csrf"]').first().val())
$projectid=((window.location.pathname).split("/"))[1]
$problemid=((window.location.pathname).split("/"))[3]


function refreshproblem(){
Promise.resolve(
$.get("/ajax/problem/" + $problemid + "/comments"))
    .then(function (data) {
        $list=$("#problemcommentlist")
        $loggedin=data['loggedin']
        let string = ""
        data['problemcomments'].forEach(i => {            
           
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
                <form  id="negative-vote-form" action="/` + $projectid + `/show/`+ $problemid + `/vote/` + i.id 
            string+=`" method="post">`
                + `<input name="_csrf" value="` +  $token + `" type="hidden">`  +
                    `<input type="checkbox" style="display:none;" name="positive">
                <button class="negative-vote `
            if(i.voted==-1){ string+=" voted "}
            string+=`"></button>
                </form>
                <form id="positive-vote-form" action="/` + $projectid + `/show/`+ $problemid + `/vote/` + i.id + `" method="post">`
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
                    putproblemvotes()

    })
    .catch(function (error) {
        console.log(error);
    })

}

$('#newproblemcommentbutton').on('click',function(e){
         //e.preventDefault()
         refreshproblem();
    })

$("#newproblemcomment-form").on('submit',function(e){
    e.preventDefault()
    const headers = {
    'csrf-token': $('[name="_csrf"]').val()
  }
  Promise.resolve(
    $.ajax({
      url: "/ajax/problem/" + $problemid + "/comment",
      method: 'POST',
      dataType: 'json',
      headers,
      data : { content : $("#problemcommentcontent").val() }
    })
  ).then(function(data){
      refreshproblem()
  })
})

function getScore(id,type){
    $data={ id:id , type:type }
    const headers = {
    'csrf-token': $('[name="_csrf"]').val()
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


function putproblemvotes () {
$("#problemcommentlist .voter").each(function(e){
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
        url: "/ajax/show/" + $projectid + "/" + $problemid  + "/vote/" +  $id ,
        method: 'GET',
        dataType: 'json',
        headers,
        data : $voter.find('#negative-vote-form').serialize()
        })
    ).then(function(data){
        getScore($id,"problemComment").then(function(data){

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
        url: "/ajax/show/" + $projectid + "/" + $problemid  + "/vote/" +  $id ,
        method: 'GET',
        dataType: 'json',
        headers,
        data : $voter.find('#positive-vote-form').serialize()
        })
    ).then(function(data){
       getScore($id,"problemComment").then(function(data){
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

putproblemvotes()

$(".solution-list .voter").each(function(e){
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
    $solutionid=$voter.find("#negative-vote-form").attr("action")
    $solutionid=$solutionid.split("/")[4]
    $score=$voter.siblings(".score")
    $negativevote=$voter.find(".negative-vote")
    $positivevote=$voter.find(".positive-vote")

    Promise.resolve(
        $.ajax({
        url: "/ajax/show/" + $projectid + "/" + $problemid  + "/vote/solution/" +  $solutionid ,
        method: 'GET',
        dataType: 'json',
        headers,
        data : $voter.find('#negative-vote-form').serialize()
        })
    ).then(function(data){
        getScore($solutionid,"solution").then(function(data){

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
    $solutionid=$voter.find("#negative-vote-form").attr("action")
    $solutionid=$solutionid.split("/")[4]
    $score=$voter.siblings(".score")
    $negativevote=$voter.find(".negative-vote")
    $positivevote=$voter.find(".positive-vote")

    Promise.resolve(
        $.ajax({
        url: "/ajax/show/" + $projectid + "/" + $problemid  + "/vote/solution/" +  $solutionid ,
        method: 'GET',
        dataType: 'json',
        headers,
        data : $voter.find('#positive-vote-form').serialize()
        })
    ).then(function(data){
       getScore($solutionid,"solution").then(function(data){
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

function putsolutioncommentvotes () {
$(".solution-list .comment-list .voter").each(function(e){
    $this=$(this)
    $score=$this.siblings(".score")
    $id=$(this).find("form").first().attr("action")
    $id=$id.substr($id.lastIndexOf("/")+1)
    $positivevote=$this.find(".positive-vote")
    $negativevote=$this.find(".negative-vote")

    $negativevote.off("click")
    $positivevote.off("click")

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
    $solutionid=$(this).parents(".solution").find("#negative-vote-form").first().attr("action")
    $solutionid=$solutionid.split("/")[4]

    Promise.resolve(
        $.ajax({
        url: "/ajax/show/" + $projectid + "/" + $problemid  + "/" + $solutionid + "/vote/" +  $id ,
        method: 'GET',
        dataType: 'json',
        headers,
        data : $voter.find('#negative-vote-form').serialize()
        })
    ).then(function(data){
        getScore($id,"solutioncommentvote").then(function(data){

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
    $solutionid=$(this).parents(".solution").find("#negative-vote-form").first().attr("action")
    $solutionid=$solutionid.split("/")[4]


    Promise.resolve(
        $.ajax({
        url: "/ajax/show/" + $projectid + "/" + $problemid  + "/" + $solutionid + "/vote/" +  $id  ,
        method: 'GET',
        dataType: 'json',
        headers,
        data : $voter.find('#positive-vote-form').serialize()
        })
    ).then(function(data){
       getScore($id,"solutioncommentvote").then(function(data){
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

putsolutioncommentvotes()



$(".problem-stats .voter").each(function(e){
    $this=$(this)
    $score=$this.siblings(".score")
    $positivevote=$this.find(".positive-vote")
    $negativevote=$this.find(".negative-vote")

    $negativevote.off("click")
    $positivevote.off("click")

    $negativevote.on('click',function(e){
        e.preventDefault()
        const headers = {
        'csrf-token': $('[name="_csrf"]').val()
    }

    $voter=$(this).closest('.voter')
    $score=$voter.siblings(".score")
    $negativevote=$voter.find(".negative-vote")
    $positivevote=$voter.find(".positive-vote")

    Promise.resolve(
        $.ajax({
        url: "/ajax/show/" + $projectid + "/vote/problem/" + $problemid,
        method: 'GET',
        dataType: 'json',
        headers,
        data : $voter.find('#negative-vote-form').serialize()
        })
    ).then(function(data){
        getScore($problemid,"problem").then(function(data){

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
    $score=$voter.siblings(".score")
    $negativevote=$voter.find(".negative-vote")
    $positivevote=$voter.find(".positive-vote")

    Promise.resolve(
        $.ajax({
        url: "/ajax/show/" + $projectid + "/vote/problem/" + $problemid,
        method: 'GET',
        dataType: 'json',
        headers,
        data : $voter.find('#positive-vote-form').serialize()
        })
    ).then(function(data){
       getScore($problemid,"problem").then(function(data){
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


function refreshsolution(id,$list){
Promise.resolve(
$.get("/ajax/solution/" + id + "/comments"))
    .then(function (data) {
        $loggedin=data['loggedin']
        let string = ""
        data['solutioncomments'].forEach(i => {            
           
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
                <form  id="negative-vote-form" action="/` + $projectid + `/show/`+ $problemid + `/vote/` + i.id 
            string+=`" method="post">`
                + `<input name="_csrf" value="` +  $token + `" type="hidden">`  +
                    `<input type="checkbox" style="display:none;" name="positive">
                <button class="negative-vote `
            if(i.voted==-1){ string+=" voted "}
            string+=`"></button>
                </form>
                <form id="positive-vote-form" action="/` + $projectid + `/show/`+ $problemid + `/vote/` + i.id + `" method="post">`
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
                    putsolutioncommentvotes()

    })
    .catch(function (error) {
        console.log(error);
    })

}

$(".newsolutioncommentbutton").each(function(){
    $(this).on("click",function(e){
        //e.preventDefault()
        $solutionid=$(this).parents("form").first().attr("action")
        $solutionid=$solutionid.split("/")[4]
        $list=$(this).parents("article").first().find("ul").first()
        refreshsolution($solutionid,$list)
    })

    $(this).parents("form").first().on('submit',function(e){
    e.preventDefault()
    const headers = {
    'csrf-token': $('[name="_csrf"]').val()
  }
    $solutionid=$(this).attr("action")
    $solutionid=$solutionid.split("/")[4]
    $content=$(this).find("textarea")
    $list=$(this).parents("article").first().find("ul")
Promise.resolve(
    $.ajax({
      url: "/ajax/solution/" + $solutionid + "/comment",
      method: 'POST',
      dataType: 'json',
      headers,
      data : { content : $content.val() }
    })
  ).then(function(data){
      refreshsolution($solutionid,$list)
  })
})
})