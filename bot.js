const Discord = require("discord.js");
const cheerio =  require("cheerio");
const request =  require("request");
const ytdl = require("ytdl-core")

const client = new Discord.Client();
const config = require("./config.json");
const tokenObject = require("./token.json");
const prefix = config.prefix;

var servers = {};

client.on("ready", () => {

	console.log(`PereiraBot inicializado.`);
	client.user.setUsername(`PereiraBot`);
	client.user.setStatus(`Ednaldo Pereira.`);

});

client.on("message", async message => {

	var messageParts = message.content.substring(prefix.length).split(" ");
	let command = messageParts[0];

	if(message.author.bot) return;
	//if(message.content.substring(0, prefix.length) != prefix) return;

	switch(command) {
		
	case 'ednaldo':
		await message.channel.send("pereira.");
		break;

	case 'pereira':
		var pereiraCommandArgs = messageParts.slice(1).join(" ").split(", ");

		var pereiraCommandArg1 = pereiraCommandArgs[0];
		if(!pereiraCommandArgs[0]) pereiraCommandArg1 = "diamante";
		else if(pereiraCommandArgs[0].endsWith(",")) pereiraCommandArg1 = pereiraCommandArgs[0].slice(0, -1);

		var pereiraCommandArg2 = pereiraCommandArgs[1];
		if(!pereiraCommandArgs[1]) pereiraCommandArg2 = "marcante";

		await message.channel.send(`Brilhando como um ${pereiraCommandArg1} em uma geracao ${pereiraCommandArg2}`);
		break;

	case 'mestre':
		sendImage(message, messageParts);
		break;

	case 'punda':

		if(!message.member.voiceChannel) {
			message.channel.send("Entre num canal para tocarrr! pum tss pummmm~~");
			return;
		}

		if(!servers[message.guild.id])
			servers[message.guild.id] =
			{
				queue: []
			}

		var servidor = servers[message.guild.id];

		servidor.queue.push(messageParts[1]);

		if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
			play(connection, message);
		});

		break;

	}

	console.log(`enviada mensagem '${message}' por ${message.author.username} (id: ${message.author.id})`)

	if(message.content.toLowerCase().includes("ednaldo pereira")) {
		let reactions = ["552683196693610522", "552683399366574084"]
		message.react(reactions[Math.floor(Math.random() * reactions.length)]);
	}

	if(message.content.toLowerCase().includes("melq") || message.content.toLowerCase().includes("melqui") || message.content.toLowerCase().includes("melk")) {
		let reactions = ["552683196693610522", "552683399366574084"]
		let melqMessages = ["Grande melq, um verdadeiro broderrrrrr", "Te adoro melqui", "kd melk?"]
		message.react(reactions[Math.floor(Math.random() * reactions.length)]);
		message.channel.send(melqMessages[Math.floor(Math.random() * melqMessages.length)]);
	}

});

function sendImage(message, messageParts) {

	var search = messageParts.slice(1).join(" ");
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
		let links = $(".image a.link");
		let urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
		
		if(!urls.length) return;
		
		message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
	});
}

function play(connection, message) {
	var servidor = servers[message.guild.id];

	servidor.dispatcher = connection.playStream(ytdl(servidor.queue[0], { filter: "audioonly" }));

	servidor.queue.shift();

	servidor.dispatcher.on("end", function() {
		if(!servidor.queue[0]) connection.disconnect();
		play(connection, message);
	})
}

client.login(tokenObject.token);
