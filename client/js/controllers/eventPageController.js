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
	var get_event = function(_id, on_ok, on_err) {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/events/' + _id, true);
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
		req.send();
	};
	var register_for_event = function(_id, on_ok, on_err) {
		var req = new XMLHttpRequest();
		req.open('PATCH', '/api/events/' + _id, true);
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				on_ok();
			} else if (req.status == 409) {
				on_err(req.responseText);
			} else {
				on_err('Bad response from server: ' + req.status + ' ' + req.statusText);
			}
		};
		req.send();
	};
	if (window.location.hash) {
		var _id = window.location.hash.substr(1);
		get_event(_id, function(obj) {
			set_text('f_name', obj.name);
			var d = new Date(obj.date);
			set_text('f_date', d.toDateString());
			set_text('f_time', obj.time);
			set_text('f_location', obj.location);
			set_text('f_games', obj.gamesavailable);
		}, function(err) {
			set_text('f_name', err);
		});
		document.getElementById('register_btn').addEventListener('click', function() {
			register_for_event(_id, function() {
				set_text('register_btn_container', 'Registered');
			}, function(err) {
				set_text('register_btn_container', err);
			});
		});
	} else {
		set_text('f_name', 'No game specified');
	}
});
