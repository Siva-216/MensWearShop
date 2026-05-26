package com.fashionworld.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.Order;
import com.fashionworld.backend.model.OrderItem;
import com.fashionworld.backend.model.Address;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String mailFrom;

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    @Async
    public void sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("Fashion World <" + mailFrom + ">");
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mailFrom, "Fashion World");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("HTML Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send HTML email to {}: {}", toEmail, e.getMessage());
        }
    }

    public String getBaseEmailTemplate(String title, String content, String ctaText, String ctaUrl) {
        String ctaButton = "";
        if (ctaText != null && ctaUrl != null) {
            ctaButton = "<div style='text-align: center; margin: 30px 0;'>" +
                        "  <a href='" + ctaUrl + "' style='background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 30px; font-size: 13px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 0; display: inline-block;'>" + ctaText + "</a>" +
                        "</div>";
        }
        
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "  <meta charset='utf-8'>" +
               "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
               "  <title>" + title + "</title>" +
               "  <style>" +
               "    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #111827; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }" +
               "    .wrapper { width: 100%; background-color: #f9fafb; padding: 40px 0; }" +
               "    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; padding: 40px; box-sizing: border-box; }" +
               "    .header { text-align: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 25px; margin-bottom: 30px; }" +
               "    .logo { font-size: 24px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; color: #111827; margin: 0; }" +
               "    .tagline { font-size: 10px; color: #9ca3af; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 5px; }" +
               "    .content { font-size: 15px; line-height: 1.6; color: #374151; }" +
               "    .content h2 { font-size: 20px; font-weight: bold; letter-spacing: -0.02em; color: #111827; margin-top: 0; margin-bottom: 15px; }" +
               "    .footer { text-align: center; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 25px; font-size: 11px; color: #9ca3af; line-height: 1.5; }" +
               "    .footer a { color: #111827; text-decoration: underline; }" +
               "  </style>" +
               "</head>" +
               "<body>" +
               "  <div class='wrapper'>" +
               "    <div class='container'>" +
               "      <div class='header'>" +
               "        <div class='logo'>FASHION WORLD</div>" +
               "        <div class='tagline'>Elevated Style & Craftsmanship</div>" +
               "      </div>" +
               "      <div class='content'>" +
               "        " + content + "" +
               "        " + ctaButton + "" +
               "      </div>" +
               "      <div class='footer'>" +
               "        &copy; " + java.time.LocalDate.now().getYear() + " Fashion World. All rights reserved.<br>" +
               "        If you have any questions, visit our <a href='" + frontendUrl + "/contact'>Support Center</a>.<br>" +
               "        This is an automated transactional email from Fashion World." +
               "      </div>" +
               "    </div>" +
               "  </div>" +
               "</body>" +
               "</html>";
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        String title = "Welcome to Fashion World";
        String content = "<h2>Welcome to Fashion World</h2>" +
                         "<p>Hello " + name + ",</p>" +
                         "<p>We are thrilled to welcome you to our exclusive circle of style enthusiasts. Your account has been successfully created, and you are now ready to explore our collections.</p>" +
                         "<p>As a member, you get access to:</p>" +
                         "<ul style='padding-left: 20px; margin: 15px 0; color: #4b5563;'>" +
                         "  <li style='margin-bottom: 8px;'>New Arrivals & Seasonal Collections</li>" +
                         "  <li style='margin-bottom: 8px;'>Exclusive Member Perks & Pre-sales</li>" +
                         "  <li style='margin-bottom: 8px;'>Personalized Style Recommendations</li>" +
                         "</ul>" +
                         "<p>To explore our latest collections, please click the button below.</p>";
        String html = getBaseEmailTemplate(title, content, "Explore Collection", frontendUrl + "/collection");
        sendHtmlEmail(toEmail, "Welcome to Fashion World", html);
    }

    @Async
    public void sendOrderPlacedEmail(String toEmail, Order order, String name) {
        String title = "Order Placed Successfully";
        StringBuilder itemsHtml = new StringBuilder();
        itemsHtml.append("<table style='width: 100%; border-collapse: collapse; margin: 25px 0;'>")
                 .append("  <thead>")
                 .append("    <tr style='border-bottom: 1px solid #111827; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;'>")
                 .append("      <th style='padding: 10px 0;'>Item Description</th>")
                 .append("      <th style='padding: 10px 0; text-align: center;'>Qty</th>")
                 .append("      <th style='padding: 10px 0; text-align: right;'>Price</th>")
                 .append("    </tr>")
                 .append("  </thead>")
                 .append("  <tbody style='font-size: 14px;'>");

        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                String variantInfo = "";
                if (item.getSize() != null && !item.getSize().isEmpty()) {
                    variantInfo = " &middot; Size: " + item.getSize();
                }
                itemsHtml.append("    <tr style='border-bottom: 1px solid #e5e7eb;'>")
                         .append("      <td style='padding: 15px 0;'>")
                         .append("        <div style='font-weight: bold; color: #111827;'>").append(item.getName()).append("</div>")
                         .append("        <div style='font-size: 11px; color: #6b7280; margin-top: 3px;'>SKU: ").append(item.getSku() != null ? item.getSku() : "N/A").append(variantInfo).append("</div>")
                         .append("      </td>")
                         .append("      <td style='padding: 15px 0; text-align: center; color: #4b5563;'>").append(item.getQuantity()).append("</td>")
                         .append("      <td style='padding: 15px 0; text-align: right; font-weight: bold; color: #111827;'>&nbsp;&#x20B9;").append(String.format("%,.2f", item.getPrice())).append("</td>")
                         .append("    </tr>");
            }
        }

        itemsHtml.append("  </tbody>")
                 .append("</table>");

        // Totals summary using robust HTML table (avoiding flexbox)
        StringBuilder totalsHtml = new StringBuilder();
        totalsHtml.append("<table style='width: 100%; background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; font-size: 13px; color: #4b5563; margin-bottom: 25px; border-collapse: collapse;'>")
                  .append("  <tr>")
                  .append("    <td style='padding: 4px 15px;'>Subtotal</td>")
                  .append("    <td style='padding: 4px 15px; text-align: right; font-weight: bold; color: #111827;'>&nbsp;&#x20B9;").append(String.format("%,.2f", order.getSubTotal() > 0 ? order.getSubTotal() : order.getTotalAmount())).append("</td>")
                  .append("  </tr>");

        if (order.getTax() > 0) {
            totalsHtml.append("  <tr>")
                      .append("    <td style='padding: 4px 15px;'>Tax</td>")
                      .append("    <td style='padding: 4px 15px; text-align: right; font-weight: bold; color: #111827;'>+&nbsp;&#x20B9;").append(String.format("%,.2f", order.getTax())).append("</td>")
                      .append("  </tr>");
        }
        if (order.getDiscount() > 0) {
            totalsHtml.append("  <tr>")
                      .append("    <td style='padding: 4px 15px; color: #dc2626;'>Discount</td>")
                      .append("    <td style='padding: 4px 15px; text-align: right; font-weight: bold; color: #dc2626;'>-&nbsp;&#x20B9;").append(String.format("%,.2f", order.getDiscount())).append("</td>")
                      .append("  </tr>");
        }

        totalsHtml.append("  <tr>")
                  .append("    <td style='border-top: 1px solid #e5e7eb; padding: 12px 15px 0 15px; margin-top: 12px; font-size: 16px; font-weight: bold; color: #111827;'>Grand Total</td>")
                  .append("    <td style='border-top: 1px solid #e5e7eb; padding: 12px 15px 0 15px; margin-top: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #111827;'>&nbsp;&#x20B9;").append(String.format("%,.2f", order.getTotalAmount())).append("</td>")
                  .append("  </tr>")
                  .append("</table>");

        // Shipping Address summary if available
        StringBuilder shippingHtml = new StringBuilder();
        if (order.getShippingAddress() != null) {
            Address addr = order.getShippingAddress();
            shippingHtml.append("<div style='margin-bottom: 25px; font-size: 13px; line-height: 1.5; color: #4b5563;'>")
                        .append("  <div style='font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; color: #111827; margin-bottom: 8px;'>Shipping Address</div>")
                        .append("  <div style='font-weight: bold; color: #111827;'>").append(addr.getName()).append("</div>");
            if (addr.getAddressLines() != null) {
                for (String line : addr.getAddressLines()) {
                    shippingHtml.append("  <div>").append(line).append("</div>");
                }
            }
            shippingHtml.append("  <div>").append(addr.getCity()).append(", ").append(addr.getState()).append(" ").append(addr.getZip()).append("</div>")
                        .append("  <div>").append(addr.getCountry()).append("</div>")
                        .append("</div>");
        }

        String content = "<h2>Order Confirmed</h2>" +
                         "<p>Hello " + name + ",</p>" +
                         "<p>Thank you for your purchase. Your order <strong>#" + order.getOrderId() + "</strong> has been received and is currently being processed. Here is a summary of your order:</p>" +
                         itemsHtml.toString() +
                         totalsHtml.toString() +
                         shippingHtml.toString() +
                         "<p>You can track the live status of your shipment by clicking the button below.</p>";

        String html = getBaseEmailTemplate(title, content, "Track Your Order", frontendUrl + "/track-order?id=" + order.getOrderId());
        sendHtmlEmail(toEmail, "Your Order " + order.getOrderId() + " Placed Successfully!", html);
    }

    @Async
    public void sendOrderDeliveredEmail(String toEmail, Order order, String name) {
        String title = "Your Order is Delivered";
        StringBuilder itemsHtml = new StringBuilder();
        itemsHtml.append("<table style='width: 100%; background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; font-size: 14px; margin: 25px 0; border-collapse: collapse;'>")
                 .append("  <tr>")
                 .append("    <td colspan='2' style='font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; color: #111827; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;'>Delivered Items</td>")
                 .append("  </tr>");
        
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                itemsHtml.append("  <tr>")
                         .append("    <td style='padding: 8px 0; color: #374151;'>").append(item.getName()).append(" <span style='color: #6b7280; font-size: 11px;'>x").append(item.getQuantity()).append("</span></td>")
                         .append("    <td style='padding: 8px 0; text-align: right; font-weight: bold; color: #111827;'>&nbsp;&#x20B9;").append(String.format("%,.2f", item.getPrice() * item.getQuantity())).append("</td>")
                         .append("  </tr>");
            }
        }
        itemsHtml.append("</table>");

        String content = "<h2>Your Order is Delivered</h2>" +
                         "<p>Hello " + name + ",</p>" +
                         "<p>Great news! Your order <strong>#" + order.getOrderId() + "</strong> has been successfully delivered to your shipping address.</p>" +
                         itemsHtml.toString() +
                         "<p>We hope you love your new wardrobe addition! If you have a moment, we would love to hear your feedback on the fit, quality, and your shopping experience.</p>";

        String html = getBaseEmailTemplate(title, content, "Write a Product Review", frontendUrl + "/profile");
        sendHtmlEmail(toEmail, "Delivered: Your Fashion World order #" + order.getOrderId(), html);
    }

    @Async
    public void sendForgotPasswordEmail(String toEmail, String name, String resetUrl) {
        String title = "Reset Your Password";
        String content = "<h2>Password Reset Request</h2>" +
                         "<p>Hello " + name + ",</p>" +
                         "<p>We received a request to reset the password associated with your Fashion World account. If you did not make this request, you can safely ignore this email.</p>" +
                         "<p>To reset your password, please click the button below. For security reasons, this link will expire in 1 hour.</p>";
        String html = getBaseEmailTemplate(title, content, "Reset Password", resetUrl);
        sendHtmlEmail(toEmail, "Reset Your Password - Fashion World", html);
    }
}
