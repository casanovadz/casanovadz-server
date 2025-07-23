const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// نقطة النهاية لتحليل الكابتشا
app.post('/captcha-solver', upload.none(), async (req, res) => {
    try {
        const { image } = req.body;
        const targetNumber = req.query.number || req.body.number;

        if (!image || !targetNumber) {
            return res.status(400).json({
                status: 'error',
                message: 'يجب توفير الصورة ورقم الهدف'
            });
        }

        const isMatch = await analyzeCaptcha(image, targetNumber);

        res.json({
            status: isMatch ? 'ok' : 'fail',
            match: isMatch,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[SERVER] Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'خطأ في معالجة الكابتشا'
        });
    }
});

// دالة تحليل وهمية
async function analyzeCaptcha(imageBase64, targetNumber) {
    console.log(`[PROCESSING] Analyzing image for: ${targetNumber}`);
    return Math.random() > 0.5;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
