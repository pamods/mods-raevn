$('.chat_message_player_name').replaceWith('<span class="chat_message_player_name" data-bind="text: player_name, css: { team_chat_message_player_name: team }, style: { color: player_color }"></span>');

    handlers.chat_message = function (payload) {
        var date = new Date();
        var chat_message = payload;

		chat_message.player_color = "#fff";
        for (var i = 0; i < model.players().length-1; i++) {
	    if (model.players()[i].name == chat_message.player_name) {
	        chat_message.player_color = model.players()[i].color;
	    }
        }

        chat_message.timeStamp = date.getTime();
        model.chatLog.push(chat_message);
        model.visibleChat.push(chat_message);
	$(".div_chat_feed").scrollTop($(".div_chat_feed")[0].scrollHeight);
        $(".div_chat_log_feed").scrollTop($(".div_chat_log_feed")[0].scrollHeight);
    };