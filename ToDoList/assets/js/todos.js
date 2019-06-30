//check off specific todos by clicking

//we can only use the element that exist
//therefore we need to add listener to the parent element
$('ul').on("click","li", function(){
	//if li is gray
	$(this).toggleClass("completed");
});

//click on X to delete Todo

$("ul").on("click","span",function(){
	//make the parent in <div> removes
	$(this).parent().fadeOut(500, function() {
		//fade out first, then remove the <ul>
		$(this).remove();
	});
	//won't cause the effect in <ul>
	event.stopPropagation();
});


$("input[type ='text']").keypress(function(event){
	if (event.which === 13){
		//grabbing new todo text from input
		var todoText = $(this).val();
		//make the input box to be empty when enetered
		$(this).val("")
		//create a new li and add to ul
		$("ul").append("<li> <span><i class='fas fa-trash-alt'></i></span> "+todoText+"</li>")
	}
});


$(".fa-plus").click(function(){
	$("input[type ='text']").fadeToggle(100);
})