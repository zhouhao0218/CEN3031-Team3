window.addEventListener('load', function() {
	var send_to = function(method, where, what, on_ok, on_err) {
		var req = new XMLHttpRequest();
		req.open(method, where, true);
		req.setRequestHeader('Content-type', 'application/json');
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				on_ok(req.responseText);
			} else {
				on_err('Bad response from server: ' + req.status + ' ' + req.statusText);
			}
		};
		if (what) {
			req.send(JSON.stringify(what));
		} else {
			req.send();
		}
	};
	var out = document.getElementById('output');
	var set_text = function(str) {
		while (out.firstChild) {
			out.removeChild(out.firstChild);
		}
		if (str) {
			var txt = document.createTextNode(str);
			out.appendChild(txt);
		}
	};
	var make_onclick_for = function(obj_id, api_name) {
		return function() {
			send_to('DELETE', '/api/' + api_name + '/' + obj_id, null, function() {
				engine(api_name);
			}, set_text);
		};
	};
	var parse_data = function(arr, del_allowed, api_name) {
		set_text();
		for (var i = 0; i < arr.length; ++i) {
			var obj = arr[i];
			out.appendChild(document.createTextNode(obj._id + '  '));
			if (del_allowed) {
				var del_link = document.createElement('a');
				del_link.href = '#';
				del_link.style.color = 'blue';
				del_link.appendChild(document.createTextNode('(delete)'));
				del_link.addEventListener('click', make_onclick_for(obj._id, api_name));
				out.appendChild(del_link);
			}
			out.appendChild(document.createElement('br'));
			var ul = document.createElement('ul');
			for (var key in obj) {
				var li = document.createElement('li');
				var txt = key + ': ' + obj[key];
				li.appendChild(document.createTextNode(txt));
				ul.appendChild(li);
			}
			out.appendChild(ul);
		}
	};
	function engine(name) {
		var del_allowed = name != 'games';
		send_to('GET', '/api/' + name, null, function(msg) {
			parse_data(JSON.parse(msg), del_allowed, name);
		}, set_text);
	};
	document.getElementById('evt_btn').addEventListener('click', function() {
		engine('events');
	});
	document.getElementById('acct_btn').addEventListener('click', function() {
		engine('accounts');
	});
	document.getElementById('game_btn').addEventListener('click', function() {
		engine('games');
	});
});
