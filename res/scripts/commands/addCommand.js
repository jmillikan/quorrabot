$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var commandString;
    var message;

    if (command.equalsIgnoreCase("addcom")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        if (args.length < 2) {
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.addcom-error-usage"));
            return;
        }

        commandString = args[0].toLowerCase();
        message = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);

        if (commandString.substring(0, 1) == '!') {
            commandString = commandString.substring(1);
        }

        if ($.commandExists(commandString)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.addcom-error"));
            return;
        }

        if (message.search(/(\(file ([^)]+)\))/g) >= 0) {
            if (RegExp.$2.indexOf('\\') > 0 || RegExp.$2.indexOf('/') > 0) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.filetag-error"));
                return;
            }
        }

        $.logEvent("addCommand.js", 50, username + " added the command !" + commandString + " with message: " + message);

        $.inidb.set('command', commandString, message);

        $.registerCustomChatCommand("./commands/addCommand.js", commandString);

        if (sender == $.botname) {
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.addcom-success", commandString));
            return;
        }
        $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.addcom-success", commandString));
        return;
    }

    if (command.equalsIgnoreCase("aliascom")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        if (args.length < 2) {
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.aliascom-error-usage"));
        } else {
            commandString = args[0].toLowerCase();
            message = args[1].toLowerCase();

            if (commandString.substring(0, 1) == '!') {
                commandString = commandString.substring(1);
            }

            if (message.substring(0, 1) == '!') {
                message = message.substring(1);
            }

            if (!$.commandExists(commandString)) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.aliascom-error-no-command"));
                return;
            }

            if ($.commandExists(message) && !$.inidb.exists('aliases', message)) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.aliascom-failed"));
                return;
            }

            $.logEvent("addCommand.js", 59, username + " aliased the command !" + commandString + " to !" + message);
            $.inidb.set('aliases', message, commandString);

            $.registerCustomChatCommand("./commands/addCommand.js", message);

            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.aliascom-success", commandString, message));
            return;
        }
    }

    if (command.equalsIgnoreCase("delcom")) {
        if (args.length >= 1) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }

            $.logEvent("addCommand.js", 69, username + " deleted the command !" + commandString);

            commandString = args[0].toLowerCase();

            if (commandString.substring(0, 1) == '!') {
                commandString = commandString.substring(1);
            }

            var acommands = $.inidb.GetKeyList('aliases', "");


            for (var i = 0; i < acommands.length; i++) {
                if (acommands[i].toLowerCase().contains(commandString)) {
                    $.unregisterCustomChatCommand(commandString);
                    $.inidb.del('aliases', commandString);
                }
            }


            $.inidb.del('command', commandString);
            $.inidb.del('commandperm', commandString);
            $.inidb.del('commandcount', commandString);

            $.unregisterCustomChatCommand(commandString);
            if (sender == $.botname) {
                println($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.delcom-success", commandString));
                return;
            }
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.delcom-success", commandString));
            return;
        }
        $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.delcom-error-usage"));
        return;
    }

    if (command.equalsIgnoreCase("editcom")) {
        if (args.length >= 1) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }

            commandString = args[0].toLowerCase();
            message = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
            if (commandString.substring(0, 1) == '!') {
                commandString = commandString.substring(1);
            }

            if ($.inidb.get('command', commandString) == null) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.editcom-error"));
                return;
            }

            if (message.isEmpty()) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.editcom-error-usage"));
                return;
            }

            if (message.search(/(\(file ([^)]+)\))/g) >= 0) {
                if (RegExp.$2.indexOf('\\') > 0 || RegExp.$2.indexOf('/') > 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.filetag-error"));
                    return;
                }
            }

            $.inidb.set('command', commandString, message);
            if (sender == $.botname) {
                println($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.editcom-success", commandString));
                return;
            }
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.editcom-success", commandString));
            return;
        }
        $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.editcom-error-usage"));
        return;
    }


    if (command.equalsIgnoreCase("permcom")) {
        if (!isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.permcom-error-usage"));
            return;
        }

        if (args.length >= 2) {
            if (!$.commandExists(args[0].toLowerCase())) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.permcom-error-no-command", args[0]));
                return;
            }

            var newgroup = args[1].toLowerCase();
            var permcommArray = $.inidb.GetKeyList("permcom", "");


            var alias = "";
            var sourceCommand = "";

            if (!parseInt(args[2])) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.permcom-syntax-error"));
                return;
            }

            if (parseInt(args[2]) > 1) {
                var mode = "_recursive";
            } else {
                mode = "";
            }
            if (newgroup.equalsIgnoreCase("admin")) {
                newgroup = "administrator";
            }
            if (newgroup.equalsIgnoreCase("mod")) {
                newgroup = "moderator";
            }
            if (newgroup.equalsIgnoreCase("sub")) {
                newgroup = "subscriber";
            }
            if (newgroup.equalsIgnoreCase("delete")) {
                for (var i = 0; i < permcommArray.length; i++) {
                    if (permcommArray[i].equalsIgnoreCase(args[0] + mode)) {
                        $.inidb.del("permcom", permcommArray[i]);
                    }
                }

                if ($.inidb.exists('aliases', args[0].toLowerCase())) {
                    alias = $.inidb.get('aliases', args[0].toLowerCase());
                    $.inidb.del("permcom", alias + mode);
                }

                if (mode == "_recursive") {
                    $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.permcom-removed-success", args[0]));
                    return;
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.permcom-removed-success", args[0]));
                    return;
                }
                return;
            }

            if ($.inidb.exists('aliases', args[0].toLowerCase())) {
                sourceCommand = $.inidb.get('aliases', args[0].toLowerCase());
            } else {
                sourceCommand = args[0].toLowerCase();
            }

            if (mode == "_recursive") {
                $.inidb.set("permcom", sourceCommand + mode, newgroup);
            } else {
                if ($.inidb.exists("permcom", sourceCommand)) {
                    var oldgroup = $.inidb.get("permcom", sourceCommand);
                    $.inidb.set("permcom", sourceCommand, oldgroup + "_" + newgroup);
                } else {
                    $.inidb.set("permcom", sourceCommand, newgroup);
                }
            }

            if (mode == "_recursive") {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.permcom-success", args[0], args[1]));
                return;
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.permcom-success", args[0], args[1]));
                return;
            }
        }
    }
    if (command.equalsIgnoreCase("helpcom")) {
        $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.helpcom-error-usage"));

        $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.helpcom-command-tags"));

        $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.helpcom-command-tags2"));

        setTimeout(function () {
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.helpcom-command-tags3"));
        }, 1000); //added timeout because twitch only allows 3whisper per 1 sec.
        return;
    }

    if ($.inidb.exists('command', command.toLowerCase())) {
        var messageCommand = $.inidb.get('command', command.toLowerCase());

        for (var i = 0; i < args.length; i++) {
            messageCommand = $.replaceAll(messageCommand, '(' + (i + 1) + ')', args[i]);
        }
        if (messageCommand.contains('(sender)')) {
            messageCommand = $.replaceAll(messageCommand, '(sender)', $.username.resolve(sender));
        }
        if (messageCommand.contains('(count)')) {
            $.inidb.incr('commandcount', command.toLowerCase(), 1);
            messageCommand = $.replaceAll(messageCommand, '(count)', $.inidb.get('commandcount', command.toLowerCase()));
        }
        if (messageCommand.contains('(points)')) {
            messageCommand = $.replaceAll(messageCommand, '(points)', $.getPointsString(parseInt($.inidb.get("points", sender))));
        }
        if (messageCommand.contains('(caster)')) {
            messageCommand = $.replaceAll(messageCommand, '(caster)', $.username.resolve($.channelName));
        }
        if (messageCommand.contains('(touser)')) {
            if (args.length > 0) {
                if (args[0].contains('@')) {
                    args[0] = args[0].substring(args[0].indexOf('@') + 1);
                }
                messageCommand = $.replaceAll(messageCommand, '(touser)', $.username.resolve(args[0]));
            } else {
                messageCommand = $.replaceAll(messageCommand, '(touser)', $.username.resolve(sender));
            }
        }
        if (messageCommand.contains('(game)')) {
            if (args.length > 0) {
                messageCommand = $.replaceAll(messageCommand, '(game)', $.getGame($.username.resolve(args[0])));
            } else {
                messageCommand = $.replaceAll(messageCommand, '(game)', $.getGame($.channelName));
            }
        }
        if (messageCommand.contains('(status)')) {
            if (args.length > 0) {
                messageCommand = $.replaceAll(messageCommand, '(status)', $.getStatus($.username.resolve(args[0])));
            } else {
                messageCommand = $.replaceAll(messageCommand, '(status)', $.getStatus($.channelName));
            }
        }
        if (messageCommand.contains('(echo)') && args.length > 0) {
            messageCommand = $.replaceAll(messageCommand, '(echo)', argsString);
        }
        if (messageCommand.contains('(random)')) {
            messageCommand = $.replaceAll(messageCommand, '(random)', $.users[$.rand($.users.length)][0]);
        }
        if (messageCommand.contains('(viewers)')) {
            if (args.length > 0) {
                messageCommand = $.replaceAll(messageCommand, '(viewers)', $.getViewers($.username.resolve(args[0])));
            } else {
                messageCommand = $.replaceAll(messageCommand, '(viewers)', $.getViewers($.channelName));
            }
        }
        if (messageCommand.contains('(count)')) {
            messageCommand = $.replaceAll(messageCommand, '(count)', $.inidb.get('commandcount', command.toLowerCase()));
        }
        if (messageCommand.contains('(z_stroke)')) {
            messageCommand = $.replaceAll(messageCommand, '(z_stroke)', java.lang.Character.toString(java.lang.Character.toChars(0x01B6)[0]));
        }
        if (messageCommand.contains('(console)')) {
            messageCommand = $.replaceAll(messageCommand, '(console)', $.username.resolve($.channelName));
        }
        if (messageCommand.contains('(otherconsoles)')) {
            messageCommand = $.replaceAll(messageCommand, '(otherconsoles)', $.ConsoleCommand.OtherConsoles);
        }
        if (messageCommand.contains('(urlencode')) {
            messageCommand = $.urlEncode(messageCommand, argsString);
        }
        if (messageCommand.contains('(customapi')) {
            messageCommand = $.customAPI(messageCommand, command, args, sender);
        }
        while (messageCommand.contains('(file')) {
            if (messageCommand.search(/(\(file ([^)]+)\))/g) >= 0) {
                if (RegExp.$2.indexOf('\\') > 0 || RegExp.$2.indexOf('/') > 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.filetag-error"));
                    return;
                }
                messageCommand = $.replaceAll(messageCommand, RegExp.$1, $.readFile('addons/txt/' + RegExp.$2)[0]);
            }
        }

        if (messageCommand.contains('(code)')) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for (var i = 0; i < 8; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            messageCommand = $.replaceAll(messageCommand, '(code)', text);
        }

        if (messageCommand.contains('(#)')) {
            messageCommand = $.replaceAll(messageCommand, '(#)', $.randRange(1, 100));
        }

        $.say(messageCommand);
    }

    if (command.equalsIgnoreCase("pricecommod")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
        }

        if (!$.inidb.exists("settings", "pricecommod") || !$.inidb.get("settings", "pricecommod").equalsIgnoreCase("true")) {
            $.inidb.set("settings", "pricecommod", "true");
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.pricecommod-enable"));
        } else {
            $.inidb.set("settings", "pricecommod", "false");
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.pricecommod-disable"));
        }
    }

    if (command.equalsIgnoreCase("pricecom")) {
        if (!$.isAdmin(sender) && args.length != 1) {
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.pricecom-error-usage"));
            return;
        }

        if (args.length == 1) {
            var commandname = args[0].toLowerCase();
            if ($.inidb.exists("aliases", commandname) && $.inidb.get("aliases", commandname) != "") {
                commandname = $.inidb.get("aliases", commandname);
            }

            if ($.inidb.exists("pricecom", commandname) && parseInt($.inidb.get("pricecom", commandname)) > 0) {
                var retrieveprice = $.inidb.get("pricecom", commandname);

                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.pricecom-current-set-price", args[0], $.getPointsString(retrieveprice)));
                return;
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.pricecom-current-set-price2", args[0], $.pointNameMultiple));
                return;
            }
        }

        if (args.length == 2) {
            var commandname = args[0].toLowerCase();
            var commandprice = parseInt(args[1]);
            var sourceCommand = "";
            if ($.inidb.exists('aliases', commandname)) {
                sourceCommand = $.inidb.get('aliases', commandname);
            } else {
                sourceCommand = commandname;
            }

            if (!$.commandExists(sourceCommand)) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.pricecom-error1"));
                return;
            } else if (isNaN(commandprice) || commandprice < 0) {
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.pricecom-error2"));
                return;
            } else {
                $.inidb.set("pricecom", sourceCommand, commandprice);
                $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.addcommand.pricecom-success", args[0], $.getPointsString(commandprice)));
                return;
            }
        }
    }
});

