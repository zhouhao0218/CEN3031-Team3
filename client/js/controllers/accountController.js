window.addEventListener('load', function() {
	var send_to = function(method, where, what, on_ok, on_err) {
		var req = new XMLHttpRequest();
		req.open(method, where, true);
		req.setRequestHeader('Content-type', 'application/json');
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				on_ok();
			} else if (req.status == 406) {
				on_err(req.responseText);
			} else {
				on_err('Bad response from server: ' + req.status + ' ' + req.statusText);
			}
		};
		req.send(JSON.stringify(what));
	};
	var validate_login = function(on_ok, on_err) {
		var f_email = document.getElementById('f_email').value;
		var f_password = document.getElementById('f_password').value;
		if (! (f_email && f_password)) {
			on_err('Both email and password required');
			return;
		}
		var data = {
			email: f_email,
			password: f_password,
		};
		send_to('PUT', '/api/accounts', data, on_ok, on_err);
	};
	var validate_register = function(on_ok, on_err) {
		var f_username = document.getElementById('r_username').value;
		var f_email = document.getElementById('r_email').value;
		var f_password = document.getElementById('r_password').value;
		var f_password_again = document.getElementById('r_password_again').value;
		if (! (f_username && f_email && f_password && f_password_again)) {
			on_err('Please fill out all fields');
			return;
		}
		if (f_password != f_password_again) {
			on_err('Passwords do not match');
			return;
		}
		var data = {
			username: f_username,
			email: f_email,
			password: f_password,
		};
		send_to('POST', '/api/accounts', data, on_ok, on_err);
	};
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
	document.getElementById('sign_up_btn').addEventListener('click', function() {
		validate_register(function() {
			set_text('form-body', 'Registration Successful !');
		}, function(err) {
			set_text('form_err', err);
		});
	});
	document.getElementById('log_in_btn').addEventListener('click', function() {
		validate_login(function() {
			set_text('form-body', 'Login Successful !');
		}, function(err) {
			set_text('form_err', err);
		});
	});
});
