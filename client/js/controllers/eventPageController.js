window.addEventListener('load', function() {
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
	
	if (window.location.hash) {
		var evt_id = window.location.hash.substr(1);
		get_event(evt_id, function(obj) {
			set_text('f_name', obj.name);
			var d = new Date(obj.date);
			set_text('f_date', d.toDateString());
			set_text('f_time', obj.time);
			set_text('f_location', obj.location);
			set_text('f_games', obj.gamesavailable);
			change_addr(obj.location);
		}, function(err) {
			set_text('f_name', err);
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
