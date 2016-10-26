$.hostreward = parseInt($.inidb.get('settings', 'hostreward'));
$.hosttimeout = parseInt($.inidb.get('settings', 'hosttimeout'));
$.hostMessage = ($.inidb.get('settings', 'hostmessage') ? $.inidb.get('settings', 'hostmessage') : $.lang.get("net.quorrabot.hosthandler.default-host-welcome-message"));

if ($.hostlist == null || $.hostlist == undefined) {
    $.hostlist = new Array();
}

if ($.hosttimeout == null || $.hosttimeout == undefined || isNaN($.hosttimeout)) {
    $.hosttimeout = 60 * 60 * 1000;
} else {
    $.hosttimeout = $.hosttimeout * 60 * 1000;
}

if ($.hostreward == null || $.hostreward == undefined || isNaN($.hostreward)) {
    $.hostreward = 0;
}

$.isHostUser = function (user) {
    return $.array.contains($.hostlist, user.toLowerCase());
}

$.on('twitchHosted', function (event) {
    var username = $.username.resolve(event.getHoster());
    var s = $.hostMessage;

    if ($.announceHosts && $.moduleEnabled("./handlers/hostHandler.js") && ($.hostlist[username.toLowerCase()] == null || $.hostlist[username.toLowerCase()] == undefined || $.hostlist[username.toLowerCase()] < System.currentTimeMillis())) {
        
        s = $.replaceAll(s, '(name)', username);
        if ($.hostreward > 0 && $.moduleEnabled("./systems/pointSystem.js")) {
            $.inidb.incr('points', username.toLowerCase(), $.hostreward);
            s += " +" + $.getPointsString($.hostreward);
        }
        $.say("/me " + s);
    }

    $.hostlist[username.toLowerCase()] = System.currentTimeMillis() + $.hosttimeout;

    $.hostlist.push(username.toLowerCase());
    
    if(!$.inidb.exists("hostslist",username.toLowerCase())) {
        $.inidb.set("hostslist",username.toLowerCase(), 1);
    } else {
        var hostcount = parseInt($.inidb.get("hostslist", username.toLowerCase()));
        $.inidb.set("hostslist",username.toLowerCase(), hostcount++);
    }
});

$.on('twitchUnhosted', function (event) {
    var username = $.username.resolve(event.getHoster());

    $.hostlist[event.getHoster()] = System.currentTimeMillis() + $.hosttimeout;

    for (var i = 0; i < $.hostlist.length; i++) {
        if ($.hostlist[i].equalsIgnoreCase(username)) {
            $.hostlist.splice(i, 1);
            break;
        }
    }
});

$.on('twitchHostsInitialized', function (event) {
    println(">>Enabling new hoster announcements");

    $.announceHosts = true;
});

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();

    if (command.equalsIgnoreCase("hostreward")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
        }

        if ($.strlen(argsString) == 0) {
            if ($.inidb.exists('settings', 'hostreward')) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.hosthandler.host-reward-current-and-usage", $.getPointsString($.hostreward)));
                return;
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.hosthandler.host-reward-current-and-usage", $.getPointsString($.hostreward)));
                return;
            }
        } else {
            if (!parseInt(argsString) < 0) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.hosthandler.host-reward-error"));
                return;
            }

            $.logEvent("hostHandler.js", 134, username + " changed the host points reward to: " + argsString);

            $.inidb.set('settings', 'hostreward', argsString);
            $.hostreward = parseInt(argsString);
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.hosthandler.host-reward-set-success"));
            return;
        }
    }
    
    if (command.equalsIgnoreCase("hostmessage")) {		
        if (!$.isAdmin(sender)) {		
            $.say($.getWhisperString(sender) + $.adminmsg);		
            return;		
        }		
				
        if ($.strlen(argsString) == 0) {
            var msg = $.hostMessage;
            if ($.hostreward > 0 && $.moduleEnabled("./systems/pointSystem.js")) {
                msg += " +" + $.getPointsString($.hostreward);
            }
            $.say($.getWhisperString(sender) + msg);			
		
            var s = $.lang.get("net.quorrabot.hosthandler.host-message-usage");		
		
            $.say($.getWhisperString(sender) + s);		
            return;
            
        } else {		
            $.logEvent("hostHandler.js", 73, username + " changed the new hoster message to: " + argsString);		
		
            $.inidb.set('settings', 'hostmessage', argsString);
            $.hostMessage = $.inidb.get('settings', 'hostmessage');
		
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.hosthandler.host-message-set-success"));		
            return;		
        }		
    }

    if (command.equalsIgnoreCase("hostcount")) {
        $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.hosthandler.host-count", $.hostlist.length));
        return;
    }

});
setTimeout(function () {
    if ($.moduleEnabled('./handlers/hostHandler.js')) {
	if($.AutoHost.AutoHostToggle == 1)
        {
                        setTimeout(function(){
                            $.autoHost();
                            $.println(">>Enabling offline auto-hosting");
                        }, 20 * 1000);
			$.timer.addTimer('./handlers/hostHandler.js', 'autoHost', true, function () {
                            $.autoHost();
			}, 60 * 1000);
	}
        $.registerChatCommand('./handlers/hostHandler.js', 'addhost', 'admin');
        $.registerChatCommand('./handlers/hostHandler.js', 'delhost', 'admin');
        $.registerChatCommand('./handlers/hostHandler.js', 'listautohosts', 'admin');
        $.registerChatCommand('./handlers/hostHandler.js', 'autohosttoggle', 'admin');
        $.registerChatCommand('./handlers/hostHandler.js', 'autohosttime', 'admin');
        $.registerChatCommand("./handlers/hostHandler.js", "hostmessage", "admin");
        $.registerChatCommand("./handlers/hostHandler.js", "hostreward", "admin");
        $.registerChatCommand("./handlers/hostHandler.js", "hosttime", "admin");
        $.registerChatCommand("./handlers/hostHandler.js", "hostcount");
        $.registerChatCommand("./handlers/hostHandler.js", "hostlist");
    }
}, 10 * 1000);


$.getChannelID = function(channel) {
    var channelData = $.twitch.GetChannel(channel);
    
    return channelData.getInt("_id");
};