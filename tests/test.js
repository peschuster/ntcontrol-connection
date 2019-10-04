var NtControl = require('../dist')
var Types = require('../dist/Types')

const conn = new NtControl.NtControlConnection('10.1.1.35', 1024, 'admin1', 'panasonic', (l, m) => console.log(l + ' - ' + m))
const pj = new NtControl.Projector(conn)
conn.connect()

conn.on('connect', () => {
    setTimeout(() => {
        pj.sendQuery(NtControl.LensPositionVerticalCommand).then(data => console.log(data), err => console.log(err))
    }, 1000)
})
