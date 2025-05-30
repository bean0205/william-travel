package com.william.travel.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${app.email.from}")
    private String fromEmail;
    
    @Value("${app.frontend.url}")
    private String frontendUrl;
    
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset Request - William Travel");
        
        String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
        String content = String.format(
            "Dear User,\n\n" +
            "You have requested to reset your password. Please click the link below to reset your password:\n\n" +
            "%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you did not request this password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "William Travel Team",
            resetUrl
        );
        
        message.setText(content);
        mailSender.send(message);
    }
    
    public void sendEmailVerificationEmail(String toEmail, String verificationToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Email Verification - William Travel");
        
        String verificationUrl = frontendUrl + "/verify-email?token=" + verificationToken;
        String content = String.format(
            "Dear User,\n\n" +
            "Thank you for registering with William Travel. Please click the link below to verify your email address:\n\n" +
            "%s\n\n" +
            "If you did not create an account with us, please ignore this email.\n\n" +
            "Best regards,\n" +
            "William Travel Team",
            verificationUrl
        );
        
        message.setText(content);
        mailSender.send(message);
    }
    
    public void sendWelcomeEmail(String toEmail, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to William Travel!");
        
        String content = String.format(
            "Dear %s,\n\n" +
            "Welcome to William Travel! We're excited to have you join our community of travelers.\n\n" +
            "You can now:\n" +
            "- Discover amazing destinations\n" +
            "- Find the best accommodations and restaurants\n" +
            "- Join events and connect with fellow travelers\n" +
            "- Share your travel experiences\n\n" +
            "Start exploring: %s\n\n" +
            "Happy travels!\n" +
            "William Travel Team",
            firstName,
            frontendUrl
        );
        
        message.setText(content);
        mailSender.send(message);
    }
}
