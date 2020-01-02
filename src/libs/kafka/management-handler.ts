import { BaseKafkaHandler } from "../../services/kafka/handlers/base-kafka-handler";


class ManagementHandler {
    private _handlers: any;

    constructor() {
        this._handlers = {};
    }

    register(topic: string, handler: BaseKafkaHandler) {
        this._handlers[topic] = handler;
    }

    getHandler(topic: string) {
        return this._handlers[topic];
    }
}

export const managementHandler = new ManagementHandler();
