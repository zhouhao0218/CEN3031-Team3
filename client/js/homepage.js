window.addEventListener('load', function() {
	var get_events = function(on_ok, on_err) {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/events', true);
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
	var set_text = function(obj, str) {
		while (obj.firstChild) {
			obj.removeChild(obj.firstChild);
		}
		if (str) {
			obj.appendChild(document.createTextNode(str));
		}
	};
	var make_on_click = function(_id) {
		return function() {
			window.location.href = '/eventPage.html#' + _id;
		};
	};
	get_events(function(evts) {
		for (var i = 0; i < 3; ++i) {
			var card = document.getElementById('card' + (i + 1));
			if (evts[i]) {
				card.addEventListener('click', make_on_click(evts[i]._id));
				var evt_name = card.getElementsByTagName('b')[0];
				var evt_date = card.getElementsByTagName('p')[0];
				set_text(evt_name, evts[i].name);
				var d = new Date(evts[i].date);
				set_text(evt_date, d.toDateString());
			} else {
				card.parentNode.removeChild(card);
			}
		}
	}, function(err) {
		console.log(err);
	});
	card1.getElementsByTagName('img');
	
});
