using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Utilities;
using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Types;
using System.Net;

namespace PasswordManager.Server.Controllers
{
    [Route("/Notes")]
    public class NoteController : Controller
    {
        private NoteRepository NoteRepository { get; set; }

        public NoteController(NoteRepository noteRepository)
        {
            this.NoteRepository = noteRepository;
        }

        [Route("/GetNotes")]
        [HttpGet]
        public IEnumerable<Note> GetCategories() => this.NoteRepository.Notes;

        [Route("/CreateNote")]
        [HttpPost]
        public Response Create([FromBody] Note note) =>
            ControllerUtils.CommonControllerCreate(
                validator: new NoteEntityValidator(),
                validatee: note,
                repository: this.NoteRepository, 
                modelState: ModelState);

        [Route("/UpdateNote")]
        [HttpPost]
        public Response Update([FromBody] Note note) =>
            ControllerUtils.CommonControllerCreate(
                validator: new NoteEntityValidator(),
                validatee: note,
                repository: this.NoteRepository,
                modelState: ModelState);

        [Route("/DeleteNote/{noteId}")]
        [HttpDelete]
        public Response Delete(int noteId) =>
            ControllerUtils.CommonControllerDelete<Note>(
                this.NoteRepository,
                noteId,
                "Note deletion successful.");
    }
}
