model.scrubToTime = function () {
	console.log("test");
	var event = window.event;
	var time = ((event.screenX - $('.div_time_progress_frame').offset().left) / 384) * model.endOfTimeInSeconds();
	api.time.set(Number(time));
}

$('.div_time_progress_frame').mousedown(function() { model.scrubToTime()});