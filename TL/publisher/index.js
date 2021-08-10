const amqp = require('amqplib');
const queue = process.env.QUEUE || 'hello';
const messagesAmount = 6;
const wait = 600;
const sleep = (ms) => {
    return new Promise((resolve) =>{
        setTimeout(resolve,ms);
    });
}
const sleepLoop = async (number,cb) => {
    while(number--) { 
        await sleep(wait);
        cb();
    }
}
const exitAfterSend = async () => {
    await sleep(messagesAmount * wait * 1.2);
    process.exit(1);
}
const subscriber = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const channelQueue = await channel.assertQueue(queue);
    sleepLoop(messagesAmount, async () => {
        const message = {
            id: Math.random().toString(32).slice(2, 6),
            text: 'Hello world',
        }
        const sent = await channel.sendToQueue(queue, Buffer.from(
            JSON.stringify(message),
        ), {
            // persistent: true
        });
        sent ? console.log(`Sent to ${queue} queue `, message) : console.log(`Fails sendin message to ${queue}`, message)

    })
    
}
subscriber().catch(e=>{
    console.log(e);
    process.exit(1);
});
exitAfterSend();