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

        public void Create(PaymentCard paymentCard)
        {
            try
            {
                this.PasswordManagerDatabaseContext.PaymentCards.Add(paymentCard);
                this.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Update(PaymentCard paymentCard)
        {
            try
            {
                var currentAddress = this.PasswordManagerDatabaseContext.PaymentCards.Update(paymentCard);
                this.SaveChanges();

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
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
