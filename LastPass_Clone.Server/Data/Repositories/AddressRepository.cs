using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;

namespace PasswordManager.Server.Data.Repositories
{
    public class AddressRepository : IPasswordManagerRepository<Address>
    {
        public IEnumerable<Address> Addresses => PasswordManagerDatabaseContext.Addresses;
        public PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; set; }
        public AddressRepository(PasswordManagerDatabaseContext passwordManagerDatabaseContext)
        {
            this.PasswordManagerDatabaseContext = passwordManagerDatabaseContext;
        }

        public Address Create(Address address)
        {
            try
            {
                var newAddress = this.PasswordManagerDatabaseContext.Addresses.Add(address);
                this.SaveChanges();
                return newAddress.Entity;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Address Update(Address address)
        {
            try
            {
                var currentAddress = this.PasswordManagerDatabaseContext.Addresses.Update(address);
                this.SaveChanges();
                return currentAddress.Entity;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Delete(int addressId)
        {
            try
            {
                Address? currentAddress = this.PasswordManagerDatabaseContext.Addresses?.FirstOrDefault(x => x.Id == addressId);
                if (currentAddress is not null)
                {
                    this.PasswordManagerDatabaseContext.Remove(currentAddress);
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
