const { Permissions } = require('discord.js');
const strings = require('../resources/strings.json');
const config = require('../config/config.json');
let cmds
let client
let commands = []

exports.init = (cl, cjson) => { client = cl; cmds = cjson }

function command (name, description, admin, arguments, fn) {
    this.name = name
    this.description = description
    this.admin = admin
    this.arguments = arguments
    this.function = fn

    this.run = function (message, args) {
        switch (this.admin) {
            case 1:
                if (!message.member.roles.cache.find(role => role.permissions.has(Permissions.FLAGS.ADMINISTRATOR))) { 
                    throw new Error(strings.err_no_admin) 
                }
                break;
            case 2:
                if (!config.operators.includes(message.author.id)) { throw new Error(strings.err_no_operator) }
                break;
        }

        let values = []

        for (i = 0; i < this.arguments.length; i++) {
            let value = null
            let isValid = true
            let optional = false
            let argument = this.arguments[i]
            
            if (argument.endsWith('?')) {
                argument = argument.substring(0,argument.length - 1)
                optional = true
            }

            if (args[i] !== undefined) {
                switch (argument) {
                    case 'member':
                        identifier = args[i].toLowerCase().replace(/^\@/,'')
                        
                        if (identifier === '*') {
                            value = message.guild.members
                        } else {
                            value = message.guild.members.find(x => 
                                x.id === identifier ||
                                x.user.username.toLowerCase().includes(identifier) || 
                                ((x.nickname !== null) ? x.nickname.toLowerCase().includes(identifier) : false)
                                )    
                                
                            if (value === null) {
                                throw new Error(strings.err_no_user)
                            }
                        }
                        break;
                    case 'channel':
                        identifier = args[i].toLowerCase();
                        value = message.guild.channels.resolve(identifier);

                        if (value === null) {
                            throw new Error(strings.err_no_channel)
                        }
                        break;
                    case 'string':
                        value = args[i]
                        break;
                    case 'number':
                        if (/^-?\d+$/g.test(args[i])) {
                            value = parseInt(args[i])
                        } else {
                            isValid = false
                        }
                        break;
                    case 'boolean':
                        if (args[i] === 'true' || args[i] === 'false') {
                            value = args[i] === 'true'
                        } else {
                            isValid = false
                        }
                        break;
                }
            } else {
                if (!optional) {
                    isValid = false
                }
            }

            if (!isValid) throw new Error(strings.err_invalid_arg + argument)

            values.push(value)
        }

        this.function(message, ...values)
    }
}

exports.registerCommand = (name, fn) => {
    if (!cmds.hasOwnProperty(name))
    {
        throw new Error(`Command '${name}' does not exist in commands.json and has not been registered!`)
    }

    let cmd = cmds[name]

    if (cmd.enabled instanceof Boolean && !cmd.enabled) return

    cmd.command = new command(name, cmd.tip, cmd.admin, cmd.args, fn)
}

exports.parse = msg => {
    let cmd = ''
    let args = []

    msg = msg.slice(config.prefix.length).trim()

    let str = ''
    let quoteUnpaired = false
    let codeUnpaired = false
    let newlineFound = false

    for (let i = 0; i < msg.length; i++) {
        const char = msg[i]

        if (codeUnpaired) {
            if (char === '`') {
                if (msg[i + 1] === '`' && msg[i + 2] === '`') {
                    codeUnpaired = false
                    if (str !== '') { args.push(str); str = '' }
                    i += 2
                }
            } else {
                str += char
            }
        } else if (quoteUnpaired) {
            if (char === '"') {
                quoteUnpaired = false
                if (str !== '') { args.push(str.toLowerCase()); str = '' }
            } else {
                str += char
            }
        } else {
            if (char === ' ' || (!newlineFound && char === '\n')) {
                newlineFound = (char === '\n')
                if (cmd === '') {
                    cmd = str.toLowerCase()
                    str = ''
                } else {
                    if (str !== '') { args.push(str.toLowerCase()); str = '' }
                }
            } else if (char === '"') {
                quoteUnpaired = true
            } else if (char === '`') {
                if (msg[i + 1] === '`' && msg[i + 2] === '`') {
                    codeUnpaired = true
                    i += 2
                }
            } else {
                str += char
            }
        }
        if (i === msg.length - 1) {
            if (str !== '') {
                if (cmd === '') {
                    cmd = str.toLowerCase()
                } else {
                    args.push(str.toLowerCase()); str = '' 
                }
            }
        }
    }

    return {cmd: cmd, args: args}
}