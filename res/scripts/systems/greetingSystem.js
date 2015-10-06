$.on('ircChannelJoin', function(event) {
    var sender = event.getUser().toLowerCase();
    var username = $.username.resolve(sender);
    var s = $.inidb.get("greeting", sender);

    $.inidb.set("visited", sender.toLowerCase(), "visited");
    
    if ($.inidb.get("greeting", sender + "_enabled") == "1") {

        if (s == null || s == undefined || s.isEmpty()) {
            s = $.inidb.get("greeting", "_default");
            
            if (s == null || s == undefined || s.isEmpty()) {
                s = "(name) has entered the channel!";
            }
        }
        
        $.say($.getWhisperString(sender) + s.replace("(name)", username));
        
    } else if ($.inidb.get("greeting", "autogreet") == "true") {
        if (s == null || s == undefined || s.isEmpty()) {
            s = $.inidb.get("greeting", "_default");
            
            if (s == null || s == undefined || s.isEmpty()) {
                s = "(name) has entered the channel!";
            }
        }
        
        $.say($.getWhisperString(sender) + s.replace("(name)", username));
           
    } else {
    //println("[Join] " + username + " has joined the channel.");
    } 
});

$.on('ircChannelLeave', function(event) {
    var sender = event.getUser().toLowerCase();
    var username = $.username.resolve(sender);
    
//println("[Leave] " + username + " has left the channel.");
});

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var subCommand;
    
    if(command.equalsIgnoreCase("greeting")) {
        if (argsString.isEmpty()){
            subCommand = "";
        } else {
            subCommand = args[0];
        }
        
        var message = "";
            
        if (args.length > 1) {
            message = argsString.substring(argsString.indexOf(subCommand) + $.strlen(subCommand) + 1);
        }
        
        if (subCommand.equalsIgnoreCase("toggle")) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }
            if ($.inidb.get("greeting", "autogreet")== null || $.inidb.get("greeting", "autogreet")== "false") {
                $.inidb.set("greeting", "autogreet", "true");
                $.say($.getWhisperString(sender) + "Auto Greeting enabled! " + $.username.resolve($.botname) + " will greet everyone from now on.");
            } else if ($.inidb.get("greeting", "autogreet")== "true") {
                $.inidb.set("greeting", "autogreet", "false");
                $.say($.getWhisperString(sender) + "Auto Greeting disabled! " + $.username.resolve($.botname) + " will no longer greet viewers.");
            }
        }

        if (subCommand.equalsIgnoreCase("enable")) {
            $.inidb.set("greeting", sender + "_enabled", "1");
         
            $.say ($.getWhisperString(sender) + "Greeting enabled! " + $.username.resolve($.botname) + " will greet you from now on " + username + ".");
        } else if (subCommand.equalsIgnoreCase("disable")) {
            $.inidb.set("greeting", sender + "_enabled", "0");
            
            $.say ($.getWhisperString(sender) + "Greeting disabled for " + username);
        } else if (subCommand.equalsIgnoreCase("set")) {
            if ($.strlen(message) == 0) {
                $.inidb.set("greeting", sender, "");
                $.say($.getWhisperString(sender) + "Greeting deleted");
            }
            
            if (message.indexOf("(name)") == -1) {
                $.say($.getWhisperString(sender) + "You must include '(name)' in your new greeting so I know where to insert your name, " + username + ". Example: !greeting set (name) sneaks into the channel!");
                return;
            }
            
            $.inidb.set("greeting", sender, message);
            
            $.say($.getWhisperString(sender) + "Greeting changed");
        } else if (subCommand.equalsIgnoreCase("setdefault")) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }
            
            if (message.indexOf("(name)") == -1) {
                $.say($.getWhisperString(sender) + "You must include '(name)' in the new greeting so I know where to insert the viewers name, " + username + ". Example: !greeting setdefault (name) sneaks into the channel!");
                return;
            }
            
            $.logEvent("greetingSystem.js", 75, username + " changed the default greeting to " + message);
            
            $.inidb.set("greeting", "_default", message);
            
            $.say($.getWhisperString(sender) + "Default greeting changed");
        } else if (args[0].isEmpty()){
            $.say($.getWhisperString(sender) + 'Usage: !greeting enable, !greeting disable, !greeting set (message), !greeting setdefault (message)');
        }
    }
    
    if (command.equalsIgnoreCase("greet")) {
        var s = $.inidb.get("greeting", sender);
        
        if (s == null || s == undefined || s.isEmpty()) {
            s = $.inidb.get("greeting", "_default");
            
            if (s == null || s == undefined || s.isEmpty()) {
                s = "(name) has entered the channel!";
            }
        }
        
        $.say($.getWhisperString(sender) + s.replace("(name)", username));
    } 
});
setTimeout(function(){ 
    if ($.moduleEnabled('./systems/greetingSystem.js')) {
        $.registerChatCommand("./systems/greetingSystem.js", "greeting");
        $.registerChatCommand("./systems/greetingSystem.js", "greet");
    }
},10*1000);