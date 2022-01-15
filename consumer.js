const amqp = require("amqplib");
const { Channel } = require("amqplib/lib/channel");
const data = require("./data.json");

const queueName = process.argv[2] || "jobsQueue";

connect_rabbitmq();

async function connect_rabbitmq() {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const assertion = await channel.assertQueue(queueName);

        // Get the message...
        console.log("Waiting for message...");
        channel.consume(queueName, (message) => {
            const messageInfo = JSON.parse(message.content.toString());
            const userInfo = data.find((u) => u.id == messageInfo.description);
            if (userInfo) {
                console.log("Processed Record: ", userInfo);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.log(error);
    }
}
