/**
 * @name Soft Block
 * @author Aida Enna
 * @version 0.0.1
 * @description This plugin lets you completely hide messages from users whose messages you don't want to see, and without them being able to know you did it. You can also hide their name in the user list.
 * @donate https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QXF8EL4737HWJ
 * @patreon https://www.patreon.com/bePatron?u=5597973
 * @website https://github.com/Aida-Enna
 * @source https://raw.githubusercontent.com/jojos38/Word-Notification-Improved/master/WordNotificationImproved.plugin.js
 * @updateUrl https://raw.githubusercontent.com/jojos38/Word-Notification-Improved/master/WordNotificationImproved.plugin.js
 */
 
 //Credit for the original basic JS code goes to https://github.com/k4yf0ur/Discord-Soft-Block

var CurrentRefreshID = 0;

const config = {
	"info": {
		name: "SoftBlock",
		id: "SoftBlock",
		author: "Aida Enna",
		version: "0.0.1",
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
		var user = [
		  "1",
		  "2"
		];
		var arrayLength = user.length;
		for (var i = 0; i < arrayLength; i++) {
			const blocked = document.querySelectorAll('[class^="message-2CShn3 cozyMessage-1DWF9U');
			blocked.forEach(blokMsg => {
				if (typeof(blokMsg.getElementsByClassName("contents-2MsGLg")[0].getElementsByClassName("avatar-2e8lTP clickable-31pE3P")[0]) == "object") {
					savedUser = blokMsg.getElementsByClassName("contents-2MsGLg")[0].getElementsByClassName("avatar-2e8lTP clickable-31pE3P")[0].src;
					if (blokMsg.getElementsByClassName("contents-2MsGLg")[0].getElementsByClassName("avatar-2e8lTP clickable-31pE3P")[0].src.includes("avatars")) {
						if (blokMsg.getElementsByClassName("contents-2MsGLg")[0].getElementsByClassName("avatar-2e8lTP clickable-31pE3P")[0].src.includes(user[i])) {
							if(blokMsg.style.display !== "none") blokMsg.style.display = "none"; // Hide the message
						}
					}
				} else {
					if (typeof(savedUser) == "string") { 
						if (savedUser.includes(user[i])) {
							if(blokMsg.style.display !== "none") blokMsg.style.display = "none"; // Hide the message
						}
					}
				}
			});	
			const avatar = document.querySelectorAll('[class^="member-3-YXUe container-2Pjhx- clickable-1JJAn8');
			avatar.forEach(avatarBlock => {
				if (typeof(avatarBlock.getElementsByClassName("layout-2DM8Md")[0].getElementsByClassName("avatar-3uk_u9")[0]) == "object") {
				if (typeof(avatarBlock.getElementsByClassName("layout-2DM8Md")[0].getElementsByClassName("avatar-3uk_u9")[0].firstElementChild.firstElementChild.firstElementChild.firstElementChild) == "object") {
					if (avatarBlock.getElementsByClassName("layout-2DM8Md")[0].getElementsByClassName("avatar-3uk_u9")[0].firstElementChild.firstElementChild.firstElementChild.firstElementChild.src.includes("avatars")) {
						if (avatarBlock.getElementsByClassName("layout-2DM8Md")[0].getElementsByClassName("avatar-3uk_u9")[0].firstElementChild.firstElementChild.firstElementChild.firstElementChild.src.includes(user[i])) {
							if(avatarBlock.style.display !== "none") avatarBlock.style.display = "none"; // Hide the avatar from the user list
						}
					}
				} 
			}
			});
			}
	};
	
		CurrentRefreshID = setInterval(hideUser, 500); //how quickly the messages are removed
		this.checkSettings();
	}

	stop()
	{
	// do something on plugin stop
	clearInterval(CurrentRefreshID);
	}
	
	checkSettings() {
		settings = getSetting("settings") || {};
		for (const [name, value] of Object.entries(defaultSettings)) {
			if (settings[name] == null) settings[name] = value;
		}
	}
	
	settingChanged(p1, id, value) {
		saveSetting(id, value);
	}

	newSwitch(name, desc, id) {
		const tmpSwitch = new ZeresPluginLibrary.Settings.Switch(name, desc, settings[id]);
		tmpSwitch.id = id;
		return tmpSwitch;
	}

	newSlider(name, desc, min, max, id, options) {
		const tmpSlider = new ZeresPluginLibrary.Settings.Slider(name, desc, min, max, settings[id],  null, options);
		tmpSlider.id = id;
		return tmpSlider;
	}

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
			),
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
			),
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