window.addEventListener('load', function() {
	var set_text_of = function(obj, str) {
		while (obj.firstChild) {
			obj.removeChild(obj.firstChild);
		}
		if (str) {
			var txt = document.createTextNode(str);
			obj.appendChild(txt);
		}
	};
	var set_text = function(obj_id, str) {
		var obj = document.getElementById(obj_id);
		set_text_of(obj, str);
	};
	var get_event = function(_id, on_ok, on_err) {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/events/' + _id, true);
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
	var get_roles = function(_id, on_ok, on_err) {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/events/roles/' + _id, true);
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
	var register_for_event = function(evt_id, on_ok, on_err) {
		var req = new XMLHttpRequest();
		req.open('POST', '/api/roles/', true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				on_ok();
			} else if (req.status == 409) {
				on_err(req.responseText);
			} else {
				on_err('Bad response from server: ' + req.status + ' ' + req.statusText);
			}
		};
		req.send(JSON.stringify({
			event : evt_id
		}));
	};
	var save_event = function(_id, o, cb) {
		var req = new XMLHttpRequest();
		req.open('PUT', '/api/events/' + _id, true);
		req.setRequestHeader('Content-type', 'application/json');
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			cb();
		};
		req.send(JSON.stringify(o));
	};
	var get_name = function(_id, on_ok) {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/accounts/' + _id, true);
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				on_ok(req.responseText);
			}
		};
		req.send();
	};
	var amihost = function(_id, yes) {
		var req = new XMLHttpRequest();
		req.open('GET', '/api/events/amihost/' + _id, true);
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			if (req.status == 200) {
				yes();
			}
		};
		req.send();
	};
	var delete_event = function(_id, cb) {
		var req = new XMLHttpRequest();
		req.open('DELETE', '/api/events/' + _id, true);
		req.onreadystatechange = function() {
			if (req.readyState != 4)
				return;
			cb();
		};
		req.send();
	};
	if (window.location.hash) {
		var evt_id = window.location.hash.substr(1);
		get_event(evt_id, function(obj) {
			set_text('f_name', obj.name);
			var d = new Date(obj.date);
			set_text('f_date', d.toDateString());
			set_text('f_time', obj.time);
			set_text('f_location', obj.location);
			set_text('f_games', obj.gamesavailable);
			document.getElementById("f_image").src = obj.image;
			change_addr(obj.location);
		}, function(err) {
			set_text('f_name', err);
		});
		get_roles(evt_id, function(obj) {
			var who_going = obj.length - 1;
			var noun = (who_going == 1) ? ' person' : ' people';
			set_text('f_numgoing', who_going + noun);
			for (var i = 0; i < obj.length; ++i) {
				if (obj[i].host) {
					get_name(obj[i].user, function(name) {
						set_text('f_host', name);
					});
				} else {
					var el = document.getElementById('f_going');
					get_name(obj[i].user, function(name) {
						el.appendChild(document.createTextNode(name + '; '));
					});
				}
			}
		}, function(err) {
			set_text('f_name', err);
		});
		amihost(evt_id, function() {
			document.getElementById('edit_evt_btn').style.display = 'block';
			document.getElementById('delete_evt_btn').style.display = 'block';
		});
		var toggle = false;
		var my_inputs = [];
		document.getElementById('edit_evt_btn').addEventListener('click', function() {
			toggle = ! toggle;
			var to_edit = ['f_name', 'f_date', 'f_time', 'f_location', 'f_games'];
			if (toggle) {
				set_text_of(document.getElementById('edit_evt_btn').getElementsByTagName('a')[0], 'Save Event');
				for (var objid_i in to_edit) {
					var objid = to_edit[objid_i];
					var obj = document.getElementById(objid);
					var iel = document.createElement('input');
					iel.type = 'text';
					iel.style.width = '30%';
					iel.style.padding = '0';
					iel.value = obj.innerText;
					set_text(objid);
					obj.appendChild(iel);
					my_inputs.push(iel);
				}
			} else {
				set_text('edit_evt_btn');
				set_text('delete_evt_btn');
				var something = {
					name : my_inputs[0].value,
					date : my_inputs[1].value,
					time : my_inputs[2].value,
					location : my_inputs[3].value,
					gamesavailable : my_inputs[4].value,
					image : document.getElementById('f_image').src,
				};
				save_event(evt_id, something, function() {
					window.location.reload();
				}, function(err) {
					set_text('register_btn_container', err);
				});
			}
		});
		document.getElementById('delete_evt_btn').addEventListener('click', function() {
			if (confirm('Are you sure you want to delete?')) {
				delete_event(evt_id, function() {
					window.location.href = '/'; 
				});
			}
		});
		document.getElementById('register_btn').addEventListener('click', function() {
			register_for_event(evt_id, function() {
				set_text('register_btn_container', 'Registered');
			}, function(err) {
				set_text('register_btn_container', err);
			});
		});
	} else {
		set_text('f_name', 'No game specified');
	}
	
	function change_addr(address) {
      	var geocoder = new google.maps.Geocoder();

		geocoder.geocode( { 'address': address}, function(results, status) {

  			if (status == google.maps.GeocoderStatus.OK) {
    			var latitude = results[0].geometry.location.lat();
    			var longitude = results[0].geometry.location.lng();

    			var myLatLng = {lat: latitude, lng: longitude};

        		var map = new google.maps.Map(document.getElementById('map'), {
         			zoom: 16,
         			center: myLatLng
       			});

        		var marker = new google.maps.Marker({
          			position: myLatLng,
          			map: map,
         			title: address
        		});
 			}
		});

    }
});


function initMap() {

    var geocoder = new google.maps.Geocoder();

	var address = "the standard gainesville fl"; // change me

	geocoder.geocode( { 'address': address}, function(results, status) {

  		if (status == google.maps.GeocoderStatus.OK) {
    		var latitude = results[0].geometry.location.lat();
    		var longitude = results[0].geometry.location.lng();

    		var myLatLng = {lat: latitude, lng: longitude};

        	var map = new google.maps.Map(document.getElementById('map'), {
         		zoom: 16,
         		center: myLatLng
       		});

        	var marker = new google.maps.Marker({
          		position: myLatLng,
          		map: map,
         		title: 'Hello World!'
        	});
 		} 
	}); 
    
}
