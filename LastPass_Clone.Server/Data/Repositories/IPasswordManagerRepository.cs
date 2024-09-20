using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Types;
using System.Xml.Serialization;

namespace PasswordManager.Server.Data.Repositories
{
    public interface IPasswordManagerRepository<T>
    {
        PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; }
        T Create(T entity);
        T Update(T entity);
        void Delete(int entityId);
        void SaveChanges();
    }
}
