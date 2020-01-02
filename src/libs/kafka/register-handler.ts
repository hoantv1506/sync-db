import { managementHandler } from "./management-handler";
import { TestKafkaHandler } from "../../services/kafka/handlers/test-kafka-handler";

export function registerKafkaHandler() {
    managementHandler.register("test_test", new TestKafkaHandler());
}
