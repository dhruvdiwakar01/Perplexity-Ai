import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

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
            <div style="background: #1a1a2e; padding: 36px 40px; text-align: center;">
                <img src="https://w7.pngwing.com/pngs/316/257/png-transparent-new-perplexity-ai-logo-tech-companies.png" 
                     alt="Perplexity AI" 
                     style="width: 100px; border-radius: 12px; margin-bottom: 14px;" />
                <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Welcome to Perplexity</h1>
                <p style="color: #a0a0b8; font-size: 13px; margin: 6px 0 0;">Your AI-powered answer engine</p>
            </div>
            <div style="padding: 36px 40px; color: #3d3d50;">
                <p style="font-size: 15px; line-height: 1.7; margin: 0 0 14px;">Hi <strong style="color: #1a1a2e;">${username}</strong>,</p>
                <p style="font-size: 15px; line-height: 1.7; margin: 0 0 14px;">Thank you for registering at <strong style="color: #1a1a2e;">Perplexity</strong>. We're excited to have you on board!</p>
                <p style="font-size: 15px; line-height: 1.7; margin: 0 0 24px;">Start exploring answers instantly — just ask anything and let Perplexity do the rest.</p>
                <a href="${BACKEND_URL}/api/auth/verify-email?token=${emailVarificationToken}" 
                   style="display: inline-block; padding: 12px 28px; background: #1a1a2e; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
                    Verify Email →
                </a>
                <hr style="border: none; border-top: 1px solid #ececf3; margin: 28px 0;" />
                <p style="font-size: 15px; line-height: 1.7; margin: 0;">Best regards,<br><strong style="color: #1a1a2e;">The Perplexity Team</strong></p>
            </div>
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

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })

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
    const { token } = req.query;

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
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #1A1A2E;
      color: #ffffff;
      font-size: 13.5px;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 10px;
      width: 100%;
    }
  </style>
</head>
<body>
  <div style="text-align:center; padding: 40px;">
    <h1>Email Verified Successfully!</h1>
    <p style="margin: 16px 0 32px; color: #7a7a8a;">Your email has been verified. You can now login.</p>
    <a href="${FRONTEND_URL}/login" class="btn">
      Go to Login Page →
    </a>
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