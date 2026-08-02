// api/deepseek.js
// واجهة API لـ DeepSeek – تعمل كوسيط بين الموقع و DeepSeek

import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const API_BASE = 'https://engez.a7a.online/api/v1/ai/deepseek';

// ====== رفع الملف إلى Uguu ======
async function uploadToUguu(buffer, ext) {
    const form = new FormData();
    form.append('files[]', buffer, `file.${ext}`);

    try {
        const response = await axios.post('https://uguu.se/upload.php', form, {
            headers: { ...form.getHeaders() },
            timeout: 30000
        });

        if (!response.data?.files?.[0]?.url) {
            throw new Error('فشل في رفع الملف إلى Uguu.se');
        }

        return response.data.files[0].url;
    } catch (error) {
        throw new Error(`فشل رفع الملف: ${error.message}`);
    }
}

// ====== الاتصال بـ DeepSeek API ======
async function callDeepSeekAPI({ query, search = false, thinking = false, fileUrl = null }) {
    try {
        const params = new URLSearchParams();
        params.append('q', query);
        if (search) params.append('search', 'true');
        if (thinking) params.append('thinking', 'true');
        if (fileUrl) params.append('fileUrl', fileUrl);

        const response = await axios.get(`${API_BASE}?${params.toString()}`, {
            timeout: 120000
        });

        if (!response.data?.success) {
            throw new Error(response.data?.error || 'فشل الاتصال بـ API');
        }

        return response.data.response;
    } catch (error) {
        if (error.response) {
            throw new Error(`خطأ من السيرفر: ${error.response.status}`);
        }
        throw new Error(error.message || 'فشل الاتصال بـ DeepSeek API');
    }
}

// ====== بناء الرد ======
function buildReply(reply, thinkText) {
    let out = '';
    if (thinkText) {
        const quoted = thinkText
            .split('\n')
            .map(line => line.trim() === '' ? '' : `> ${line}`)
            .join('\n');
        out += quoted + '\n\n';
    }
    out += reply;
    return out;
}

// ====== الدالة الرئيسية لـ Vercel ======
export default async function handler(req, res) {
    // السماح بالطلبات من أي مصدر (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { 
        query, 
        search = 'false', 
        thinking = 'false',
        fileUrl = null 
    } = req.query;

    // التحقق من وجود سؤال
    if (!query || query.trim() === '') {
        return res.status(400).json({ 
            success: false, 
            error: '❌ من فضلك اكتب سؤالك.' 
        });
    }

    try {
        const result = await callDeepSeekAPI({
            query: query.trim(),
            search: search === 'true',
            thinking: thinking === 'true',
            fileUrl: fileUrl
        });

        if (!result?.reply) {
            return res.status(500).json({
                success: false,
                error: '❌ لم يتم الحصول على رد من DeepSeek'
            });
        }

        const replyText = buildReply(result.reply, result.thinking);

        return res.status(200).json({
            success: true,
            response: {
                reply: replyText,
                thinking: result.thinking || null
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `❌ خطأ: ${error.message}`
        });
    }
          }
