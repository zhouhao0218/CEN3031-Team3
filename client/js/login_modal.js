window.addEventListener('load', function() {
	var send_logout = function() {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/me/logout', true);
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				logged_in = false;
				window.location.reload();
			}
		};
		req.send();
	};
	var logged_in = false;
	var my_username = '';
	var toggle = function(e) {
		var container = document.getElementById('iframe_container');
		if (container.style.display == 'block') {
			container.style.display = 'none';
		} else if (logged_in) {
			if (e.target.href && e.target.href.substr(e.target.href.indexOf('#')) === '#logout') {
				send_logout();
			} else if (my_username === 'admin') {
				window.location.href = './admin.html';
			} else {
				window.location.href = './myAccount.html';
			}
		} else {
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
	var set_text = function(obj_id, str, h) {
		var obj = document.getElementById(obj_id);
		while (obj.firstChild) {
			obj.removeChild(obj.firstChild);
		}
		if (str) {
			obj.appendChild(document.createTextNode(str));
		}
		if (h) {
			obj.href = '#' + h;
		}
	};
	(function() {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/me/username', true);
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				set_text('login_link', 'Logout', 'logout');
				my_username = req.responseText;
				set_text('register_link', my_username);
				logged_in = true;
			}
		};
		req.send();
	})();
});