$.urlEncode = function (message, argsString) {
    var encoder = Packages.java.net.URLEncoder;
    var encodedurl = "";
    var urlencodeportion = "";
    if (message.toLowerCase().indexOf('(urlencode $1)')!=-1) {
        urlencodeportion = '(urlencode $1)';
        encodedurl = encoder.encode(argsString);
    } else {
        var urlencodestart = message.substring(message.indexOf("(urlencode "));
        urlencodeportion = message.substring(message.indexOf("(urlencode "), urlencodestart.indexOf(")"));
        encodedurl = encoder.encode(urlencodestart.substring(urlencodestart.indexOf(" " + 1), urlencodestart.indexOf(")")));
    }
    message = message.replace(urlencodeportion, encodedurl);
    return message;
}

$.getCustomAPIValue = function (url) {
    var HttpResponse = Packages.com.gmt2001.HttpResponse;
    var HttpRequest = Packages.com.gmt2001.HttpRequest;
    var HashMap = Packages.java.util.HashMap;
    var response = HttpRequest.getData(HttpRequest.RequestType.GET, url, "", new HashMap());
    return response.content;
}

$.customAPI = function (message, command, args, sender) {

    var JSONObject = Packages.org.json.JSONObject,
            jsonObject,
            customAPIResponse = '',
            origCustomAPIResponse = '',
            customAPIReturnString = '',
            customJSONStringTag = '',
            csmessage = message + '',
            sender = sender + '',
            command = command + '',
            customAPIReturnString = '',
            regExCheck,
            jsonItems,
            jsonCheckList;

    var reCustomAPI = new RegExp(/\(customapi\s([\w\W:\/\$\=\?\&]+)\)/), // URL[1]
            reCustomAPIJson = new RegExp(/\(customapi ([\w\.:\/\$=\?\&]+)\s([\w\W]+)\)/), // URL[1], JSONmatch[2..n]
            reCustomAPITextTag = new RegExp(/{([\w\W]+)}/);

    $.customAPIParseArgs = function (regExCheck) {
        if (command.toString().toLowerCase().indexOf('notice id: #') != -1) {
            var mArgsString = message.substring(message.indexOf(regExCheck[0].toString()) + regExCheck[0].toString().length + 1);
            args = mArgsString.split(" ");
        }

        if (regExCheck[1].indexOf('$1') != -1) {
            for (var i = 1; i <= 9; i++) {
                if (regExCheck[1].indexOf('$' + i) != -1) {
                    if (!args[i - 1]) {
                        $.say($.getWhisperString(sender) + $.lang.get('net.quorrabot.addcommand.customapi.404', command));
                        return;
                    }
                    regExCheck[1] = regExCheck[1].replace('$' + i, args[i - 1]);
                } else {
                    break;
                }
            }
        }
    }

    if ((regExCheck = csmessage.match(reCustomAPIJson))) {
        $.customAPIParseArgs(regExCheck);
        origCustomAPIResponse = getCustomAPIValue(regExCheck[1]);
        jsonItems = regExCheck[2].split(' ');
        for (var j = 0; j < jsonItems.length; j++) {

            if (jsonItems[j].startsWith('{') && jsonItems[j].endsWith('}')) {
                customAPIReturnString += " " + jsonItems[j].match(reCustomAPITextTag)[1];
            } else if (jsonItems[j].startsWith('{') && !jsonItems[j].endsWith('}')) {
                customJSONStringTag = '';
                while (!jsonItems[j].endsWith('}')) {
                    customJSONStringTag += jsonItems[j++] + " ";
                }
                customJSONStringTag += jsonItems[j];
                customAPIReturnString += " " + customJSONStringTag.match(reCustomAPITextTag)[1];
            } else {
                jsonCheckList = jsonItems[j].split('.');
                if (jsonCheckList.length == 1) {
                    try {
                        customAPIResponse = new JSONObject(origCustomAPIResponse).getString(jsonCheckList[0]);
                    } catch (ex) {
                        if (ex.message.indexOf('not a string') != -1) {

                            try {
                                customAPIResponse = jsonObject.getInt(jsonCheckList[0]);
                            } catch (ex) {
                                $.say($.getWhisperString(sender) + $.lang.get('net.quorrabot.addcommand.customapijson.err', command));
                                return;
                            }
                        }
                    }
                    //prevent duplicate data due to for loop
                    if (customAPIReturnString.indexOf(customAPIResponse) == -1) {
                        customAPIReturnString += " " + customAPIResponse;
                    }

                } else {
                    for (var i = 0; i < jsonCheckList.length - 1; i++) {
                        if (i == 0) {
                            jsonObject = new JSONObject(origCustomAPIResponse).getJSONObject(jsonCheckList[i]);
                        } else {
                            jsonObject = jsonObject.getJSONObject(jsonCheckList[i]);
                        }
                    }
                    try {
                        customAPIResponse = jsonObject.getString(jsonCheckList[i]);
                    } catch (ex) {
                        if (ex.message.indexOf('not a string') != -1) {
                            try {
                                customAPIResponse = jsonObject.getInt(jsonCheckList[i]);
                            } catch (ex) {
                                $.say($.getWhisperString(sender) + $.lang.get('net.quorrabot.addcommand.customapijson.err', command));
                                return;
                            }
                        }
                    }
                    //prevent duplicate data due to for loop
                    if (customAPIReturnString.indexOf(customAPIResponse) == -1) {
                        customAPIReturnString += " " + customAPIResponse;
                    }
                }
            }

        }
        var replacedmessage = $.replaceAll(message, regExCheck[0], customAPIReturnString);
        if (command.toString().toLowerCase().indexOf('notice id: #') != -1) {
            replacedmessage = replacedmessage.substring(0, replacedmessage.indexOf(customAPIReturnString) + customAPIReturnString.length);
        }
        return replacedmessage;

    } else if (regExCheck = csmessage.match(reCustomAPI)) {
        $.customAPIParseArgs(regExCheck);
        customAPIReturnString = $.getCustomAPIValue(regExCheck[1]);
        var replacedmessage = $.replaceAll(message, regExCheck[0], customAPIReturnString);
        if (command.toString().toLowerCase().indexOf('notice id: #') != -1) {
            replacedmessage = replacedmessage.substring(0, replacedmessage.indexOf(customAPIReturnString) + customAPIReturnString.length);
        }
        return replacedmessage;
    }
}

