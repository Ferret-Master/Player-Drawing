//flubbs one did not fit my needs so writing my own

//will be replacing handlers.chat_message

//going to hardcode the 3 checks needed

//this is no longer present on modload so is re declared here
function ChatMessageModel(object) {
    var self = this;

    self.type = object.type ? object.type : "global";
    self.isGlobal = ko.computed(function () {
        return self.type === "global";
    });
    self.isTeam = ko.computed(function () {
        return self.type === "team";
    });
    self.isServer = ko.computed(function () {
        return self.type === "server";
    });

    self.message = object.message ? object.message : "";
    self.player_name = object.player_name ? object.player_name : "";

    if (self.isServer()) {
        self.message = loc(self.message, { 'player': self.player_name });
        self.player_name = "server";
    }

    self.time_stamp = new Date().getTime();
}

handlers.chat_message = function (payload) {
    var chat_message = new ChatMessageModel(payload);
    var msg = chat_message.message
    if(msg.startsWith('Drawing:')){
        msg = msg.replace('Drawing:','');
        api.Panel.message(api.Panel.parentId, 'player_draw',msg);
        return;
    }
    if(msg.startsWith('NewDrawing:')){
        msg = msg.replace('NewDrawing:','');
        api.Panel.message(api.Panel.parentId, 'player_new_draw',msg);
        return
    }
    if(msg.startsWith('EndDrawing:')){
        msg = msg.replace('EndDrawing:','');
        api.Panel.message(api.Panel.parentId, 'player_end_draw',msg);
        return;
    }
    model.chatLog.push(chat_message);
    model.visibleChat.push(chat_message);
    $(".div_chat_feed").scrollTop($(".div_chat_feed")[0].scrollHeight);
    $(".div_chat_log_feed").scrollTop($(".div_chat_log_feed")[0].scrollHeight);
};

