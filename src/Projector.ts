import { EventEmitter } from 'events'
import { Client } from './Client'

import { ProjectorInput } from './Types'
import { CommandInterface, GenericCommandInterface } from './GenericCommands'

import * as Commands from './Commands'
import { ResponseCode, getResponseDescription } from './Responses'

const EMPTY_LAMBDA = () => { /* nop */ }

interface CommandStateInterface {
    disabled: boolean
    queryValue (): Promise<any>
    getName (): string
    getLabel (): string
    getValue (): any
}

class CommandState<T> implements CommandStateInterface {
    private cmd: GenericCommandInterface<T>

    private connectionFactory: () => (Client | undefined)

    private value: T | undefined

    public disabled: boolean = false

    private changed: ((v: T | undefined) => void) | undefined

    private log: (level: string, msg: string) => void = EMPTY_LAMBDA

    constructor (cmd: GenericCommandInterface<T>, connectionFactory: () => (Client | undefined), changed?: (v: T | undefined) => void, log?: (level: string, msg: string) => void) {
        this.cmd = cmd
        this.connectionFactory = connectionFactory
        this.changed = changed

        if (log !== undefined) {
            this.log = log
        }
    }

    public queryValue (): Promise<T> {
        return new Promise((resolve, reject) => {
            const cmd = this.cmd.getQueryCommand()
            if (cmd === undefined) {
                reject(new Error('query command not implemented'))
                return
            }

            const connection = this.connectionFactory()
            if (connection === undefined) {
                reject(new Error('no connection available'))
                return
            }

            connection.sendCommand(cmd, this.cmd.type)
                .then(response => {
                    const value = this.cmd.parseResponse(response || '')
                    if (this.value !== value) {
                        this.value = value
                        if (this.changed !== undefined) {
                            this.changed(value)
                        }
                    }
                    resolve(value)
                },
                err => {
                    if (err === ResponseCode.ER401 || err.message === ResponseCode.ER401) {
                        this.disabled = true
                        this.value = undefined
                        this.log('warn', 'Disabeling unsupported command: ' + this.cmd.label)
                    }
                    reject(err)
                })
        })
    }

    public getValue (): T | undefined {
        return this.value
    }

    public getName (): string {
        return this.cmd.getName()
    }

    public getLabel (): string {
        return this.cmd.label
    }
}

export class Projector extends EventEmitter {

    public model: string | undefined

    public name: string | undefined

    private connection: Client | undefined

    private queryList: CommandStateInterface[] = []

    private queryIndex: number = 0

    private queryStateInterval: any

    private authLogPending: NodeJS.Timeout | undefined

    private log: (level: string, msg: string) => void = () => { /* nop */ }

    public static Events = {
        STATE_CHANGE: 'state_change'
    }

    constructor (connection: Client, log?: (level: string, msg: string) => void) {
        super()

        if (log !== undefined) {
            this.log = log
        }

        this.updateConnection(connection)

        this.addMonitoring(Commands.PowerCommand)
        this.addMonitoring(Commands.FreezeCommand)
        this.addMonitoring(Commands.ShutterCommand)
        this.addMonitoring(Commands.InputSelectCommand)
        this.addMonitoring(Commands.LampControlStatusCommand)
    }

    public updateConnection (connection: Client): void {
        if (connection.connected === true) {
            this.init(connection)
        } else {
            connection.on(Client.Events.CONNECT, () => {
                this.init(connection)
            })
        }
    }

    public sendQuery (command: CommandInterface): Promise<string | undefined> {
        if (this.connection === undefined) {
            return Promise.reject(new Error('no connection available'))
        }

        const formatted = command.getQueryCommand()
        if (formatted !== undefined) {
            const promise = this.connection.sendCommand(formatted, command.type)
            return promise
        }

        return Promise.reject(new Error('query command not implemented'))
    }

    public sendValue<T> (command: GenericCommandInterface<T>, value?: T | undefined): Promise<string | undefined> {
        if (this.connection === undefined) {
            return Promise.reject(new Error('no connection available'))
        }

        const formatted = command.getSetCommand(value)
        if (formatted !== undefined) {
            const promise = this.connection.sendCommand(formatted, command.type)
            return promise
        }

        return Promise.reject(new Error('invalid value or command not implemented'))
    }

    public getValue<T> (cmd: GenericCommandInterface<T>): Promise<T | undefined> {
        for (const item of this.queryList) {
            if (item.getName() === cmd.getName()) {
                return Promise.resolve(item.getValue() as T | undefined)
            }
        }

        return new Promise<T | undefined>((resolve, reject) => {
            this.sendQuery(cmd).then(response => {
                resolve(cmd.parseResponse(response || ''))
            }, reject)
        })
    }

