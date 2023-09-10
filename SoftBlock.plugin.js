/**
 * @name Soft Block
 * @author Aida Enna
 * @version 0.0.2
 * @description This plugin lets you completely hide messages from users whose messages you don't want to see, and without them being able to know you did it. You can also hide their name in the user list.
 * @donate https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QXF8EL4737HWJ
 * @patreon https://www.patreon.com/bePatron?u=5597973
 * @website https://github.com/Aida-Enna
 * @source https://github.com/Aida-Enna/Soft-Block-BetterDiscord-Plugin/tree/main
 * @updateUrl https://raw.githubusercontent.com/Aida-Enna/Soft-Block-BetterDiscord-Plugin/main/SoftBlock.plugin.js
 */
 
 //Credit for the original basic JS code goes to https://github.com/k4yf0ur/Discord-Soft-Block

var CurrentRefreshID = 0;

const config = {
	"info": {
		name: "SoftBlock",
		id: "SoftBlock",
		author: "Aida Enna",
		version: "0.0.2",
		description: "Completely hide messages from users whose messages you don't want to see"
	}
};

var settings;
const defaultSettings = {
	"users-to-hide": [],
	"hide-in-userlist": true,
	"servers-only": false,
	"white-listed-servers": [],
	"white-listed-channels": [],
	"refresh-time": 500,
}

function parseList(list) {
	var words = list.split(',,').map(e => e.trim());
	return words;
}

function saveSetting(key, value) {
	settings[key] = typeof value == "string" ? parseList(value) : value;
	BdApi.saveData(config.info.id, "settings", settings);
}

function getSetting(key) {
	return BdApi.Data.load(config.info.id, key);
}

