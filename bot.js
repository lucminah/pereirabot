const Discord = require("discord.js");
const cheerio =  require("cheerio");
const request =  require("request");
const ytdl = require("ytdl-core")

const client = new Discord.Client();
const config = require("./config.json");
const botToken = require("./token.json");
const prefix = config.prefix;

var servers = {};

client.on("ready", () => {

	console.log(`PereiraBot inicializado.`);
	client.user.setUsername(`PereiraBot`);
	client.user.setStatus(`Ednaldo Pereira.`);

});

client.on("message", async message => {

	var args = message.content.substring(prefix.length).split(" ");
	let comando = args[0];

	//if(!comando.startsWith(prefix)) return;
	if(message.author.bot) return;

	switch(comando) {
		
	case 'ednaldo':
		await message.channel.send("pereira.");
		break;

	case 'pereira':
		let pereiraArgs = args.slice(1).join(" ").split(", ");

		let arg1 = pereiraArgs[0];
		if(!pereiraArgs[0]) arg1 = "diamante"

		let arg2 = pereiraArgs[1];
		if(!pereiraArgs[1]) arg2 = "marcante"

		await message.channel.send(`Brilhando como um ${arg1} em uma geracao ${arg2}`);
		break;

	case 'mestre':
		sendImage(message, args);
		break;

	case 'punda':

		function play(connection, message) {
			var servidor = servers[message.guild.id];

			servidor.dispatcher = connection.playStream(ytdl(servidor.queue[0], { filter: "audioonly" }));

			servidor.queue.shift();

			servidor.dispatcher.on("end", function() {
				if(!servidor.queue[0]) connection.disconnect();
				play(connection, message);
			})
		}

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

		servidor.queue.push(args[1]);

		if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
			play(connection, message);
		});

		break;

	}

	console.log(`enviada mensagem '${message}' por ${message.author.username} (id: ${message.author.id})`)

	if(message.content.toLowerCase().includes("ednaldo pereira")) {
		let pereiraReactions = ["552683196693610522", "552683399366574084"]
		message.react(pereiraReactions[Math.floor(Math.random() * pereiraReactions.length)]);
	};

});

function sendImage(message, args) {

	var search = args.slice(1).join(" ");
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

client.login(botToken.token);