    /**
     * Adds command to a list of cyclic queried commands.
     * If the result of a command changes, a 'state_change' is triggered
     * with the following signate: (command_label, new_value)
     * @param command The command to be monitored (cyclic querying of the projector)
     */
    public addMonitoring<T> (command: GenericCommandInterface<T>): void {
        const state = new CommandState(command, () => this.connection, v => this.emit(Projector.Events.STATE_CHANGE, command.label, v), this.log)
        this.queryList.push(state)
    }

    public removeMonitoring<T> (command: GenericCommandInterface<T>): boolean {
        for (const state of this.queryList) {
            if (state.getName() === command.getName()) {
                // Get index in list
                const index = this.queryList.indexOf(state)
                if (index >= 0) {
                    // remove command from list
                    this.queryList.splice(index, 1)
                    return true
                }
            }
        }

        return false
    }

    private sendToggleCommand (cmd: GenericCommandInterface<boolean>, value?: boolean): void {
        if (value === undefined) {
            this.getValue(cmd).then(v => {
                this.sendValue(cmd, !v).then(EMPTY_LAMBDA, this.onError.bind(this))
            }, this.onError.bind(this))
        } else {
            this.sendValue(cmd, value).then(EMPTY_LAMBDA, this.onError.bind(this))
        }
    }

    public setPower (power?: boolean | undefined) {
        this.sendToggleCommand(Commands.PowerCommand, power)
    }

    public setFreeze (freeze?: boolean | undefined) {
        this.sendToggleCommand(Commands.FreezeCommand, freeze)
    }

    public setShutter (shutter?: boolean | undefined) {
        this.sendToggleCommand(Commands.ShutterCommand, shutter)
    }

    public setInput (input: ProjectorInput) {
        this.sendValue(Commands.InputSelectCommand, input).then(EMPTY_LAMBDA, this.onError.bind(this))
    }

    private init (connection: Client) {

        if (this.connection !== undefined) {
            // TODO: remove listener?
        }

        this.connection = connection

        this.sendQuery(Commands.ModelNameCommand).then(response => {
            if (response !== undefined) {
                this.model = Commands.ModelNameCommand.parseResponse(response)
                this.emit(Projector.Events.STATE_CHANGE, 'model', this.model)
            }

            // Query name
            this.sendQuery(Commands.ProjectorNameCommand).then(response => {
                if (response !== undefined) {
                    this.name = Commands.ProjectorNameCommand.parseResponse(response)
                    this.emit(Projector.Events.STATE_CHANGE, 'name', this.name)
                }
            }, this.onError.bind(this))

        }, this.onError.bind(this))

        if (this.queryStateInterval !== undefined) {
            clearInterval(this.queryStateInterval)
            delete this.queryStateInterval
        }

        // reset command states
        for (const state of this.queryList) {
            state.disabled = false
        }

        this.queryStateInterval = setInterval(() => this.queryState(), 200)
    }

    private queryState () {
        if (this.queryList.length === 0) return

        if (this.queryIndex >= this.queryList.length) {
            this.queryIndex = 0
        }

        let query: CommandStateInterface | undefined
        while (this.queryIndex < this.queryList.length) {
            if (this.queryList[this.queryIndex].disabled) {
                this.queryIndex += 1
            } else {
                query = this.queryList[this.queryIndex]
                break
            }
        }

        if (query !== undefined) {
            query.queryValue().then(EMPTY_LAMBDA, EMPTY_LAMBDA)
        }

        this.queryIndex += 1
    }

    private onError (err: Error, cmd?: string) {
        if (cmd !== undefined) {
            this.log('error', 'Command "' + cmd + '" resulted in error: ' + (err.message || err))
        } else {
            const msg = err.message || err
            const description = getResponseDescription(msg as ResponseCode)
            if (msg === ResponseCode.ERRA) {
                // Invalid authentication
                if (this.queryStateInterval !== undefined) {
                    clearInterval(this.queryStateInterval)
                    delete this.queryStateInterval
                }

                // Throttle logging
                // tslint:disable-next-line:tsr-detect-possible-timing-attacks
                if (this.authLogPending === undefined) {
                    this.authLogPending = setTimeout(() => {
                        this.log('error', 'Authentication failed. Invalid credentials.')
                        delete this.authLogPending
                    }, 250)
                }
            } else {
                this.log('error', 'Received error: ' + msg + (description === undefined ? '' : ' (' + description + ')'))
            }
        }
    }
}
