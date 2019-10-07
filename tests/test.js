var NtControl = require('../dist')
var Types = require('../dist/Types')

const conn = new NtControl.Client('127.0.0.1', 1024, (l, m) => console.log(l + ' - ' + m))
conn.setAuthentication('admin1', 'panasonic')

const pj = new NtControl.Projector(conn)
conn.connect()

conn.on('connect', () => {
    setTimeout(() => {
        pj.sendQuery(NtControl.InputSelectCommand).then(data => console.log('Got data: ' + data), err => console.log(err))
    }, 1000)
})
