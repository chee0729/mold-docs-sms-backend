// Mold Docs SMS Backend - Node.js/Express
// This server receives material lists and sends SMS via Twilio

const express = require('express');
const twilio = require('twilio');
const cors = require('cors');

const app = express();

// Twilio credentials (from your account)
const accountSid = 'ACd6ee3b630881ed13500d4dafa139c47b';
const authToken = '82880edfedc87cedca3342a8693b2827';
const twilioPhoneNumber = '+1(737) 232-4091'; // Your Twilio number
const mathewPhoneNumber = '+15033124196'; // Mathew's number (formatted)

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Middleware
app.use(cors());
app.use(express.json());

// Route to send SMS
app.post('/send-list', async (req, res) => {
  try {
    const { materials, jobLocation } = req.body;

    if (!materials || materials.length === 0) {
      return res.status(400).json({ error: 'No materials provided' });
    }

    // Format the message
    const materialsList = materials
      .map(item => `• ${item.quantity}x ${item.name}`)
      .join('\n');

    const message = `HOME DEPOT — ${jobLocation || 'Henderson Residence'}\n\n${materialsList}\n\n— Mold Docs app`;

    // Send SMS via Twilio
    const sms = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: mathewPhoneNumber
    });

    console.log(`SMS sent successfully. SID: ${sms.sid}`);
    res.json({
      success: true,
      message: 'SMS sent to Mathew',
      sid: sms.sid
    });

  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({
      error: 'Failed to send SMS',
      details: error.message
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mold Docs SMS backend is running' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mold Docs SMS backend running on port ${PORT}`);
});
