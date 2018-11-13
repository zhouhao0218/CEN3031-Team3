window.addEventListener('load', function() {
	var logged_in = false;
	var toggle = function() {
		var container = document.getElementById('iframe_container');
		if (container.style.display == 'block') {
			container.style.display = 'none';
		} else if (! logged_in) {
			container.style.display = 'block';
		}
	};
	var set_click_for = function(obj_id) {
		document.getElementById(obj_id).addEventListener('click', toggle);
	};
	document.getElementById('iframe_container_close_btn').addEventListener('click', function() {
		window.location.reload();
	});
	set_click_for('login_link');
	set_click_for('register_link');
	var set_text = function(obj_id, str) {
		var obj = document.getElementById(obj_id);
		while (obj.firstChild) {
			obj.removeChild(obj.firstChild);
		}
		if (str) {
			obj.appendChild(document.createTextNode(str));
		}
	};
	(function() {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/am-i-logged-in', true);
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				set_text('login_link');
				set_text('register_link', req.responseText);
				logged_in = true;
			}
		};
		req.send();
	})();
});
