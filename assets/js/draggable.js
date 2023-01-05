$( ".card" ).draggable({
    revert: true,
    cursor: 'move'
});
$('.ui-droppable').droppable({
    accept: '#cardPile div',
    drop: handleCardDrop
})

function handleCardDrop(event, ui){
    var slotNumber = $(this).attr('id')
    var cardNumber = ui.draggable.attr('class')
    if(cardNumber.includes(slotNumber)) {
        ui.draggable.addClass( 'correct' );
        ui.draggable.draggable( 'disable' );
        $(this).droppable( 'disable' );
        $(this).css("opacity","0");
        ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
        ui.draggable.draggable( 'option', 'revert', false );
        if( $('.game-body').is(":visible")){
            $('#bgmodal-passou').modal('show')
        }
    }else if($('.game-body').is(":visible")){
        $('#bgmodal-errou').modal('show')
    }
}