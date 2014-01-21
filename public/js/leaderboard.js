var start = 0; var loaded = false;

$(document).ready(function(){

	function update(start) {
		$.post('/leaderboard', {start:start}, function(data){
			var obj = JSON.parse(data);
			if(obj.hasOwnProperty('results'))
				if(!obj.results.length){
					loaded = true;
					$('#loading-alert').hide();
					$('#loaded-alert').show();
				}
				else{
					$('#score-table-template').tmpl(obj.results).appendTo('#score-table tbody');
					$('#loaded-alert').hide();
					$('#loading-alert').show();
				}
		});
	}

	if(typeof topbar != 'undefined' && topbar != null){
		topbar.showTopbar();
	}
	update();
	
	$(window).scroll(function() { 
		
		if($(window).scrollTop() + $(window).height() == $(document).height()) { 
			if(!loaded){
				start += 15;
				update(start);
			}
		}
	});
});



