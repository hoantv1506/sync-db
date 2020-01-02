import { BaseKafkaHandler } from "./base-kafka-handler";

export class TestKafkaHandler extends BaseKafkaHandler {
    constructor() {
        super();
    }

    async execute(data: string): Promise<any> {
        console.log(">>>>>>>>>message:", data);
    }
}
