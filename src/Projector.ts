import { EventEmitter } from 'events'
import { Client } from './Client'

import { ProjectorInput, CommandInterface, GenericCommandInterface, LampStatus } from './Types'

import * as Commands from './Commands'
import { ResponseCode } from './Responses'

const EMPTY_LAMBDA = () => { /* nop */ }

interface ProjectorState {
    power: CommandState<boolean>
    freeze: CommandState<boolean>
    shutter: CommandState<boolean>
    lamps: CommandState<LampStatus>
    input: CommandState<ProjectorInput>
}

interface UnsupportedCommandListInterface {
    [model: string]: string[] | undefined
}

class CommandSupportCache {
    private cache: UnsupportedCommandListInterface = {}

    public isSupported (model: string | undefined, cmd: string): boolean {
        if (model === undefined) return true
        return !(this.cache[model] || []).includes(cmd)
    }

    public markUnsupported (model: string | undefined, cmd: string): void {
        if (model === undefined) return

        if (this.cache[model] === undefined) {
            this.cache[model] = [ cmd ]
        } else {
            (this.cache[model] || []).push(cmd)
        }
    }
}

interface CommandStateInterface {
    disabled: boolean
    queryValue (): Promise<any>
}

class CommandState<T> implements CommandStateInterface {
    private cmd: GenericCommandInterface<T>

    private connection: Client

    private value: T | undefined

    public disabled: boolean = false

    private changed: ((v: T | undefined) => void) | undefined

    constructor (cmd: GenericCommandInterface<T>, connection: Client, changed?: (v: T | undefined) => void) {
        this.cmd = cmd
        this.connection = connection
        this.changed = changed
    }

    public queryValue (): Promise<T> {
        return new Promise((resolve, reject) => {
            const cmd = this.cmd.getQueryCommand()
            if (cmd === undefined) {
                reject()
                return
            }

            this.connection.sendCommand(cmd, this.cmd.type)
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
                    }
                    reject(err)
                })
        })
    }

    public getValue (): T | undefined {
        return this.value
    }
}

export class Projector extends EventEmitter {

    public model: string | undefined

    public name: string | undefined

    private connection: Client

    private state: ProjectorState

    private queryList: CommandStateInterface[] = []

    private queryIndex: number = 0

    private queryStateInterval: any

    private static unsupportedCommands = new CommandSupportCache()

    constructor (connection: Client) {
        super()

        this.connection = connection

        this.state = {
            power: new CommandState(Commands.PowerCommand, connection, v => this.emit('state_change', 'POWER', v)),
            freeze: new CommandState(Commands.FreezeCommand, connection, v => this.emit('state_change', 'SHUTTER', v)),
            shutter: new CommandState(Commands.ShutterCommand, connection, v => this.emit('state_change', 'FREEZE', v)),
            lamps: new CommandState(Commands.LampStatusCommand, connection, v => this.emit('state_change', 'LAMP', v)),
            input: new CommandState(Commands.InputSelectCommand, connection, v => this.emit('state_change', 'INPUT', v))
        }

        this.queryList.push(this.state.power)
        this.queryList.push(this.state.freeze)
        this.queryList.push(this.state.shutter)
        this.queryList.push(this.state.lamps)
        this.queryList.push(this.state.input)

        if (connection.connected === true) {
            this.init()
        } else {
            connection.on('connect', () => {
                this.init()
            })
        }
    }

    public sendQuery (command: CommandInterface): Promise<string | undefined> {
        const formatted = command.getQueryCommand()
        if (formatted !== undefined && Projector.unsupportedCommands.isSupported(this.model, formatted)) {
            const promise = this.connection.sendCommand(formatted, command.type)
            promise.catch(err => this.onError(err, formatted))
            return promise
        }
        return Promise.reject()
    }

    public sendValue<T> (command: GenericCommandInterface<T>, value?: T | undefined): Promise<string | undefined> {
        const formatted = command.getSetCommand(value)
        if (formatted !== undefined && Projector.unsupportedCommands.isSupported(this.model, formatted)) {
            const promise = this.connection.sendCommand(formatted, command.type)
            promise.catch(err => this.onError(err, formatted))
            return promise
        }
        return Promise.reject()
    }

    public setPower (power?: boolean | undefined) {
        if (power === undefined) {
            power = !this.state.power
        }
        this.sendValue(Commands.PowerCommand, power).then(EMPTY_LAMBDA, this.onError)
    }

    public setFreeze (freeze?: boolean | undefined) {
        if (freeze === undefined) {
            freeze = !this.state.freeze
        }
        this.sendValue(Commands.FreezeCommand, freeze).then(EMPTY_LAMBDA, this.onError)
    }

    public setShutter (shutter?: boolean | undefined) {
        if (shutter !== undefined) {
            this.sendValue(Commands.ShutterCommand, shutter).then(EMPTY_LAMBDA, this.onError)
        } else {
            // toggle
            this.sendValue(Commands.ShutterCommand).then(EMPTY_LAMBDA, err => {
                if (err.message === 'ERR1') {
                    // toggle not supported => try 'manually'
                    this.setShutter(!this.state.shutter)
                }
            })
        }
    }

    public setInput (input: ProjectorInput) {
        this.sendValue(Commands.InputSelectCommand, input).then(EMPTY_LAMBDA, this.onError)
    }

    private init () {
        this.sendQuery(Commands.ModelNameCommand).then(response => {
            if (response !== undefined) {
                this.model = response
            }
        }, this.onError)

        this.sendQuery(Commands.ProjectorNameCommand).then(response => {
            if (response !== undefined) {
                this.name = response
            }
        }, this.onError)

        if (this.queryStateInterval !== undefined) {
            clearInterval(this.queryStateInterval)
            delete this.queryStateInterval
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
        console.log(err)

        if (err.message === ResponseCode.ER401 && cmd !== undefined && this.model !== undefined) {
            Projector.unsupportedCommands.markUnsupported(this.model, cmd)
        }
    }
}
