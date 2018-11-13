window.addEventListener('load', function() {
	var send_to = function(method, where, data, on_ok, on_err) {
		var req = new XMLHttpRequest();
		req.open(method, where, true);
		req.setRequestHeader('Content-type', 'application/json');
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				on_ok(req.responseText);
			} else if (req.status == 409) {
				on_err(req.responseText);
			} else {
				on_err('Bad response from server: ' + req.status + ' ' + req.statusText);
			}
		};
		if (data) {
			req.send();
		} else {
			req.send(JSON.stringify(data));
		}
	};
	var set_text = function(obj_id, str) {
		var obj = document.getElementById(obj_id);
		while (obj.firstChild) {
			obj.removeChild(obj.firstChild);
		}
		if (str) {
			obj.appendChild(document.createTextNode(str));
		}
	};
	var err_func = function(err) {
		set_text('err_msg', err);
	};
	var append_event = function(event_id, hosting) {
		var tab = document.getElementById('my_events_table');
		send_to('GET', '/api/events/' + event_id, null, function(json_str) {
			var evt = JSON.parse(json_str);
			if (! evt)
				return;
			var tr = document.createElement('tr');
			var td0 = document.createElement('td');
			var td1 = document.createElement('td');
			var td2 = document.createElement('td');
			var link = document.createElement('a');
			link.appendChild(document.createTextNode(evt.name));
			link.href = '/eventPage.html#' + event_id;
			td0.appendChild(link);
			td2.appendChild(document.createTextNode(hosting ? 'host' : 'participant'));
			tr.appendChild(td0);
			tr.appendChild(td1);
			tr.appendChild(td2);
			tab.appendChild(tr);
		}, err_func);
	};
	send_to('GET', '/api/me/id', null, function(my_id) {
		send_to('GET', '/api/accounts/' + my_id, null, function(json_str) {
			var obj = JSON.parse(json_str);
			if (! obj) {
				err_func('User does not exist');
			}
			set_text('f_username', obj.username);
			set_text('f_email', obj.email);
			if (obj.my_events.length == 0) {
				set_text('my_events_table', 'You are not yet part of any events');
			}
			for (var i in obj.my_events) {
				append_event(obj.my_events[i].event_id, obj.my_events[i].hosting);
			}
		}, err_func);
	}, err_func);
});
