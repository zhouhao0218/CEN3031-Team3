window.addEventListener('load', function() {
	var removeAllChildren = function(o) {
		while (o.firstChild) {
			o.removeChild(o.firstChild);
		}
	};
	var err_func = function(err) {
		var o = document.getElementById('error');
		removeAllChildren(o);
		if (err) {
			o.appendChild(document.createTextNode(err));
		}
	};
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
	var make_onclick_for = function(obj_id, api_name, look_for) {
		return function() {
			send_to('DELETE', '/api/' + api_name + '/' + obj_id, null, function() {
				engine(api_name, look_for);
			}, err_func);
		};
	};
	var put_col = function(tr, text) {
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(text));
		tr.appendChild(td);
	}
	var out = document.getElementById('output');
	var parse_data = function(arr, api_name, look_for) {
		removeAllChildren(out);
		(function() {
			var tr = document.createElement('tr');
			put_col(tr, '~');
			for (var k in look_for) {
				put_col(tr, '|' + look_for[k] + '|');
			}
			out.appendChild(tr);
		})();
		for (var i = 0; i < arr.length; ++i) {
			var tr = document.createElement('tr');
			var obj = arr[i];
			var del_link_td = document.createElement('td');
			var del_link = document.createElement('a');
			del_link.href = '#';
			del_link.style.color = 'blue';
			del_link.appendChild(document.createTextNode('(delete)'));
			del_link.addEventListener('click', make_onclick_for(obj._id, api_name, look_for));
			del_link_td.appendChild(del_link);
			tr.appendChild(del_link_td);
			for (var k in look_for) {
				put_col(tr, obj[look_for[k]]);
			}
			out.appendChild(tr);
		}
	};
	function engine(name, look_for) {
		send_to('GET', '/api/' + name, null, function(msg) {
			parse_data(JSON.parse(msg), name, look_for);
			err_func();
		}, err_func);
	};
	document.getElementById('evt_btn').addEventListener('click', function() {
		engine('events', ['created_at', 'name', 'date', 'time']);
	});
	document.getElementById('acct_btn').addEventListener('click', function() {
		engine('accounts', ['created_at', 'username', 'email']);
	});
});
