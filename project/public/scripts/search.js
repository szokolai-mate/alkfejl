function search(term){
    $list = $(".projectlist")
    Promise.resolve(
    $.get("/ajax/search",{term : term} ))
    .then(function (data) {
        let string = ""
        data['projects'].forEach(i => {            
            string+=
            `<li class="list-item">
            <div class="`;
            
            if(i.ownitem==1){
                string+=" own-item "
            }
            string+=`">
            <a href="/show/`+ i.id +`">
            <div class="name">` + 
            i.title + 
            `</div>
            </a>
            <div class="description">`;
            i.description.forEach( line => {
                string+=line + "<br>";
            })
            string+=`</div>
            <div class="stats">
            <div class = "owner">
            <a href="/profile/` + i.ownerID + `">` + i.owner.displayName + `</a>
            </div>
            </div>
            </div>
            </li>`;

        } )
        $list2=$list
        $list2.html(string)
        $list.fadeOut("fast",function(){
        $list.replaceWith($list2)
        $list2.hide().fadeIn("fast")
        })

    })
    .catch(function (error) {
        console.log(error);
    })
}



$("#searchform").submit(function(e){
    e.preventDefault();

})

$("#searchterm").keyup(function(e){
    search($(this).val())
    }
)