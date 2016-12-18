$("article").each(function(){
    $height=0
    if($(this).siblings("input").attr("checked")){
    $(this).children().each(function(){
        $height+=$(this).height()
    })
    $(this).css({'height': $height})
    }

    $("body").find("label.tab").on("click",function(e){
        e.preventDefault()
        $article=$(this).siblings("article").first()
        $height=0
        $article.children().each(function(){
            $height+=$(this).height()
        })

        if($article.css('height') > '0px'){
            $article.css({'height': '0px'})
        }
        else{
            $article.css({'height': $height+20})
        }
    })
})

$(".tab-link").on("click",function(){
    window.location.replace($(this).parents("a").first().attr("href"))
})


$("article").on('transitionend webkitTransitionEnd oTransitionEnd',function(){
    if($(this).css('height') > '0px'){
    $height=0
        $(this).children().each(function(){
          $height+=$(this).height()
    })
     $(this).css({'height': $height+20})
    }
})
