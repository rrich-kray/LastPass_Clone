using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Utilities;
using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Types;
using System.Net;
using PasswordManager.Server.Services.JwtAuth;

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

        [Route("/GetNotesByUserId/{Id}")]
        [HttpGet]
        public IEnumerable<Note> GetNotesByUserId(string Id) =>
            this.NoteRepository.Notes.Where(Notes => Notes.UserId.ToString().Equals(Id));

        [Route("/CreateNote")]
        [HttpPost]
        public ControllerResponse<Note> Create([FromBody] Note note) =>
            ControllerUtils.CommonControllerCreate(
                validator: new NoteEntityValidator(),
                validatee: note,
                repository: this.NoteRepository, 
                modelState: ModelState);

        [Route("/UpdateNote")]
        [HttpPut]
        public ControllerResponse<Note> Update([FromBody] Note note) =>
            ControllerUtils.CommonControllerUpdate(
                validator: new NoteEntityValidator(),
                validatee: note,
                repository: this.NoteRepository,
                modelState: ModelState);

        [Route("/DeleteNote/{noteId}")]
        [HttpDelete]
        public ControllerResponse<Note> Delete(int noteId) =>
            ControllerUtils.CommonControllerDelete<Note>(
                this.NoteRepository,
                noteId,
                "Note deletion successful.");
    }
}
