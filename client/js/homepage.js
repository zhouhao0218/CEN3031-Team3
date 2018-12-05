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
	var matches_filter = function(evt, filter) {
		filter = filter.toLowerCase();
		if (evt.name.toLowerCase().includes(filter))
			return true;
		if (evt.location.toLowerCase().includes(filter))
			return true;
		if (evt.gamesavailable.toLowerCase().includes(filter))
			return true;
		return false;
	};
	var all_cards = [];
	var find_with_filter = function(filter) {
		for (var i = 0; i < all_cards.length; ++i) {
			var obj = all_cards[i];
			while (obj.firstChild) {
				obj.removeChild(obj.firstChild);
			}
		}
		all_cards = [];
		get_events(function(evts) {
			var which_row = document.getElementById('events_new');
			var card_template = document.getElementById('template_card');
			for (var i = 0; i < 100; ++i) {
				if (! evts[i])
					continue;
				if (! matches_filter(evts[i], filter)) {
					continue;
				}
				var card = card_template.cloneNode(true);
				all_cards.push(card);
				card.style.display = 'block';
				card.addEventListener('click', make_on_click(evts[i]._id));
				var evt_name = card.getElementsByTagName('b')[0];
				var evt_date = card.getElementsByTagName('p')[0];
				card.getElementsByTagName('img')[0].src = evts[i].image;
				set_text(evt_name, evts[i].name);
				var d = new Date(evts[i].date);
				set_text(evt_date, d.toDateString());
				which_row.appendChild(card);
			}
		}, function(err) {
			console.log(err);
		});
	};
	find_with_filter('');
	document.getElementById('search_bar').addEventListener('keydown', function(e) {
		if (e.keyCode == 10 || e.keyCode == 13) {
			find_with_filter(e.target.value);
		}
	});
});
