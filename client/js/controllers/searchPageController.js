window.addEventListener('load', function() {
	var get_events = function(on_ok, on_err) {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/events', true);
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				var res = JSON.parse(req.responseText);
				if (res.length == 0) {
					on_err('Your search returned no results');
				} else {
					on_ok(res);
				}
			} else if (req.status == 409) {
				on_err(req.responseText);
			} else {
				on_err('Bad response from server: ' + req.status + ' ' + req.statusText);
			}
		};
		req.send();
	};
	var set_text = function(obj, str) {
		while (obj.firstChild) {
			obj.removeChild(obj.firstChild);
		}
		if (str) {
			obj.appendChild(document.createTextNode(str));
		}
	};
	var set_text_id = function(obj_id, str) {
		set_text(document.getElementById(obj_id), str);
	};
	var make_on_click = function(_id) {
		return function() {
			window.location.href = '/eventPage.html#' + _id;
		};
	};
	var url_params = new URLSearchParams(window.location.search);
	var search_query = url_params.get('q');
	set_text_id('search_query', search_query);
	document.getElementsByName('q')[0].value = search_query;
	var table_main = document.getElementById('table_main');
	var row_main = document.getElementById('row_main');
	get_events(function(evts) {
		for (var i = 0; i < evts.length; ++i) {
			var new_row = row_main.cloneNode(true);
			new_row.style.display = 'block';
			new_row.addEventListener('click', (function(_id) {
				return function() {
					window.location.href = '/eventPage.html#' + _id;
				}
			})(evts[i]._id));
			var spans = new_row.getElementsByTagName('span');
			set_text(spans[0], evts[i].name);
			new_row.getElementsByTagName('img').src = evts[i].image;
			//.getElementById('searchImg').src = evts[i].image;
			var d = new Date(evts[i].date);
			set_text(spans[1], d.toDateString());
			set_text(spans[2], evts[i].time);
			set_text(spans[3], evts[i].location);
			set_text(spans[4], evts[i].gamesavailable);
			table_main.appendChild(new_row);
		}
	}, function(err) {
		set_text_id('err_msg', err);
	});
});
