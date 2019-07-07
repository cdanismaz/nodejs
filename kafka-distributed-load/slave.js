var net = require('net');
var masterconfig = require('./config/master-config');
var config = require('./config/slave-config'),
    kafkaConfig = config.kafkaConfig,
    testConfig = config.testConfig;
var kafka = require('kafka-node');
const uuid = require('uuid/v1');

var messageList = [];
var successCount = 0;
var failureCount = 0;
var startTime;

var client = new net.Socket();
client.connect(masterconfig.socket.port, masterconfig.socket.ip, () => {
    console.log("Connected to the master");
});

client.on('data', (command) => {
    console.log(command.toString());
    if (command.toString() == 'terminate') {
        client.end();
    }
    else if (command.toString() == 'start') {
        clearRecords();
        startLoadTest();
    }
})

client.on('close', () => {
    console.log('Connection closed');
})

function clearRecords() {
    successCount = 0;
    failureCount = 0;
    messageList = [];
}
function startLoadTest() {
    createMessageList();
    console.log(messageList.length + ' messages are ready. Commencing load');
    startTime = (new Date).getTime();
    sendmessageList();
    waitForCompletion();
}

function createMessageList() {
    for(var i =0; i < testConfig.loopCount; i++) {
        let incident = {
            id: uuid(),
            type: 'malware',
            file: 'cansu'
        };
        let message = new kafka.KeyedMessage(incident.id, incident);
        messageList.push({
            topic: kafkaConfig.topics.incidents,
            messages: message
        });
    }
};

function sendmessageList() {
    messageList.forEach(message => {
        let client = new kafka.KafkaClient({
            kafkaHost: kafkaConfig.brokers.cluster2
        });
        let producer = new kafka.Producer(client, kafkaConfig.producer.options);
        producer.on('ready', () => {
            producer.send([message], (err,data) => {
                if(err) {
                    console.log(err);
                    failureCount++;
                }
                else if(data) {
                    successCount++;
                }
                producer.close();
            })
        })
    });
    
}

async function waitForCompletion() {
    while(shouldWait()) {
        await sleep(50);
    }
    var endTime =(new Date).getTime();

    console.log("Process completed. " + messageList.length + " messages have been sent");
    console.log("Success count: " + successCount);
    console.log("Failure count: " + failureCount);
    console.log("Start time: " + startTime);
    console.log("End time: " + endTime);
    console.log("Duration: " + (endTime-startTime));
}

function shouldWait() {
    return successCount + failureCount != messageList.length;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}