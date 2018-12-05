var showResults = debounce(function(arg){
  var value = arg.trim();
  if(value == "" || value.length <= 0){
    $("#search-results").fadeOut();
    return;
  }
  else{
    $("#search-results").fadeIn();
  };
  var jqxhr = $.get('/xhr/search?q=' + value, function(data){
    $("#search-results").html("");
  })
  .done(function(data){
    if(data.length === 0){
      $("#search-results").append('<p>No Results</p>');
    } else {
      console.table(data);
      $("#search-results").append('<p class="text-center m-0 lead">Events:</p>');
      data.quotesArray.forEach(x => {
        $("#search-results").append('<a href="#">' + x.name + '</a>')
      });
    }
  })
  .fail(function(err){
    console.log(err);
  })
}, 300);

function debounce(func, wait, immediate){
  var timeout;
  return function(){
    var context = this,
      args = arguments;
    var later = function(){
      timeout = null;
      if(!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if(callNow) func.apply(context, args);
  };
};
