WikiCategories = {
	0:"reference",
	1:"culture",
	2:"geography",
	3:"health",
	4:"history",
	5:"mathematics",
	6:"nature",
	7:"people",
	8:"philosophy",
	9:"religion",
	10:"society",
	11:"technology"
};

$(document).ready(function(){
	var SearchEntered = undefined,
			jsonQuery = true;

  //------Open a new window with a random article of wikipedia
  $("#random").on({
  	'click': function (){
  		function randomWiki(){
		  window.open("https://en.wikipedia.org/wiki/Special:RandomInCategory/"
		  			+ category);	
   		  $("#random").html("Somethin About");
		}
  		var category = WikiCategories[Math.floor(Math.random()*12)];
  		$("#random").html(category);
  		window.setTimeout(randomWiki,1000); 		
  		}
  	});

  //--------highlight the autocomplet when press down/up arrows
  $(document).keyup(function (event){ 
    var highlight = $('div.highlight');
    		

    if (searchBox.value!="") {   
    	if (event.keyCode == 27) {
    		$("#search-autocomplete").css("display","none");
    	}else if (event.keyCode == 40 && jsonQuery) {
	  	  if (highlight.attr('class') == undefined) {
	  	  	//-----highlight the first result when there is no highlight
	  	  	SearchEntered = searchBox.value;
	  	    $('div.autocomplete').eq(0).addClass('highlight');
	  	    searchBox.value = $('div.autocomplete').eq(0).html(); 
	  	  } else{
	  	  		//-------highlight the div underneath highlight 
	  	      highlight.removeClass('highlight').next().addClass('highlight');
	  	      searchBox.value = highlight.next().html(); 
		      if (highlight.next().length == 0) {
		      	//-------unhighlight when is the last result highlighted
		        highlight.removeClass('highlight');
		        searchBox.value = SearchEntered;
		      }
	  		}	 
	  	     
	  } else if (event.keyCode === 38 && jsonQuery) {
	    	if (highlight.attr("class") == undefined) {
	    		//-----highlight the last result when there is no highlight 
	    		//-----and put the original search in the searchbox
	    		SearchEntered = searchBox.value;
	  		  $("div.autocomplete").eq(-1).addClass("highlight");
	  		  searchBox.value = $("div.autocomplete").eq(-1).html(); 
	  		} else{
	  			//-------highlight the div above highlight 
	  		  highlight.removeClass("highlight").prev().addClass("highlight");
	  		  searchBox.value = highlight.prev().html(); 
		      if (highlight.prev().length == 0) {
		      	//-------unhighlight when is the first result highlighted
		      	//-----and put the original search in the searchbox
		        highlight.removeClass("highlight");
		        searchBox.value = SearchEntered;
		      } 
	  		}	              
	    } else if (event.keyCode > 49 || event.keyCode===8 && event.keyCode!==13) {
	    	//-----unhighlight the divs when refresh the search when an autocomplete
	    	//------and put the new search in the searchbox
	    	highlight.removeClass("highlight");
	    	SearchEntered = searchBox.value;

	    	//-----mediaWiki API url
	    	var getTittles = "http://en.wikipedia.org/w/api.php?format=json"
										+"&action=query&generator=search&gsrlimit=4&gsrsearch="
										+ SearchEntered+"&callback=?"; 

				$.getJSON(getTittles, function(json) { 					
			      var count = 1;
			      console.log(json.query);

			      if (!json.query){
			      	$("#search-autocomplete").css("display","none");
			      	jsonQuery = false;
			      		
						} else{
							jsonQuery=true;
				      //----put content in auto-complete box
				      Object.keys(json.query.pages).forEach(function(key){
				      	$("#auto-"+count).html(json.query.pages[key].title);	
				      	count++;		      	
				      })
				    }			    
			  });	
			  if(searchBox.value!="" && jsonQuery){ 
			    	$("#search-autocomplete").css("display","block");
			  }
	    }
	  }		 
  });

   //-----change searchbox css  
  $("#searchBox").on({
  	'keyup': function (event){

  		if(this.value!=""){  			
  			$("#search-button").css("background-color", "#537691");
  			$("#clean-search").css("display", "block");
  			$("#clean-search").click(function(){
  				searchBox.value = "";
  				$("#search-button").css("background-color", "transparent");
  				$("#clean-search").css("display", "none");
  				$("#searchBox").focus();
  				$("#search-autocomplete").css("display","none");
  				$("div.highlight").removeClass("highlight");
  			});
  		} else{
  			$("#search-button").css("background-color", "transparent");
  			$("#clean-search").css("display", "none");  
  			$("#search-autocomplete").css("display","none");
  			$("div.highlight").removeClass("highlight");			
  		}
  		if (event.keyCode===13){
  			$("#search-autocomplete").css("display","block");
  		}
  	}
  }); 

  //--------highlight the autocomplet when put mouse over
  $("div.autocomplete").mouseover(  	
	  function() {
	  	$(".highlight").removeClass("highlight")
	    $(this).addClass("highlight");
	  }
	);
  $("div.autocomplete").mouseout(
	  function() {
	    $(this).removeClass("highlight");
	  }
	); 		

  //----submit the search form when click a suggestion to search
  $("div.autocomplete").on({  	
  	'click': function (){
  	  searchBox.value=$(this).html();
  	  $("#search-form").submit();
  	}
  });

  //Change the layout of the page when submit a search and shows the results
  $("#search-form" ).submit(function(event) { 
  	//-----mediaWiki API url results
	  var getResults = "http://en.wikipedia.org/w/api.php?format=json&action=query"
	  								+"&generator=search&gsrlimit=10&prop=extracts&exintro"
	  								+"&explaintext&exchars=100&exlimit=max&gsrsearch="
										+ searchBox.value+"&callback=?"; 
		$.getJSON(getResults, function(json) { 
      var counter=1;

      //----put content in auto-complete box
      Object.keys(json.query.pages).forEach(function(key){
      	$("#result-"+counter).html("<a href='https://en.wikipedia.org/wiki/"
      		+ json.query.pages[key].title
      		+"' target='_blank'><h1 class='result-tittle'>"
      		+json.query.pages[key].title
      		+"</h1><p class='result-text'>"
      		+json.query.pages[key].extract
      		+"</p></a>");
        counter++;     
      })	 
		});

  	event.preventDefault();
	  $("#results").css("display","block");
	  $("#results").css("margin-top",$("#search-container").css("height"));
	  $("#search-autocomplete").css("display","none");
	  $("#tittle").css("display","none");
	  $("#random").css("display","none");
	  $("#searchBox").blur();
	  $("#logo").css("display","none");
	  $(".wrapper").css("top","3%");
	}); 
});
