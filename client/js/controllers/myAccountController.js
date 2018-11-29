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
		set_text('everything');
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
	send_to('GET', '/api/me/email', null, function(my_email) {
		set_text('f_email', my_email);
	}, err_func);
	send_to('GET', '/api/me/username', null, function(my_username) {
		set_text('f_username', my_username);
	}, err_func);
	send_to('GET', '/api/me/events', null, function(my_evts_json) {
		var my_evts = JSON.parse(my_evts_json);
		if (!my_evts || my_evts.length == 0) {
			set_text('my_events_table', 'You are not part of any events');
			return;
		}
		for (var i in my_evts) {
			append_event(my_evts[i].event, my_evts[i].host);
		}
	}, err_func);
	//append_event(event_id, hosting);

});
