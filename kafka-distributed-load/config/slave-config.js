var config = {
    kafkaConfig: {
        topics: {
            incidents: 'incidents-11'
        },
        brokers: {
            cluster1: '192.168.0.12:9092',
            cluster2: '192.168.0.12:9092,192.168.0.12:9093'
        },
        producer: {
            options: {
                // Configuration for when to consider a message as acknowledged, default 1
                requireAcks: 1,
                // The amount of time in milliseconds to wait for all acks before considered, default 100ms
                ackTimeoutMs: 100,
                // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
                partitionerType: 3
            }
        }
    },
    testConfig: {
        loopCount: 5000
    }
}

module.exports = config;