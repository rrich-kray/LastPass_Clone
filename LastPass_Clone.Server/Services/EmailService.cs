using Azure;
using MailKit.Security;
using MailKit;
using MimeKit;
using PasswordManager.Server.Types;
using MailKit.Net.Smtp;

namespace PasswordManager.Server.Services
{
    public class EmailService
    {
        private SmtpClient Client { get; set; }
        public EmailService()
        {
            this.Client = new SmtpClient(new ProtocolLogger("smtp.log"));
        }

        public AuthenticationResponse SendEmail(
            AuthenticationResponse response,
            string recipientEmail,
            string emailMessage)
        {

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("secrets.json")
                .Build();

            var passwordResetSenderEmail = configuration.GetSection("PasswordResetSenderEmail").Value;
            var passwordResetSenderEmailGoogleAppPassword = configuration.GetSection("PasswordResetSenderEmailAppPassword").Value;

            // Connect client
            this.ConnectClient();

            // Authenticate client
            this.AuthenticateClient(passwordResetSenderEmail!, passwordResetSenderEmailGoogleAppPassword!);

            // Create message
            var message = this.CreateMessage(passwordResetSenderEmail!, recipientEmail, emailMessage);

            this.Client.Send(message);
            this.Client.Disconnect(true);
            this.Client.Dispose();

            response.Result = true;
            response.Messages = new List<string>() { "Password recovery email successfully sent." };
            return response;
        }

        public bool ConnectClient()
        {
            this.Client.ServerCertificateValidationCallback = (s, c, h, e) => true;
            Client.Connect("smtp.gmail.com", 465, SecureSocketOptions.SslOnConnect);
            if (!Client.IsConnected) return false;
            return true;
        }

        public bool AuthenticateClient(string passwordResetSenderEmail, string passwordResetSenderEmailGoogleAppPassword)
        {
            this.Client.Authenticate(passwordResetSenderEmail, passwordResetSenderEmailGoogleAppPassword);
            if (!this.Client.IsAuthenticated) return false;
            return true;
        }

        public MimeMessage CreateMessage(string passwordResetSenderEmail, string recipientEmail, string emailMessage)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Password Manager", passwordResetSenderEmail));
            message.To.Add(new MailboxAddress("User", recipientEmail));
            message.Subject = "PasswordManager Password Recovery";
            message.Body = new TextPart("Plain")
            {
                Text = emailMessage
            };
            return message;
        }
    }
}
