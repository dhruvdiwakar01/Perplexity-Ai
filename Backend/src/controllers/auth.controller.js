import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


export async function register(req, res) {

    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { email }, { username } ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({ username, email, password })
    const emailVarificationToken = jwt.sign({
        email: user.email,    
    }, process.env.JWT_SECRET)

await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background: #1a1a2e; padding: 36px 40px; text-align: center;">
                <img src="https://w7.pngwing.com/pngs/316/257/png-transparent-new-perplexity-ai-logo-tech-companies.png" 
                     alt="Perplexity AI" 
                     style="width: 100px; border-radius: 12px; margin-bottom: 14px;" />
                <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Welcome to Perplexity</h1>
                <p style="color: #a0a0b8; font-size: 13px; margin: 6px 0 0;">Your AI-powered answer engine</p>
            </div>

            <!-- Body -->
            <div style="padding: 36px 40px; color: #3d3d50;">
                <p style="font-size: 15px; line-height: 1.7; margin: 0 0 14px;">Hi <strong style="color: #1a1a2e;">${username}</strong>,</p>
                <p style="font-size: 15px; line-height: 1.7; margin: 0 0 14px;">Thank you for registering at <strong style="color: #1a1a2e;">Perplexity</strong>. We're excited to have you on board!</p>
                <p style="font-size: 15px; line-height: 1.7; margin: 0 0 24px;">Start exploring answers instantly — just ask anything and let Perplexity do the rest.</p>
                
                <!-- FIX 1: typo "varify-email" → "verify-email" -->
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVarificationToken}" 
                   style="display: inline-block; padding: 12px 28px; background: #1a1a2e; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
                    Verify Email →
                </a>

                <hr style="border: none; border-top: 1px solid #ececf3; margin: 28px 0;" />
                <p style="font-size: 15px; line-height: 1.7; margin: 0;">Best regards,<br><strong style="color: #1a1a2e;">The Perplexity Team</strong></p>
            </div>

            <!-- Footer -->
            <div style="background: #f9f9fc; padding: 20px 40px; text-align: center; border-top: 1px solid #ececf3;">
                <p style="font-size: 12px; color: #9090a8; margin: 0; line-height: 1.6;">
                    You're receiving this because you signed up at perplexity.ai<br/>
                    © ${new Date().getFullYear()} Perplexity AI. All rights reserved.
                </p>
            </div>

        </div>
    `
})

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

export async function login(req, res){
    const {email , password } = req.body;
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "user not found"
        })
    }
    const isPasswordMatch = await user.comparePassword(password);

    if(!isPasswordMatch){
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET, {expiresIn: '7d'})
    res.cookie("token", token)
    res.status(200).json({
        message: "Login successful",
        success: true,
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function getMe(req, res){
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");


    if(!user){
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }
    res.status(200).json({
        message: "User details fetched successfully!",
        success: true,
        user
    })
}

export async function verifyEmail(req, res) {
    // FIX 2: typo "req.qurey" → "req.query"
    const { token } = req.query;

    // FIX 3: missing try/catch — invalid/expired token would crash the server
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Token",
                success: false,
                err: "User not found"
            });
        }

        user.verified = true;
        await user.save();

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verified — Perplexity</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #ffffff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1A1A2E;
    }
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 56px;
      background: #ffffff;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      padding: 0 28px;
      z-index: 10;
      animation: fadeDown 0.4s ease both;
    }
    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: none; }
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 9px;
      text-decoration: none;
    }
    .nav-brand svg { width: 22px; height: 22px; fill: #1A1A2E; }
    .nav-brand-text { font-size: 15px; font-weight: 600; color: #1A1A2E; letter-spacing: -0.02em; }
    .card {
      margin-top: 56px;
      background: #fff;
      border: 1px solid #ebebeb;
      border-radius: 18px;
      padding: 52px 44px 44px;
      max-width: 420px;
      width: 90%;
      text-align: center;
      box-shadow: 0 4px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
      animation: rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
    }
    @keyframes rise {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: none; }
    }
    .icon-wrap {
      width: 68px; height: 68px;
      border-radius: 50%;
      background: #f4f4f6;
      border: 1px solid #e8e8ec;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 26px;
      animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.55); }
      to   { opacity: 1; transform: scale(1); }
    }
    .icon-wrap svg { width: 30px; height: 30px; fill: #1A1A2E; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: #4a7c59;
      background: #edf7f1;
      border: 1px solid #c6e8d1;
      border-radius: 999px;
      padding: 4px 12px;
      margin-bottom: 18px;
      animation: fadeUp 0.4s ease 0.45s both;
    }
    .badge-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: #3fba6e;
      animation: blink 2s ease-in-out infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: none; }
    }
    h1 { font-size: 21px; font-weight: 650; color: #1A1A2E; line-height: 1.3; letter-spacing: -0.025em; margin-bottom: 10px; animation: fadeUp 0.4s ease 0.5s both; }
    p.desc { font-size: 14px; font-weight: 400; color: #7a7a8a; line-height: 1.75; margin-bottom: 32px; animation: fadeUp 0.4s ease 0.55s both; }
    .divider { height: 1px; background: #f0f0f2; margin-bottom: 26px; animation: fadeUp 0.4s ease 0.6s both; }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #1A1A2E;
      color: #ffffff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13.5px;
      font-weight: 600;
      letter-spacing: -0.01em;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      width: 100%;
      transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
      box-shadow: 0 2px 8px rgba(26,26,46,0.18);
      animation: fadeUp 0.4s ease 0.7s both;
    }
    .btn:hover { background: #25253f; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(26,26,46,0.25); }
    .btn:active { transform: translateY(0); background: #131322; }
    .btn svg { width: 14px; height: 14px; stroke: #ffffff; stroke-width: 2.2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .footer-note { margin-top: 20px; font-size: 12px; color: #b0b0bf; animation: fadeUp 0.4s ease 0.8s both; }
    .footer-note a { color: #9090a8; text-decoration: none; transition: color 0.2s; }
    .footer-note a:hover { color: #1A1A2E; }
    .bottom-brand { margin-top: 36px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #c8c8d4; animation: fadeUp 0.4s ease 0.9s both; }
    .bottom-brand svg { width: 14px; height: 14px; fill: #c8c8d4; }
  </style>
</head>
<body>
  <nav class="navbar">
    <a href="/" class="nav-brand">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 .188a.5.5 0 0 1 .503.5V4.03l3.022-2.92.059-.048a.51.51 0 0 1 .49-.054.5.5 0 0 1 .306.46v3.247h1.117l.1.01a.5.5 0 0 1 .403.49v5.558a.5.5 0 0 1-.503.5H12.38v3.258a.5.5 0 0 1-.312.462.51.51 0 0 1-.55-.11l-3.016-3.018v3.448c0 .275-.225.5-.503.5a.5.5 0 0 1-.503-.5v-3.448l-3.018 3.019a.51.51 0 0 1-.548.11.5.5 0 0 1-.312-.463v-3.258H2.503a.5.5 0 0 1-.503-.5V5.215l.01-.1c.047-.229.25-.4.493-.4H3.62V1.469l.006-.074a.5.5 0 0 1 .302-.387.51.51 0 0 1 .547.102l3.023 2.92V.687c0-.276.225-.5.503-.5M4.626 9.333v3.984l2.87-2.872v-4.01zm3.877 1.113 2.871 2.871V9.333l-2.87-2.897zm3.733-1.668a.5.5 0 0 1 .145.35v1.145h.612V5.715H9.201zm-9.23 1.495h.613V9.13c0-.131.052-.257.145-.35l3.033-3.064h-3.79zm1.62-5.558H6.76L4.626 2.652zm4.613 0h2.134V2.652z"/>
      </svg>
      <span class="nav-brand-text">Perplexity</span>
    </a>
  </nav>
  <div class="card">
    <div class="icon-wrap">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 .188a.5.5 0 0 1 .503.5V4.03l3.022-2.92.059-.048a.51.51 0 0 1 .49-.054.5.5 0 0 1 .306.46v3.247h1.117l.1.01a.5.5 0 0 1 .403.49v5.558a.5.5 0 0 1-.503.5H12.38v3.258a.5.5 0 0 1-.312.462.51.51 0 0 1-.55-.11l-3.016-3.018v3.448c0 .275-.225.5-.503.5a.5.5 0 0 1-.503-.5v-3.448l-3.018 3.019a.51.51 0 0 1-.548.11.5.5 0 0 1-.312-.463v-3.258H2.503a.5.5 0 0 1-.503-.5V5.215l.01-.1c.047-.229.25-.4.493-.4H3.62V1.469l.006-.074a.5.5 0 0 1 .302-.387.51.51 0 0 1 .547.102l3.023 2.92V.687c0-.276.225-.5.503-.5M4.626 9.333v3.984l2.87-2.872v-4.01zm3.877 1.113 2.871 2.871V9.333l-2.87-2.897zm3.733-1.668a.5.5 0 0 1 .145.35v1.145h.612V5.715H9.201zm-9.23 1.495h.613V9.13c0-.131.052-.257.145-.35l3.033-3.064h-3.79zm1.62-5.558H6.76L4.626 2.652zm4.613 0h2.134V2.652z"/>
      </svg>
    </div>
    <div class="badge">
      <span class="badge-dot"></span>
      Email Verified
    </div>
    <h1>Email Verified Successfully!</h1>
    <p class="desc">Your email has been verified. You can now access the dashboard and start exploring. Thank you for joining Perplexity!</p>
    <div class="divider"></div>
    <a href="http://localhost:5173/login" class="btn">
      Go to Login Page
      <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>
    <p class="footer-note">Having trouble? <a href="#">Contact support</a></p>
  </div>
  <div class="bottom-brand">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 .188a.5.5 0 0 1 .503.5V4.03l3.022-2.92.059-.048a.51.51 0 0 1 .49-.054.5.5 0 0 1 .306.46v3.247h1.117l.1.01a.5.5 0 0 1 .403.49v5.558a.5.5 0 0 1-.503.5H12.38v3.258a.5.5 0 0 1-.312.462.51.51 0 0 1-.55-.11l-3.016-3.018v3.448c0 .275-.225.5-.503.5a.5.5 0 0 1-.503-.5v-3.448l-3.018 3.019a.51.51 0 0 1-.548.11.5.5 0 0 1-.312-.463v-3.258H2.503a.5.5 0 0 1-.503-.5V5.215l.01-.1c.047-.229.25-.4.493-.4H3.62V1.469l.006-.074a.5.5 0 0 1 .302-.387.51.51 0 0 1 .547.102l3.023 2.92V.687c0-.276.225-.5.503-.5M4.626 9.333v3.984l2.87-2.872v-4.01zm3.877 1.113 2.871 2.871V9.333l-2.87-2.897zm3.733-1.668a.5.5 0 0 1 .145.35v1.145h.612V5.715H9.201zm-9.23 1.495h.613V9.13c0-.131.052-.257.145-.35l3.033-3.064h-3.79zm1.62-5.558H6.76L4.626 2.652zm4.613 0h2.134V2.652z"/>
    </svg>
    Perplexity · All rights reserved
  </div>
</body>
</html>`;

        res.send(html);

    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        });
    }
}