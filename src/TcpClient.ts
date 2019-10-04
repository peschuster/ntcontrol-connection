/*
 * This file is part of the Companion project
 * Copyright (c) 2018 Bitfocus AS
 * Authors: William Viker <william@bitfocus.io>, Håkon Nessjøen <haakon@bitfocus.io>
 *
 * This program is free software.
 * You should have received a copy of the MIT licence as well as the Bitfocus
 * Individual Contributor License Agreement for companion along with
 * this program.
 *
 * You can be released from the requirements of the license by purchasing
 * a commercial license. Buying such a license is mandatory as soon as you
 * develop commercial activities involving the Companion software without
 * disclosing the source code of your own applications.
 */

 // Rewritten to typescript

import * as net from 'net'
import { EventEmitter } from 'events'

export enum ClientStatus {
    Unkown = -1,
    Ok = 0,
    Warning = 1,
    Error = 2
}

export interface ClientOptions {
    reconnect_interval?: number
    reconnect?: boolean
}

const DEFAULT_RECONNECT_INTERVAL: number = 2000

const tcpSockets: net.Socket[] = []

const debug: (msg: string) => void = console.log

export class TcpClient extends EventEmitter {

    public connected: boolean = false

    private host: string

    private port: number

    private status: ClientStatus = ClientStatus.Unkown

    private options: ClientOptions

    private trying: boolean = false

    private tryTimer: any

    private failedAttempts: number = 0

    private socket: net.Socket

    constructor (host: string, port: number, options?: ClientOptions | undefined) {
        super()

        this.host = host
        this.port = port
        this.options = options === undefined ? {} : options

        if (this.options.reconnect_interval === undefined) {
            this.options.reconnect_interval = DEFAULT_RECONNECT_INTERVAL
        }

        if (this.options.reconnect === undefined) {
            this.options.reconnect = true
        }

        this.socket = new net.Socket()
        this.socket.setKeepAlive(true)
        this.socket.setNoDelay(true)

        debug('new tcp instance for sending to ' + host)

        this.socket.on('error', (err: Error) => {
            this.trying = false
            this.connected = false

            if (this.options.reconnect) {
                this.restartReconnect()
            }

            // status levels: null = unknown, 0 = ok, 1 = warning, 2 = error
            debug('error: ' + err.message)
            this.new_status(ClientStatus.Error, err.message)
            this.emit('error', err)
        })

        this.socket.on('connect', () => {
            this.failedAttempts = 0
            this.connected = true
            this.trying = false

            this.new_status(ClientStatus.Ok)
            this.emit('connect', this.socket)
        })

        this.socket.on('end', () => {
            debug('Disconnected')

            this.connected = false
            this.new_status(ClientStatus.Error, 'Disconnected')

            if (!this.trying && this.options.reconnect) {
                this.restartReconnect()
            }

            this.emit('end')
        })

        this.socket.on('data', this.emit.bind(this, 'data'))
        this.socket.on('drain', this.emit.bind(this, 'drain'))

        tcpSockets.push(this.socket)
        debug(tcpSockets.length + ' TCP sockets in use (+1)')

        // Let caller install event handlers first
        setImmediate(this.connect.bind(this))

        return this
    }

    public connect () {
        if (!this.trying) {
            this.trying = true
            this.socket.connect(this.port, this.host)
        }
    }

    public write (message: string | undefined, cb?: any): boolean {
        return this.send(message, cb)
    }

    public send (message: string | undefined, cb?: (err?: Error | undefined) => void): boolean {
        if (this.connected && message !== undefined) {
            debug('sending ' + message.length + ' bytes to ' + this.host + ':' + this.port)

            this.socket.write(message, (err: Error | undefined) => {
                if (err) {
                    this.new_status(ClientStatus.Error, err.message)
                    this.emit('error', err)

                    if (typeof cb === 'function') {
                        cb(err)
                    }

                    return
                }

                if (typeof cb === 'function') {
                    cb()
                }
            })

            return true
        } else {
            debug('Tried to send, but not connected')
            return false
        }
    }

    public destroy () {
        if (this.tryTimer !== undefined) {
            clearTimeout(this.tryTimer)
        }

        if (tcpSockets.indexOf(this.socket) !== -1) {
            tcpSockets.splice(tcpSockets.indexOf(this.socket), 1)
            debug(tcpSockets.length + ' TCP sockets in use (-1)')
        }

        this.socket.removeAllListeners()
        this.removeAllListeners()
        this.socket.destroy()
    }

    private new_status (status: ClientStatus, message?: string | undefined) {
        if (this.status !== status) {
            this.status = status
            this.emit('status_change', status, message)
        }
    }

    private restartReconnect () {
        if (this.tryTimer !== undefined) {
            clearTimeout(this.tryTimer)
        }

        this.tryTimer = setTimeout(() => this.tcp_reconnect(), this.options.reconnect_interval || DEFAULT_RECONNECT_INTERVAL)
    }

    private tcp_reconnect () {
        delete this.tryTimer

        this.new_status(ClientStatus.Warning, 'Connecting')
        this.failedAttempts++
        debug('Reconnecting to ' + this.host + ':' + this.port + ', retry ' + this.failedAttempts)

        this.connect()
    }
}
