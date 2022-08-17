const { Client, GatewayIntentBits, discordSort, ActivityType, ModalSubmitFields, MessageFlags } = require("discord.js");
const fs = require("fs");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const log = require("./token.json");
var listening = false;
const prefix = "-";
client.on("ready", () => {
  console.log(`Client: ${client.user.tag} On.`);
});

client.on("messageCreate", (msg) => {
  if (msg.content.startsWith(prefix)) {
    if (msg.content.endsWith("Create")) {
      const exits = fs.existsSync(`./intagrations/${msg.author.tag}.json`)
      if (exits === true) {
        msg.author.send(`You already have 1 webhook ${fs.readFileSync(`./intagrations/${msg.author.tag}.json`)}`);
      } else if (exits === false) {
        msg.reply("Send the webhook.");
        listening = true;
      }
    }
  };
  if (listening === true) {
    if (msg.content.startsWith("https://discord.com/api/webhooks/")) {
      if (msg.content.length === 121) {
        fs.writeFile(
          `./intagrations/${msg.author.tag}.json`,
          JSON.stringify(msg.content),
          (err) => {
            if (err) {
              return console.log(err);
            } else {
              msg.author.send('Webhook Created.')
            }
          }
        );
      }
      } else if(msg.content.lenght > 121) {
        msg.author.reply('Invalid webhook or lenght.')
      }
  } else {
    listening = false;
  };
  if (msg.content.startsWith(prefix)) {
    if (msg.content.endsWith("Delete")) {
      fs.unlink(`./intagrations/${msg.author.tag}.json`, function(err) {
        if (err) {
           return console.log(err);
        } else {
            msg.author.send('Webhook Deleted.');
        }
      })
    } else if (msg.content.endsWith('Hooks')) {
      const check = fs.existsSync(`./intagrations/${msg.author.tag}.json`);
      if (check===true) {
        const hook = fs.readFileSync(`./intagrations/${msg.author.tag}.json`);
        msg.author.send(`Heres your hook. ${fs.readFileSync(`./intagrations/${msg.author.tag}.json`)}`);
      } else if (check===false) {
        msg.author.send('You have no webhooks.');
      }
    }
  }
});

client
  .login(log.token)
  .then(() => {
    client.user.setUsername("Webhook Bot");
    client.user.setActivity('For Commands.', { type: ActivityType.Watching });
  })
  .catch((err) => console.log(err));
