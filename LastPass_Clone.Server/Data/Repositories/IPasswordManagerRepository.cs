using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Types;
using System.Xml.Serialization;

namespace PasswordManager.Server.Data.Repositories
{
    public interface IPasswordManagerRepository<T>
    {
        PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; }
        void Create(T entity);
        void Delete(int entityId);
        void Update(T entity);
        void SaveChanges();
    }
}
