const axios = require('axios');

exports.handler = async (event) => {
    // Discord webhook URL
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    try {
        // Parse the incoming Sentry webhook payload
        const body = JSON.parse(event.body);
        console.log('Incoming Sentry Event:', body); // Log the entire event for debugging

        // Extract necessary data from the payload
        const issue = body.data.issue;
        const project = issue.project;
        const { title, culprit, level, lastSeen } = issue;
        const errorMessage = issue.metadata.value || 'No error message provided';

        // Construct the Discord message payload
        const discordPayload = {
            username: 'Sentry Bot',
            embeds: [
                {
                    title: `New Error in production`,
                    description: `**Error:** ${title}\n**Culprit:** ${culprit}\n**Level:** ${level}\n**Last Seen:** ${lastSeen}\n**Details:** ${errorMessage}`,
                    color: 16711680, // Red color
                },
            ],
        };

        // Send the payload to Discord
        await axios.post(discordWebhookUrl, discordPayload);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Notification sent to Discord!' }),
        };
    } catch (error) {
        console.error('Error processing the request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error sending to Discord' }),
        };
    }
};