if ($.moduleEnabled('./commands/addCommand.js')) {
    $.registerChatCommand("./commands/addCommand.js", "addcom", "mod");
    $.registerChatCommand("./commands/addCommand.js", "editcom", "mod");
    $.registerChatCommand("./commands/addCommand.js", "pricecom", "mod");
    $.registerChatCommand("./commands/addCommand.js", "aliascom", "mod");
    $.registerChatCommand("./commands/addCommand.js", "delalias", "mod");
    $.registerChatCommand("./commands/addCommand.js", "delcom", "mod");
    $.registerChatCommand("./commands/addCommand.js", "permcom", "admin");
    $.registerChatCommand("./commands/addCommand.js", "helpcom", "mod");
}

var commands = $.inidb.GetKeyList("command", "");

if ($.array.contains(commands, "commands")) {
    $.inidb.del("command", "commands");
    commands = $.inidb.GetKeyList("command", "");
}

for (var i = 0; i < commands.length; i++) {
    $.registerCustomChatCommand("./commands/addCommand.js", commands[i]);
}

$.timer.addTimer("./commands/addCommand.js", "registerAliases", false, function () {
    var acommands = $.inidb.GetKeyList("aliases", "");

    for (i = 0; i < acommands.length; i++) {
        $.registerCustomChatCommand("./commands/addCommand.js", acommands[i]);
    }
}, 2 * 1000);
