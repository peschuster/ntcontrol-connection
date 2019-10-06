import pcapng
from scapy.layers.l2 import Ether
from scapy.layers.inet import IP, TCP
from scapy.packet import Raw
import os
import sys
import hashlib
import json

def collect(scanner):
    result = {}
    for block in scanner:
        if isinstance(block, pcapng.blocks.EnhancedPacket):
            assert block.interface.link_type == 1  # must be ethernet!

            decoded = Ether(block.packet_data)
            # print(repr(Ether(block.packet_data))[:400] + '...')

            _pl1 = decoded.payload
            if isinstance(_pl1, IP):

                _pl2 = _pl1.payload
                if isinstance(_pl2, TCP):
                    if _pl2.payload.name == 'Raw' and len(_pl2.payload)  > 0:
                        if _pl2.dport != 1024 and _pl2.sport != 1024:
                            continue

                        item = {}
                        if _pl2.dport == 1024:
                            item['request'] = True
                            stream_id = _pl1.src + ':' + str(_pl2.sport) + '_'  + _pl1.dst + ':'  + str(_pl2.dport)
                        else:
                            item['request'] = False
                            stream_id = _pl1.dst + ':' + str(_pl2.dport) + '_'  + _pl1.src + ':'  + str(_pl2.sport)
                            
                        if not stream_id in result:
                            result[stream_id] = []
                        
                        item['data'] = _pl2.load.decode('ascii').strip('\r')
                        result[stream_id].append(item)
    
    return result

def get_messages(streams, user, password):
    commands = {}

    for stream in streams:
        data = streams[stream]
        token = None
        cmd = None
        response = []
        for packet in data:
            if token is None:
                if packet['request'] is False and packet['data'].startswith('NTCONTROL 1'):
                    m = hashlib.md5()
                    m.update((user + ':' + password + ':' + packet['data'][len('NTCONTROL 1 '):]).encode('ascii'))
                    token = m.hexdigest().upper()
                elif packet['request'] is False and packet['data'].startswith('NTCONTROL 0'):
                    token = ''
                else:
                    continue
            else:
                line = packet['data']
                if line.startswith(token):
                    line = packet['data'][len(token):]

                if line.startswith('20') or line.startswith('21') or line.startswith('00') or line.startswith('01'):
                    line = line[2:]

                if line.startswith('ADZZ;'):
                    line = line[len('ADZZ;'):]

                if packet['request'] is True:
                    if not cmd is None and len(response) > 0:
                        if not cmd in commands:
                            commands[cmd] = []

                        response_str = '\r'.join(response)
                        if not response_str in commands[cmd]:
                            commands[cmd].append(response_str)
                        cmd = None

                    cmd = line
                    response.clear()
                elif not cmd is None:
                    response.append(line)
                else:
                    print('Error in sequence: ' + packet['data'] + ' stream: ' + stream)

        if not cmd is None and len(response) > 0:
            if not cmd in commands:
                commands[cmd] = []

            response_str = '\r'.join(response)
            if not response_str in commands[cmd]:
                commands[cmd].append(response_str)
            cmd = None
    
    return commands



if __name__ == '__main__':
    result = {}
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'rb') as fp:
            scanner = pcapng.FileScanner(fp)
            result.update(collect(scanner))
    else:
        scandir = 'doc\\captures'
        for filename in os.listdir(scandir):
            if filename.endswith('.pcapng'): 
                with open(os.path.join(scandir, filename), 'rb') as fp:
                    scanner = pcapng.FileScanner(fp)
                    result.update(collect(scanner))
    
    commands = get_messages(result, 'admin1', 'panasonic')
    with open('commands.json', 'w') as fp:
        json.dump(commands, fp)
