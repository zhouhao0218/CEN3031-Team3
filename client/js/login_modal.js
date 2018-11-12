window.addEventListener('load', function() {
	var toggle = function() {
		var container = document.getElementById('iframe_container');
		if (container.style.display == 'block') {
			container.style.display = 'none';
		} else {
			container.style.display = 'block';
		}
	};
	var set_click_for = function(obj_id) {
		document.getElementById(obj_id).addEventListener('click', toggle);
	};
	set_click_for('iframe_container_close_btn');
	set_click_for('login_link');
	set_click_for('register_link');
});
