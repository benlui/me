// JavaScript Document
function generatePlayers(min, max) {
	let result = [];
	for (var i = min; i <= max; i++) {
		result.push(i.toString());
	}
	return result;
}

function initData(min, max, excludeList) {
	let results = generatePlayers(min, max); // min, max
	console.log(`players(count:${results.length}):`, results);
	console.log(`excludeList(count:${excludeList.length}):`, excludeList);

	results =  results.filter(function(item) {
		return excludeList.indexOf(item) === -1;
	});
	console.log(`result->players(count:${results.length}):`, results);
	return results;
}

$(document).ready(function () {	
	// ----------------------------------------------------------------------
	console.log('Prepare data | START');
	//player array
	// var players =['1','2','3','5','6','7','8','9','11','12','13','14','15','17','18','19','20','22','23','24','25','26','27','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','65','66','67','68','70','71','72','73','74','75','76','77','78','81','82','84','86','87','88','89','90','91','92','93','95','96','98','99','101','102','104','105','108','110','111','112','113','115','116','117','118','119','120','121','122','123','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','148','149','152','153','154','155','157','158','159','160','161','163','168','170'];
	var players = [];

	var titleTxt = 'ITS Christmas Party - Lucky Draw';
	var imgFile = 'public/images/P02.png';
	var totalDraw = 5;
	var nowRound = 0;
	
	var randomSpeed = 10;
	var randomTimeMin = 100;
	var randomTimeMax = 200;
	var delayTime = 500;

	
	var urlParams = new URLSearchParams(window.location.search);
	var inType = urlParams.get('type');
	var inMax = urlParams.get('max');
	console.log(`type:${inType}, max:${inMax}`);
	/** 
	 * init value by URL input
	 * type: <seat|null>
	 * max: <integer|null>
	 */
	if (inType === 'seat') {
		// dedicated for draw seating
		const MIN = 1;
		const MAX = (inMax && parseInt(inMax)) ? parseInt(inMax) : 11; // number of table
		const excludeList = ['2','3','4'];
		players = initData(MIN, MAX, excludeList);

		titleTxt = 'ITS Christmas Party - Draw your table number';
		imgFile = 'public/images/table.png';
		totalDraw = 1;
	} else {
		// default lucky draw
		const MIN = 1;
		const MAX = (inMax && parseInt(inMax)) ? parseInt(inMax) : 126; // number of staff
		players = generatePlayers(MIN, MAX); // min, max
		const excludeList = []; // <array> // ['4','10','16','21','28','29','35','41','46','52','57','63','68','73','79','84','90','95','100','106','111','117','122','128','133','138','143','149','154','159','164','169'];
		players = initData(MIN, MAX, excludeList);
	}

	// dynamic update content
	$("#title").html(titleTxt);
	$("#drawBoxImg").attr('src', imgFile);
	$("#total_draw").val(totalDraw);
	console.log('Prepare data | DONE');
	// ----------------------------------------------------------------------

    window.onbeforeunload = function () {
			return "No la~";
	}
	
	$('#draw').on('click', function(){
		lastTotalDraw=totalDraw;
		if(parseInt($("#total_draw").val()) > 0){
			totalDraw = parseInt($("#total_draw").val());			
		}else{
			alert("Error! 你估下咩事?");
			return;	
		}
		
		if(nowRound>=1){
			var result_record="Round "+nowRound+": ";
			for(i=1; i<=lastTotalDraw; i++){
				if($("#result"+i).html() != ""){
					result_record+=(i>1?", ":" ")+$("#result"+i).html();
				}
			}
			$("#show_results").append("<p>"+result_record+"</p>")
		}
		
		nowRound++;
		$("#round").html("Round "+nowRound);
		$("#draw").prop("disabled", true);
		$("#result_boxes").html("");
		for(i=1; i<=totalDraw; i++){
			$("#result_boxes").append('<div class="result" id="result'+i+'"> </div>');	
		}
		draw();
	});
	
	function draw(){		
		//alert(size);
		nowDraw=1;
		function start_draw(){
			var size = players.length;
			if(size==0){
				alert("完");
				return;	
			}
			//console.log(size); 
			//console.log(players); 
			var ran_time=1;
			var ran_total=Math.floor((Math.random() * randomTimeMax) + randomTimeMin);
			function ran(){
				var lucky_num=Math.floor((Math.random() * size)+1)-1;
				$("#drawBox").html(players[lucky_num]);
				if(ran_time++<ran_total){
					setTimeout(ran, randomSpeed);	
				}else{
					//console.log("lucky_num:"+lucky_num); 
					//console.log("Value:"+players[lucky_num]); 
					//console.log("nowDraw:"+nowDraw); 
					$("#result"+nowDraw).html(players[lucky_num]);	
					players.splice(lucky_num,1);
					if(nowDraw++<totalDraw){
						setTimeout(start_draw, delayTime);	
					}else{
						$("#draw").prop("disabled", false);
					}
				}
			}
			ran();
		}
		start_draw();
	}
});