module.exports = class MyPlugin
{
	
	// do something when the plugin is loaded
    constructor(meta)
	{

    }

	// do something on plugin start	
	start()
	{

	function hideUser(data){
		var savedUser = "temp";
		//User IDs obtainable by right clicking their name and clicking 'copy ID' when you are in discord developer mode
		var user = settings["users-to-hide"];
		if (user.length < 1)
		{
			return;
		}
		var arrayLength = user.length;
		//We're in a DM, we know cause we can see the DM list!
		if (document.querySelectorAll('[class^="privateChannels-oVe7HL').length > 0)
		{
			if (settings["servers-only"])
			{
				return;
			}
		}
		for (var i = 0; i < arrayLength; i++) {
			if (user[i].length < 8)
			{
				//Is this really a user ID? If you find one that short, make an issue.
				return;
			}
			//Look for all the messages we have loaded
			const blocked = document.querySelectorAll('[class^="message-2CShn3 cozyMessage-1DWF9U');
			//For each message...
			blocked.forEach(blokMsg => {
				//If it's clickable and has shit in it...
				if (typeof(blokMsg.getElementsByClassName("contents-2MsGLg")[0].getElementsByClassName("avatar-2e8lTP clickable-31pE3P")[0]) == "object") {
					savedUser = blokMsg.getElementsByClassName("contents-2MsGLg")[0].getElementsByClassName("avatar-2e8lTP clickable-31pE3P")[0].src;
					//if it includes an avatar...
					if (blokMsg.getElementsByClassName("contents-2MsGLg")[0].getElementsByClassName("avatar-2e8lTP clickable-31pE3P")[0].src.includes("avatars")) {
						//if the avatar has the user ID in the url...
						if (blokMsg.getElementsByClassName("contents-2MsGLg")[0].getElementsByClassName("avatar-2e8lTP clickable-31pE3P")[0].src.includes(user[i])) {
							if(blokMsg.style.display !== "none") blokMsg.style.display = "none"; // Hide the message
						}
					}
				} else {
					//I have no idea what this does TBH
					if (typeof(savedUser) == "string") { 
						if (savedUser.includes(user[i])) {
							if(blokMsg.style.display !== "none") blokMsg.style.display = "none"; // Hide the message
						}
					}
				}
			});
			//Look through all the members in the list
			const avatar = document.querySelectorAll('[class^="member-2gU6Ar member-48YF_l container-1oeRFJ clickable-28SzVr');
			//For each member...
			avatar.forEach(avatarBlock => {
				//If it's clickable and has shit in it...
				if (typeof(avatarBlock.getElementsByClassName("layout-1qmrhw")[0].getElementsByClassName("avatar-6qzftW")[0]) == "object") {
					//We're crawling down the list...
					if (typeof(avatarBlock.getElementsByClassName("layout-1qmrhw")[0].getElementsByClassName("avatar-6qzftW")[0].firstElementChild.firstElementChild.firstElementChild.firstElementChild) == "object") {
						//If we find an avatar...
						if (avatarBlock.getElementsByClassName("layout-1qmrhw")[0].getElementsByClassName("avatar-6qzftW")[0].firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.src.includes("avatars")) {
							//and it has their user ID in the url...
							if (avatarBlock.getElementsByClassName("layout-1qmrhw")[0].getElementsByClassName("avatar-6qzftW")[0].firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.src.includes(user[i])) {
								//if we're hiding people
								if (settings["hide-in-userlist"])
								{
								/*if(avatarBlock.style.display !== "none")*/ avatarBlock.style.display = "none"; // Hide the avatar from the user list
								}
								else
								{
								avatarBlock.style.display = "normal"; //otherwise mark em as normal
								}
						}
					}
				} 
			}
			});
			}
	};
		this.checkSettings(); //Check for null settings and fix em if we find em
		CurrentRefreshID = setInterval(hideUser, settings["refresh-time"]); //how quickly the messages are removed
	}

	stop()
	{
	// do something on plugin stop
	clearInterval(CurrentRefreshID); //stop the code from running
	}
	
	checkSettings() {
		settings = getSetting("settings") || {};
		for (const [name, value] of Object.entries(defaultSettings)) {
			//If anyone is broken, restore the default value
			if (settings[name] == null) settings[name] = value;
		}
	}
	
	settingChanged(p1, id, value) {
		saveSetting(id, value); //Save the setting
	}

	//Code for switch UI
	newSwitch(name, desc, id) {
		const tmpSwitch = new ZeresPluginLibrary.Settings.Switch(name, desc, settings[id]);
		tmpSwitch.id = id;
		return tmpSwitch;
	}

	//Code for slider UI
	newSlider(name, desc, min, max, id, options) {
		const tmpSlider = new ZeresPluginLibrary.Settings.Slider(name, desc, min, max, settings[id],  null, options);
		tmpSlider.id = id;
		return tmpSlider;
	}

	//Code for textbox UI
	newTextBox(name, desc, id, options, type) {
		var content = "";
		if (type == "list") {
		if (settings[id]) for (let word of settings[id]) content += ",," + word;
			content = content.slice(2);
		} else if (type == "message") {
			content = settings[id] || "";
		}
		const tmpTextbox = new ZeresPluginLibrary.Settings.Textbox(name, desc, content, null, options);
		tmpTextbox.id = id;
		return tmpTextbox;
	}
	
	getSettingsPanel() {
		this.checkSettings();
		const list = [];
	const mainSettings = new ZeresPluginLibrary.Settings.SettingGroup("Main settings", {collapsible:false});
		const mainSettingsMenu = [
			this.newTextBox(
				"Users to soft block", // Title
				"The list of user IDs that should be hidden, seperated by TWO commas. User IDs are obtainable by right clicking their name and clicking 'copy ID' when you are in discord developer mode (toggleable in normal discord settings)", // Desc
				"users-to-hide", // Identifier
				{ placeholder: "User IDs here separated by TWO commas" },
				"list"
			),
			this.newSwitch(
				"Hide User in Userlist",
				"Hide users who are soft blocked in the user list on the right",
				"hide-in-userlist"
			),
			this.newSwitch(
				"Only Hide in Servers", // Title
				"See messages from hidden users in DMs, but hide them in servers", // Description
				"servers-only" // Identifier
			),/*
			this.newTextBox(
				"Whitelisted servers", // Title
				"These servers will show hidden users (put in IDs)", // Desc
				"white-listed-servers", // Identifier
				{ placeholder: "The server IDs separated by TWO commas (example: 12345678901234567,,09876543210987654)" },
				"list"
			),
			this.newTextBox(
				"Whitelisted channels", // Title
				"These channels will show hidden users (put in IDs)", // Desc
				"white-listed-channels", // Identifier
				{ placeholder: "The channel IDs separated by TWO commas (example: 12345678901234567,,09876543210987654)" },
				"list"
			),*/
			this.newSlider(
				"Refresh Time (default 500)", // Title
				"Mainly a dev thing, normally you won't need to change this. How fast messages are checked.", // Desc
				1, 999, // Min max
				"refresh-time", // Identifier
				{
					markers: [1, 100, 300, 500, 700, 900, 999],
					units: "",
				}
			)
		];

		mainSettings.append(...mainSettingsMenu);
		list.push(mainSettings);
		return ZeresPluginLibrary.Settings.SettingPanel.build(this.settingChanged, ...list);
	}
};