using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;
using System.Net;

namespace PasswordManager.Server.Data.Repositories
{
    public class NoteRepository : IPasswordManagerRepository<Note>
    {
        public PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; set; }
        public IEnumerable<Note> Notes => PasswordManagerDatabaseContext.Notes;
        public NoteRepository(PasswordManagerDatabaseContext passwordManagerDatabaseContext)
        {
            this.PasswordManagerDatabaseContext = passwordManagerDatabaseContext;
        }

        public void Create(Note note)
        {
            try
            {
                this.PasswordManagerDatabaseContext.Notes.Add(note);
                this.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public void Update(Note note)
        {
            try
            {
                this.PasswordManagerDatabaseContext.Notes.Update(note);
                this.SaveChanges();

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public void Delete(int noteId)
        {
            try
            {
                Note? currentNote = this.PasswordManagerDatabaseContext.Notes?.FirstOrDefault(x => x.Id == noteId);
                if (currentNote is not null)
                {
                    this.PasswordManagerDatabaseContext.Remove(currentNote);
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
