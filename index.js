const PREFIX = "!"; // Prefix for the bot to respond to
const PLAYING = "with stuff"; // comes after the playing status
const USE_PLAYING = true; // If you dont want the playing status set this to false
const TOKEN = "bot_token"; // Required to login to the bot
const VERIFY_ON_JOIN = false; // Will the user be auto-verified or will they need to use a command like !verify
const ROLES = {
    memberRole: "id of @member", // The normal role for everyone. To only allocate this to people with no other house role change ALL_MEMBERS to false
    allMembers: true, // Alocate the "memberRole" to all members?
    balanceRole: "id of @balance", // The role for anyone with the balance badge
    balanceChannel: "id of #balance", // The channel to send balance welcomes to. Leave blank to disable (or change to null)
    braveryRole: "id of @bravery", // The role for anyone with the bravery bade
    braveryChannel: "id of #bravery", // The channel to send bravery welcomes to. Leave blank to disable (or change to null)
    brillianceRole: "id of @brilliance", // The role for anyone with the brilliance badge
    brillianceChannel: "id of #brilliance" // The channel to send brilliance welcomes to. Leave blank to disable (or change to null)
}

const Discord = require('discord.js');
const Client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
    partials: ["GUILD_MEMBER"],
    fetchAllMembers: true
});

Client.on('ready', () => {
    console.log(`Logged in as ${Client.user.tag}`);
    Client.user.setStatus('online');
    if (USE_PLAYING) Client.user.setPresence({ activities: [{ name: PLAYING }] });
});

Client.on('messageCreate', (message) => {
    if (!message.content.startsWith(PREFIX) && message.author.bot) return;

    const args = message.content.toLowerCase().slice(PREFIX.length).split(/ +/);
    const command = args.shift();

    if (commands_aliases.updateRoles.includes(command)) {
        allocateCorrectHouseRoles(message);
    }
});

Client.on('guildMemberAdd', (member) => {
    if (!VERIFY_ON_JOIN) return;

    const message = {
        user: member.user,
        member,
        author: member.user,
        delete: () => {
            return true;
        },
        channel: {
            send: () => {
                return new Promise((resolve, reject) => {
                    reject("This is not a command, its a member :D");
                })
            }
        }
    }

    allocateCorrectHouseRoles(message);
})

Client.login(TOKEN);

const commands_aliases = {
    updateRoles: ["updateroles", "ur", "rolesupdate", "update", "roles", "verify"]
}

async function allocateCorrectHouseRoles(message) {
    userflags = await message.author.flags.toArray();

    const member = message.member;

    const EX_SQUAD = null;

    if (userflags.includes("HOUSE_BRAVERY")) squad = "Bravery";
    if (userflags.includes("HOUSE_BALANCE")) squad = "Balance";
    if (userflags.includes("HOUSE_BRILLIANCE")) squad = "Brilliance";

    if (member.roles.includes(ROLES.balanceRole)) {
        if (squad !== "Balance") return message.channel.send({ content: 'You haven\'t changed squad!' }).catch((e) => {
            console.log(e);
        });
        EX_SQUAD = "Balance";
    }

    if (member.roles.includes(ROLES.braveryRole)) {
        if (squad !== "Bravery") return message.channel.send({ content: 'You haven\'t changed squad!' }).catch((e) => {
            console.log(e);
        });;
        EX_SQUAD = "Bravery";
    }

    if (member.roles.includes(ROLES.brillianceRole)) {
        if (squad !== "Brilliance") return message.channel.send({ content: 'You haven\'t changed squad!' }).catch((e) => {
            console.log(e);
        });;
        EX_SQUAD = "Brilliance";
    }

    try {
        member.roles.remove(ROLES.balanceRole);
        member.roles.remove(ROLES.brillianceRole);
        member.roles.remove(ROLES.braveryRole);
        if (!ROLES.allMembers) member.roles.remove(ROLES.memberRole);
    } catch (e) {
        console.log(e);
    }

    if (squad == "Bravery") {
        if (ROLES.braveryRole) member.roles.add(ROLES.braveryRole);
        if (EX_SQUAD && ROLES.braveryChannel) Client.channels.cache.get(ROLES.braveryChannel).send({ content: `Welcome to Bravery ${member.author.username}, we are so much better than ${EX_SQUAD}!` }).catch((e) => {
            console.log(e);
        })
        else if (ROLES.braveryChannel) Client.channels.cache.get(ROLES.braveryChannel).send({ content: `Welcome to Bravery ${member.author.username}!` }).catch((e) => {
            console.log(e);
        });
    } if (squad == "Balance") {
        if (ROLES.balanceRole) member.roles.add(ROLES.balanceRole);
        if (EX_SQUAD && ROLES.balanceChannel) Client.channels.cache.get(ROLES.balanceChannel).send({ content: `Welcome to Balance ${member.author.username}, we are so much better than ${EX_SQUAD}!` }).catch((e) => {
            console.log(e);
        })
        else if (ROLES.balanceChannel) Client.channels.cache.get(ROLES.balanceChannel).send({ content: `Welcome to Balance ${member.author.username}!` }).catch((e) => {
            console.log(e);
        });
    } if (squad == "Brilliance") {
        if (ROLES.brillianceRole) member.roles.add(ROLES.brillianceRole);
        if (EX_SQUAD && ROLES.brillianceChannel) Client.channels.cache.get(ROLES.brillianceChannel).send({ content: `Welcome to Brilliance ${member.author.username}, we are so much better than ${EX_SQUAD}!` }).catch((e) => {
            console.log(e);
        })
        else if (ROLES.balanceChannel) Client.channels.cache.get(ROLES.balanceChannel).send({ content: `Welcome to Brilliance ${member.author.username}!` }).catch((e) => {
            console.log(e);
        });
    };
    if (!squad || ROLES.allMembers) {
        member.roles.add(ROLES.memberRole);
    }

    message.delete();
};
