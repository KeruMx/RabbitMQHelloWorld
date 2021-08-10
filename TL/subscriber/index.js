const amqp = require('amqplib');
const queue = process.env.QUEUE || 'hello';
const intensiveOperation = () => {
    let i = 1e9;
    while (i--){}
}
const subscriber = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const channelQueue = await channel.assertQueue(queue);
    channel.consume(queue, message => {
        const content = JSON.parse(message.content.toString());
        intensiveOperation();
        console.log(`Received Message from QUEUE ${queue}`)
        console.log(content);
        channel.ack(message);
    });
}
subscriber().catch(e => {
    console.log(e);
    process.exit(1);
});