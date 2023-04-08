
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require ('dotenv')
dotenv.config()
const {TOKEN, CLIENT_ID, GUILD_ID, WIT_TOKEN} = process.env

//construção de commands
const fs = require("node:fs")
const path = require("node:path")

const commandsPath = path.join(__dirname, "commands")
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

for (const file of commandsFiles){
     const filepath = path.join(commandsPath, file)
     const commands = require(filepath)
     if ("data" in commands && "execute" in commands){
         client.commands.set(commands.data.name, commands)
     } else {
        console.log('comando em $(filepath) esta com "data" ou "execute off"')
     }
     console.log(file.commands)
}
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    const command = client.commands.get(commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Ocorreu um erro ao executar esse comando.', ephemeral: true });
    }
});
