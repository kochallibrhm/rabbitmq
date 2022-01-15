const amqp = require("amqplib");
const { Channel } = require("amqplib/lib/channel");

const message = {
    description: "This is a test message...",
};

const data = require("./data.json");

const queueName = process.argv[2] || "jobsQueue";

connect_rabbitmq();

async function connect_rabbitmq() {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const assertion = await channel.assertQueue(queueName);

        data.forEach((i) => {
            message.description = i.Email;
            channel.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(message))
            );
            console.log("Message: ", i.Email);
        });

        // For sending const message with interval
        /*
        setInterval(() => {
            channel.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(message))
            );
            console.log("Message: ", message);
        }, 10); 
*/
    } catch (error) {
        console.log(error);
    }
}
