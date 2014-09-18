var busPositions1  = new Array();
var busPositions2  = new Array();
var busPositions3  = new Array();
var busPositions4  = new Array();
var busPosition = null;
var busMarker = null;

//地図を作成する
function createMap(){
	var homex = 136.8774;
	var homey = 36.55797;
	//五箇山合掌の里をとりあえず中心地点にする
  if (! navigator.geolocation) {
		var position = new google.maps.LatLng(homey,homex);
  } else {
    navigator.geolocation.getCurrentPosition(function(pos) {
        // gps 取得成功
        // google map 初期化
        var gmap = new google.maps.Map($('#gmap').get(0), {
            center: new google.maps.LatLng(35, 135),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 17
        });
 
        // 現在位置にピンをたてる
				var position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				homey = pos.coords.latitude;
				homex = pos.coords.longitude;
 
        // 現在地にスクロールさせる
        gmap.panTo(position);

    }, function() {
			var position = new google.maps.LatLng(homey,homex);
    });

	}

	//地図の作成
	var options = {
		zoom: 13,
		center: position,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById('map'), options);

	var busstopicon = new google.maps.MarkerImage(
			'img/bus.png', null, null,
			new google.maps.Point( 8, 8 ),
			new google.maps.Size( 30, 30 )
		);

	//バス停マーカーの作成	
	csvToArray("data/busstop.csv", function(tmp) {
        tmp.shift();
        for (var i in tmp) {
            var row = tmp[i];
            var position = new google.maps.LatLng(row[11], row[10]);
            var content = "<p style=\width:50;\">" + row[1] + "</p>";
            content = content + row[3];
            var marker = new google.maps.Marker({
            	position: position,
            	map: map,
	        		icon: new  google.maps.MarkerImage( row[5], null, null, new google.maps.Point( 8, 8 ), new google.maps.Size( 30, 30 )),
            	title: row[0],
            	content: content
            });
            //infoWindow.open(map, marker);
            
            // クリックしたときに情報ウィンドウを表示するイベントを追加する
            google.maps.event.addListener(marker, 'click', function() {
            	showInfoWindow(this);
            });
        }
		
        var infoWindow = null;
        function showInfoWindow(obj) {
        	if(infoWindow) infoWindow.close();
        	infoWindow = new google.maps.InfoWindow({
						maxWidth: 250,
        		content: obj.content
        	});
        	infoWindow.open(map, obj);
        }
	});
	
	//現在地のマーカーの作成
	//GPSの設定
	var geoOptions = {
		enableHighAccuracy: true,
		timeout: 60000,
		maximumAge: 0
	};

	var image = new google.maps.MarkerImage(
			'img/marker.png', null, null,
			new google.maps.Point( 8, 8 ),
			new google.maps.Size( 17, 17 )
		);

	var currMarker = new google.maps.Marker({
		position: new google.maps.LatLng(35, 135),
		map: map,
		icon: image,
		optimized: false,
		title: 'marker'
	});

	navigator.geolocation.getCurrentPosition(function(position) {
		var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		currMarker.setPosition(latlng);
	}, null, geoOptions);

	$('div.gmnoprint[title="marker"]').addClass('pulse');
	
	// バスを動かす
	var busMarkerImage1 = new google.maps.MarkerImage(
			'img/bus1.png', null, null,
			new google.maps.Point( 8, 8 ),
			new google.maps.Size( 32, 32 )
		);
	var busMarkerImage2 = new google.maps.MarkerImage(
			'img/bus2.png', null, null,
			new google.maps.Point( 8, 8 ),
			new google.maps.Size( 32, 32 )
		);
	var busMarkerImage3 = new google.maps.MarkerImage(
			'img/bus3.png', null, null,
			new google.maps.Point( 8, 8 ),
			new google.maps.Size( 32, 32 )
		);
	var busMarkerImage4 = new google.maps.MarkerImage(
			'img/bus1.png', null, null,
			new google.maps.Point( 8, 8 ),
			new google.maps.Size( 32, 32 )
		);
/*
	var busMarker1 = new google.maps.Marker({
		position: new google.maps.LatLng(homey, homex),
		map: map,
		icon: busMarkerImage1,
		optimized: false,
		title: 'bus'
	});
	var busMarker2 = new google.maps.Marker({
		map: map,
		icon: busMarkerImage2,
		optimized: false,
		title: 'bus'
	});
	var busMarker3 = new google.maps.Marker({
		map: map,
		icon: busMarkerImage3,
		optimized: false,
		title: 'bus'
	});
	var busMarker4 = new google.maps.Marker({
		map: map,
		icon: busMarkerImage4,
		optimized: false,
		title: 'bus'
	});
*/
	map.setCenter(new google.maps.LatLng(homey,homex));
	
	csvToArray("data/keiro.csv", function(tmp) {
        for (var i in tmp) {
            var row = tmp[i];
            busPosition = new google.maps.LatLng(row[1], row[0]);
            busPositions1.push(busPosition);
            busPositions2.push(busPosition);
            busPositions3.push(busPosition);
            busPositions4.push(busPosition);
        }
	});
/*
	console.dir(busPositions1);
	console.dir(busPositions2);
	console.dir(busPositions3);
	console.dir(busPositions4);
	
	setTimeout(moveBus, 3000, new Array(busPositions1, busMarker1));
	setTimeout(moveBus, 8000, new Array(busPositions2, busMarker2));
	setTimeout(moveBus, 12000, new Array(busPositions3, busMarker3));
	setTimeout(moveBus, 15000, new Array(busPositions4, busMarker4));
*/
	
	function moveBus(args) {
		var busPositions = args[0];
		var busMarker = args[1];
		console.dir(busPositions);
		console.dir(busPositions.length);
		var busPosition = busPositions.shift();
		console.dir(busPosition);
		if(busPosition !== undefined) {
			setTimeout(moveBus, 500, args);			
		}
		busMarker.setPosition(busPosition);
	}
	
}


function csvToArray(filename, cb) {
    $.get(filename, function(csvdata) {
      //CSVのパース
       csvdata = csvdata.replace(/\r/gm, "");
      var line = csvdata.split("\n"),
          ret = [];
      for (var i in line) {
        //空行はスルーする。
        if (line[i].length == 0) continue;

        var row = line[i].split(",");
        ret.push(row);
      }
      cb(ret);
    });
}


function wait_request(form){
	ret = confirm("バスに「乗ります！」を送信しますか？");
	if(ret == true){
		window.alert("送信しました。バス内投票を開始します！");
//		document.getElementById('firstBox').style.display="none";
//		document.getElementById('secondBox').style.display="";
//		document.getElementById('thirdBox').style.display="";
		window.location.href = 'thanks.html';
	}
}

function kakunin(btnNo){
	if(btnNo == 1){
		window.alert("何かしらアクションがある予定です!ありがとうの場合");
	}else{
		window.alert("何かしらアクションがある予定です！残念の場合");
	}
}
