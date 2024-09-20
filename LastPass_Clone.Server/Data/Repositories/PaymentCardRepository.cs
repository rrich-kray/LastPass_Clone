using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;

namespace PasswordManager.Server.Data.Repositories
{
    public class PaymentCardRepository : IPasswordManagerRepository<PaymentCard>
    {
        public IEnumerable<PaymentCard> PaymentCards => PasswordManagerDatabaseContext.PaymentCards;
        public PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; set; }
        public PaymentCardRepository(PasswordManagerDatabaseContext passwordManagerDatabaseContext)
        {
            this.PasswordManagerDatabaseContext = passwordManagerDatabaseContext;
        }

        public PaymentCard Create(PaymentCard paymentCard)
        {
            try
            {
                var newPaymentCard = this.PasswordManagerDatabaseContext.PaymentCards.Add(paymentCard);
                this.SaveChanges();
                return newPaymentCard.Entity;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public PaymentCard Update(PaymentCard paymentCard)
        {
            try
            {
                var updatedPaymentCard = this.PasswordManagerDatabaseContext.PaymentCards.Update(paymentCard);
                this.SaveChanges();
                return updatedPaymentCard.Entity;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }

        public void Delete(int paymentCardId)
        {
            try
            {
                PaymentCard? currentPaymentCard = this.PasswordManagerDatabaseContext.PaymentCards?.FirstOrDefault(x => x.Id == paymentCardId);
                if (currentPaymentCard is not null)
                {
                    this.PasswordManagerDatabaseContext.Remove(currentPaymentCard);
                    this.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void SaveChanges() => this.PasswordManagerDatabaseContext.SaveChanges();
    }
}
