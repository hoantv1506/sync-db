import config from "config";
import Rdkafka from "node-rdkafka";

class KafkaProducer {
    private _producer: any;
    constructor() {
        this.init();
    }

    private init() {
        const broker = config.get("kafka.url");
        if (!broker) {
            console.log(">>>>>>>>>>>>>>: kafka configs were wrong. plz check default.json file");
            return;
        }

        this._producer = new Rdkafka.Producer({
            "metadata.broker.list": broker,
            "dr_cb": true // Enable to receive delivery reports for messages
        });

        // Connect to the broker manually
        this._producer.connect({}, (err: any) => {
            if (err) {
                console.log(">>>>>>>>>>>>>>: err connecting to broker", err.stack);
            }
            console.log(">>>>>>>>>>>>>>: connected to broker");
        });

        // Any errors we encounter, including connection errors
        this._producer.on("event.error", function(err: any) {
            console.error("Error from producer");
            console.error(err);
        });

        this._producer.on("ready", function() {
            console.log(">>>>>>>>>>>>>>: producer ready");
        });

        this._producer.on("disconnected", function(arg: any) {
            console.log("producer disconnected. " + JSON.stringify(arg));
        });
    }

    send(topic: string, message: any) {
        // Wait for the ready event before proceeding
        const producer = this._producer;
        // this._producer.on("ready", function() {
            try {
                // console.log(">>>>>>>>>>>>>>: send", message);
                try {
                    message = JSON.stringify(message);
                } catch (e) {
                }
                producer.produce(
                    // Topic to send the message to
                    topic,
                    // optionally we can manually specify a partition for the message
                    // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
                    null,
                    // Message to send. Must be a buffer
                    Buffer.from(message),
                    // for keyed messages, we also specify the key - note that this field is optional
                    "Stormwind",
                    // you can send a timestamp here. If your broker version supports it,
                    // it will get added. Otherwise, we default to 0
                    Date.now(),
                    // you can send an opaque token here, which gets passed along
                    // to your delivery reports
                );
            } catch (err) {
                console.error("A problem occurred when sending our message", err.stack);
            }
        // });
    }
}

export const kafkaProducer = new KafkaProducer();
