import * as crypto from 'crypto'
import { EventEmitter } from 'events'

import { TcpClient } from './TcpClient'
import { ResponseCode, getResponseDescription } from './Responses'
import { CommandType } from './Types'

const DEFAULT_PORT: number = 1024
const PROTOCOL_LINE_BREAK: string = '\r'

const AUTO_RESOLVE_TIME: number = 200

enum ProtocolPrefix {
    SINGLE_COMMAND_ASCII = '00',
    SINGLE_COMMAND_BINARY = '01',
    PERSISTENT_ASCII = '20',
    PERSISTENT_BIN = '21'
}

interface InternalPromise {
    resolve: (d?: any) => void
    reject: (err: Error) => void
}

export class Client extends EventEmitter {

    private host: string

    private port: number

    private user: string | undefined

    private password: string | undefined

    private cmdStack: InternalPromise[]

    private socket: TcpClient | undefined

    private token: string | undefined

    private receivebuffer: string = ''

    public connected: boolean = false

    private log: (level: string, msg: string) => void = () => { /* nop */ }

    constructor (host: string, port: number | undefined, user: string | undefined, password: string | undefined, log?: (level: string, msg: string) => void | undefined) {
        super()

        this.host = host
        this.port = port || DEFAULT_PORT
        this.user = user
        this.password = password
        this.cmdStack = []

        if (log !== undefined) {
            this.log = log
        }
    }

    public connect () {
        this.destroy()

        this.socket = new TcpClient(this.host, this.port)

        if (this.host) {
            this.socket.on('error', () => {
                // Destory and reconnect (reject all pending responses).
                this.connect()
            })

            this.socket.on('timout', () => {
                // Destory and reconnect (reject all pending responses).
                this.connect()
            })

            this.socket.on('connect', () => {
                this.emit('debug', 'socket connect')
            })

            this.socket.on('end', () => {
                this.emit('end')
            })

            // separate buffered stream into lines with responses
            this.socket.on('data', (chunk) => this.onData(chunk))
            this.socket.on('receiveline', (line) => this.onReceiveLine(line))

            this.socket.connect()
        }
    }

    private setToken (salt: string): void {
        if (salt) {
            this.token = crypto.createHash('md5')
                .update(this.user + ':' + this.password + ':' + salt, 'ascii')
                .digest('hex')
                .toUpperCase()
        } else {
            this.token = ''
        }
    }

    private onData (chunk: string): void {
        let i = 0
        let line = ''
        let offset = 0
        this.receivebuffer += chunk

        while (1) {
            i = this.receivebuffer.indexOf(PROTOCOL_LINE_BREAK, offset)
            if (i === -1) break

            line = this.receivebuffer.substr(offset, i - offset)
            offset = i + 1

            if (this.socket !== undefined) {
                this.socket.emit('receiveline', line.toString())
            }
        }

        this.receivebuffer = this.receivebuffer.substr(offset)
    }

    private onReceiveLine (line: string): void {
        if (line.substring(0, 10) === 'NTCONTROL ') {
            // Greeting after connection setup

            let salt = ''
            if (line[10] === '1') {
                salt = line.substring(12)
            } else if (line[10] !== '0') {
                this.emit('debug', 'Unkown greeting: ' + line)
            }

            this.setToken(salt)
            this.connected = true
            this.emit('connect')

        } else if (Object.values(ProtocolPrefix).includes(line.substring(0, 2) as ProtocolPrefix)) {
            // Usual response
            const response = line.substring(2)

            const promise = this.cmdStack.pop()

            switch (response) {
                case ResponseCode.ERR1:
                case ResponseCode.ERR2:
                case ResponseCode.ERR3:
                case ResponseCode.ERR4:
                case ResponseCode.ERR5:
                case ResponseCode.ERRA:
                case ResponseCode.ER401:
                    this.log('error', 'Received error: ' + response + ' (' + getResponseDescription(response) + ')')
                    if (promise !== undefined) {
                        promise.reject(new Error(response))
                    }
                    break
                default:
                    this.emit('data', response)
                    if (promise !== undefined) {
                        promise.resolve(response)
                    }
                    break
            }
        } else {
            this.emit('debug', 'Unkown data received: ' + line)
        }
    }

    public sendCommand (cmd: string, type: CommandType = CommandType.Binary): Promise<string | undefined> {
        if (this.socket !== undefined) {
            return new Promise((resolve, reject) => {
                const promiseRef = { resolve, reject }
                this.cmdStack.push(promiseRef)

                if (this.socket !== undefined) {
                    const prefix = (type === CommandType.Binary) ? ProtocolPrefix.PERSISTENT_BIN : ProtocolPrefix.PERSISTENT_ASCII
                    this.socket.send(this.token + prefix + 'ADZZ;' + cmd + PROTOCOL_LINE_BREAK)
                }

                // Automatically resolve promise, if no response is received (not all cmds generate a response, but all might end with an error)
                setTimeout(() => this.autoResolve(promiseRef), AUTO_RESOLVE_TIME)
            })
        } else {
            return Promise.reject(new Error('No socket.'))
        }
    }

    public destroy () {
        if (this.socket !== undefined) {
            this.socket.destroy()
            delete this.socket
            this.connected = false

            let promise = this.cmdStack.pop()
            while (promise !== undefined) {
                promise.reject(new Error('Socket closed.'))
                promise = this.cmdStack.pop()
            }
        }
    }

    private autoResolve (promise: InternalPromise) {
        const index = this.cmdStack.indexOf(promise)
        if (index >= 0) {
            this.cmdStack.splice(index, 1)
            promise.resolve()
        }
    }

}
