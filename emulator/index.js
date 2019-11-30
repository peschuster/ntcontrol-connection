const fs = require('fs')
const net = require('net')
const crypto = require('crypto')
const path = require('path')

const DEFAULT_PORT = 1024
const PROTOCOL_LINE_BREAK = '\r'

const ProtocolPrefix = [ '00', '01', '20', '21' ]

const commandsFile = fs.readFileSync(path.join(path.dirname(__filename), 'commands.json'))
const commands = JSON.parse(commandsFile)

const user = 'admin1'
const password = 'panasonic'

const clients = []

function send(socket, data) {
    try {
        socket.write(data + PROTOCOL_LINE_BREAK)
        console.log('Sent: ' + data)
    } catch (e) {
        try {
            socket.end()
        } catch (e) {
            console.log(e)
        }

        const index = clients.indexOf(socket)
        if (index >= 0) {
            clients.splice(index, 1);
        }
    }
}

const cmdValues = {}

const server = net.createServer(socket => {

    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort 

    crypto.randomBytes(4, (err, buf) => {
        if (err) throw err
        socket.salt = buf.toString('hex')
        socket.token = crypto.createHash('md5')
                    .update(user + ':' + password + ':' + socket.salt, 'ascii')
                    .digest('hex')
                    .toUpperCase()
        send(socket, 'NTCONTROL 1 ' + socket.salt)
      });
    
    // Put this new client in the list
    clients.push(socket);
    socket.receivebuffer = ''
  
    // Handle incoming messages from clients.
    socket.on('data', function (chunk) {
        let i = 0
        let line = ''
        let offset = 0
        socket.receivebuffer += chunk

        while (1) {
            i = socket.receivebuffer.indexOf(PROTOCOL_LINE_BREAK, offset)
            if (i === -1) break

            line = socket.receivebuffer.substr(offset, i - offset)
            offset = i + 1

            socket.emit('receiveline', line.toString())
        }

        socket.receivebuffer = this.receivebuffer.substr(offset)
    });
    
    socket.on('receiveline', function (line) {
        if (line.substring(0, socket.token.length) === socket.token) {
            line = line.substring(socket.token.length)
        }

        console.log('Received: ' + line)
        if (Object.values(ProtocolPrefix).includes(line.substring(0, 2))) {
            const prefix = line.substring(0, 2)
            let cmd = line.substring(2)
            if (cmd.substring(0, 5) == 'ADZZ;') {
                cmd = cmd.substring(5)
            }

            let response = undefined
            if (cmd.substring(0, 1) == 'O' || cmd.substring(0, 1) == 'V' || cmd == 'PON' || cmd == 'POF' || cmd.substring(0, 3) == 'IIS') {
                // Just echo back set commands
                response = cmd
                // Save value
                let baseCmd = cmd.substring(1)
                let key, value
                if (baseCmd.indexOf('=') > 0) {
                    [ key, value ] = baseCmd.split('=', 2)
                } else if (baseCmd.substring(0, 2) == 'IS') {
                    key = 'IN'
                    value = baseCmd.split(':', 2)[1]
                    response = value
                } else if (baseCmd.indexOf(':') > 0) {
                    [ key, value ] = baseCmd.split(':', 2)
                } else if (baseCmd == 'ON') {
                    key = 'PW'
                    value = '001'
                    response = value
                } else if (baseCmd == 'OF') {
                    key = 'PW'
                    value = '000'
                    response = value
                }

                if (key !== undefined && value !== undefined) {
                    cmdValues[key] = value
                    console.log('--> Setting "' + key + '" to "' + value + '"')
                }
            } else if (cmd.substring(0, 1) == 'Q' && cmdValues[cmd.substring(1).replace('VX', 'XX')] !== undefined) {
                response = cmdValues[cmd.substring(1).replace('VX', 'XX')]
            } else if (commands[cmd] !== undefined) {
                let responseList = commands[cmd]
                if (responseList.length > 1) {
                    response = responseList[Math.floor(Math.random() * responseList.length)]
                } else {
                    response = responseList[0]
                }
            } else {
                response = 'ER401'
                console.log('Unknown: ' + cmd)
            }

            if (response !== undefined) {
                for (let line of response.split('\r')) {
                    send(socket, prefix + line)
                }
            }
            
        } else {
            send(socket, '20ERRA')
        }
    })
  
    // Remove the client from the list when it leaves
    socket.on('end', function () {
        const index = clients.indexOf(socket)
        if (index >= 0) {
            clients.splice(index, 1);
        }
    })
    
    socket.on("error", (err) => {
      console.log(err.stack)
    })
})

server.listen(DEFAULT_PORT, '127.0.0.1')
