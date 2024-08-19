const axios = require('axios');

exports.handler = async (event) => {
    // Discord webhook URL
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    // Parse the incoming Sentry webhook payload
    const body = JSON.parse(event.body);
    const { event: sentryEvent, project } = body;
    const { message, title, url } = sentryEvent;

    // Construct the Discord message payload
    const discordPayload = {
        username: 'Sentry Bot',
        embeds: [
            {
                title: `Error in production`,
                description: `${title}\n\n${message}\n\n[View in Sentry](${url})`,
                color: 16711680, // Red color
            },
        ],
    };

    // Send the payload to Discord
    try {
        await axios.post(discordWebhookUrl, discordPayload);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Notification sent to Discord!' }),
        };
    } catch (error) {
        console.error('Error sending to Discord:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error sending to Discord' }),
        };
    }
};