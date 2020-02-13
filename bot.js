const Discord = require("discord.js");
const cheerio =  require("cheerio");
const request =  require("request");

const client = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix;

client.on("ready", () => {

	console.log(`PereiraBot inicializado.`);
	client.user.setUsername(`PereiraBot`);
	client.user.setStatus(`Ednaldo Pereira.`);

});


client.on("message", async message => {

	var parts = message.content.split(" ");
	let comandoBase = parts[0];

	//if(!comandoBase.startsWith(prefix)) return;
	if(message.author.bot) return;

	if(comandoBase === prefix + "ednaldo") {
		await message.channel.send("pereira.");
	}

	if(comandoBase === prefix + "pereira") {

		let args = parts.slice(1).join(" ").split(", ");

		let arg1 = args[0];
		if(arg1 === "" || arg1 === undefined ) arg1 = "diamante"

		let arg2 = args[1];
		if(arg2 === "" || arg2 === undefined) arg2 = "marcante"

		await message.channel.send(`Brilhando como um ${arg1} em uma geracao ${arg2}`);
	}

	if(comandoBase === prefix + "mestre") {
		image(message, parts);
	}

	console.log(`enviada mensagem '${message}' por ${message.author.username} (id: ${message.author.id})`)

	if(message.content.toLowerCase().includes("ednaldo pereira")) {
		let pereiraReactions = ["552683196693610522", "552683399366574084"]
		message.react(pereiraReactions[Math.floor(Math.random() * pereiraReactions.length)]);
	};

});

function image(message, parts) {

	var search = parts.slice(1).join(" ");
	if(search.length === 0) search = "ednaldo pereira";

	var options = {
		url: "http://results.dogpile.com/serp?qc=images&q=" + search,
		method: "GET",
		headers: {
			"Accept": "text/html",
			"User-Agent": "Chrome"
		}
	};

	request(options, function(error, response, responseBody) {
		if(error) return;

		$ = cheerio.load(responseBody);
		var links = $(".image a.link");
		var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
		
		if(!urls.length) return;
		
		message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
	});
}

client.login(config.token);
