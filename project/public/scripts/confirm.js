$("#deactivate").on('click',function(e){
    e.preventDefault()
    $modal = $("#modal")
    $modal.modal('show')
})

$("#deactivateConfirm").on('click',function(e){
    window.location.href = window.location.pathname + "/deactivate"
})