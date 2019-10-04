import { EventEmitter } from 'events'
import { NtControlConnection } from './NtControlConnection'

import { ProjectorInput, CommandInterface, GenericCommandInterface } from './Types'

import * as Commands from './Commands'

const EMPTY_LAMBDA = () => { /* nop */ }

interface ProjectorState {
    power: boolean
    freeze: boolean
    shutter: boolean
    lamps: number
    input: ProjectorInput | string
}

enum ProjectorQueryOperation {
    Power,
    Shutter,
    Freeze,
    Input,
    Lamps
}

export class Projector extends EventEmitter {

    public model: string | undefined

    public name: string | undefined

    private connection: NtControlConnection

    private state: ProjectorState

    private nextQueryOperation: ProjectorQueryOperation = ProjectorQueryOperation.Power

    private queryStateInterval: any

    constructor (connection: NtControlConnection) {
        super()

        this.connection = connection

        this.state = {
            power: false,
            freeze: false,
            shutter: false,
            lamps: 0,
            input: ProjectorInput.UNKOWN
        }

        if (connection.connected === true) {
            this.init()
        } else {
            connection.on('connect', () => {
                this.init()
            })
        }
    }

    public sendQuery (command: CommandInterface): Promise<string | undefined> {
        return this.connection.sendCommand(command.getQueryCommand())
    }

    public sendValue<T> (command: GenericCommandInterface<T>, value?: T | undefined): Promise<string | undefined> {
        const formatted = command.getSetCommand(value)
        if (formatted !== undefined) {
            return this.connection.sendCommand(formatted)
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
        this.connection.sendCommand('QID').then(response => {
            if (response !== undefined) {
                this.model = response
            }
        }, this.onError)

        this.connection.sendCommand('QVX:NCGS8').then(response => {
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
        switch (this.nextQueryOperation) {
            case ProjectorQueryOperation.Input:
                this.sendQuery(Commands.InputSelectCommand).then(response => {
                    if (response !== undefined) this.setState(() => this.state.input, v => this.state.input = v, 'INPUT', Commands.InputSelectCommand.parseResponse(response))
                }, this.onError)
                this.nextQueryOperation = ProjectorQueryOperation.Power
                break
            case ProjectorQueryOperation.Lamps:
                this.connection.sendCommand('QLS').then(response => {
                    if (response !== undefined) {
                        this.setState(() => this.state.lamps, v => this.state.lamps = v, 'LAMP', parseInt(response, 10))
                    }
                }, this.onError)
                this.nextQueryOperation = ProjectorQueryOperation.Input
                break
            case ProjectorQueryOperation.Shutter:
                this.sendQuery(Commands.ShutterCommand).then(response => {
                    if (response !== undefined) this.setState(() => this.state.shutter, v => this.state.shutter = v, 'SHUTTER', Commands.ShutterCommand.parseResponse(response))
                }, this.onError)
                this.nextQueryOperation = ProjectorQueryOperation.Lamps
                break
            case ProjectorQueryOperation.Freeze:
                this.sendQuery(Commands.FreezeCommand).then(response => {
                    if (response !== undefined) this.setState(() => this.state.freeze, v => this.state.freeze = v, 'FREEZE', Commands.FreezeCommand.parseResponse(response))
                }, this.onError)
                this.nextQueryOperation = ProjectorQueryOperation.Shutter
                break
            case ProjectorQueryOperation.Power:
            default:
                this.sendQuery(Commands.PowerCommand).then(response => {
                    if (response !== undefined) this.setState(() => this.state.power, v => this.state.power = v, 'POWER', Commands.PowerCommand.parseResponse(response))
                }, this.onError)
                this.nextQueryOperation = ProjectorQueryOperation.Freeze
                break
        }
    }

    private setState<T> (getter: () => T, setter: (v: T) => void, key: string, value: T) {
        if (getter() !== value) {
            setter(value)
            this.emit('state_change', key, value)
        }
    }

    private onError (err: Error) {
        console.log(err)
    }
}
