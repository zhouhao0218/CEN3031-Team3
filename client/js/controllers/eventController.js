window.addEventListener('load', function() {
	var set_text = function(obj_id, str) {
		var obj = document.getElementById(obj_id);
		while (obj.firstChild) {
			obj.removeChild(obj.firstChild);
		}
		if (str) {
			var txt = document.createTextNode(str);
			obj.appendChild(txt);
		}
	};
	var try_submit_form = function(on_ok, on_err) {
		var new_name = document.getElementById('new_name').value;
		var new_date = document.getElementById('new_date').value;
		var new_time = document.getElementById('new_time').value;
		var new_location = document.getElementById('new_location').value;
		var new_game = document.getElementById('new_game').value;
		if (! (new_name && new_date && new_time && new_location && new_game)) {
			on_err('Please fill out all fields');
			return;
		}
		var req = new XMLHttpRequest();
		req.open('POST', '/api/events', true);
		req.setRequestHeader('Content-type', 'application/json');
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				on_ok(JSON.parse(req.responseText));
			} else if (req.status == 409) {
				on_err(req.responseText);
			} else {
				on_err('Bad response from server: ' + req.status + ' ' + req.statusText);
			}
		};
		var o = {
			name: new_name,
			date: new_date,
			time: new_time,
			gamesavailable: new_game,
			location: new_location,
		};
		req.send(JSON.stringify(o));
	};
	document.getElementById('create_evt_btn').addEventListener('click', function() {
		try_submit_form(function(evt) {
			set_text('form-body', 'Event created !  ');
			var link = document.createElement('a');
			link.appendChild(document.createTextNode('(click here to view)'));
			document.getElementById('form-body').appendChild(link);
			link.href = '/eventPage.html#' + evt._id;
			set_text('form_err');
		}, function(err) {
			set_text('form_err', err);
		});
	});
	(function() {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/me/username', true);
		req.setRequestHeader('Content-type', 'application/json');
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status != 200) {
				set_text('form-body', 'Please login first to create events !');
			}
		};
		req.send();
	})();
});
