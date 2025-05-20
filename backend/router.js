const{Router} = require('express');
const run = require('./GeminiApi');
const router = Router();

router.post('/prompt-post', async (req, res) => {
    try {
        const {prompt} = req.body;
        const response = await run(prompt)
        return res.json({ response });
        
    } catch (error) {
        console.log('❌ Gemini API Error:', error);
    }
});

module.exports = router;