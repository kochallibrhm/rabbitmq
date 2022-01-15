const amqp = require("amqplib");
const { Channel } = require("amqplib/lib/channel");

const message = {
    description: "",
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
            message.description = i.id;
            channel.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(message))
            );
            console.log("Message: ", i.id);
        });

        // To send the current date with interval
        /*
        setInterval(() => {
            message.description = new Date().getTime();
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
