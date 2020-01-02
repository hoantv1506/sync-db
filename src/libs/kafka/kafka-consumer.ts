import Rdkafka from "node-rdkafka";
import config from "config";
import { managementHandler } from "./management-handler";

class KafkaConsumer {
    init() {
        const broker = config.get("kafka.url");
        const groupId = config.get("kafka.group_id");
        const topics: string[] = config.get("kafka.topics");
        if (!broker || !groupId || !topics || topics.length === 0) {
            console.log(">>>>>>>>>>>>>>: kafka configs were wrong. plz check default.json file");
            return;
        }

        const consumer = new Rdkafka.KafkaConsumer(
            {
                "metadata.broker.list": broker,
                "group.id": groupId,
                "enable.auto.commit": false,
                "offset_commit_cb": function(err: any, topicPartitions: any) {

                    if (err) {
                        // There was an error committing
                        console.error(err);
                    } else {
                        // Commit went through. Let's log the topic partitions
                        console.log(topicPartitions);
                    }

                }
            },
            {
                "auto.offset.reset": "latest"
            }
        );

        // logging debug messages, if debug is enabled
        consumer.on("event.log", function (log: any) {
            console.log(log);
        });

        // logging all errors
        consumer.on("event.error", function (err: any) {
            console.error("Error from consumer");
            console.error(err);
        });

        consumer.on("ready", function (arg: any) {
            console.log("consumer ready:" + JSON.stringify(arg));

            consumer.subscribe(topics);
            // start consuming messages
            consumer.consume();
        });

        consumer.on("data", async function (m: any) {
            // {
            //     value: Buffer.from('hi'), // message contents as a Buffer
            //     size: 2, // size of the message, in bytes
            //     topic: 'librdtesting-01', // topic the message comes from
            //     offset: 1337, // offset the message was read from
            //     partition: 1, // partition the message was on
            //     key: 'someKey', // key of the message if present
            //     timestamp: 1510325354780 // timestamp of message creation
            // }
            if (m && m.value) {
                try {
                    const topic = m.topic;
                    let data;
                    try {
                        data = JSON.parse(m.value.toString());
                    } catch (e) {
                        data = m.value.toString();
                    }
                    const handler = managementHandler.getHandler(topic);

                    if (handler)
                        await handler.execute(data);
                } catch (e) {
                    console.log(">>>>>>>>>>>>>>: err", e.message);
                }
            }
            await consumer.commit(m);
        });

        consumer.on("disconnected", function (arg: any) {
            console.log("consumer disconnected. " + JSON.stringify(arg));
        });

        // starting the consumer
        consumer.connect();
    }
}

export const kafkaConsumer = new KafkaConsumer();
