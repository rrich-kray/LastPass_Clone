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

        [Route("/GetNotesByUserId")]
        [HttpGet]
        public IEnumerable<Note> GetPasswordsByUserId()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var decodedToken = new AuthService().Decode(token);
            return this.NoteRepository.Notes.Where(note => note.UserId.ToString().Equals(decodedToken.Id));
        }

        [Route("/CreateNote")]
        [HttpPost]
        public IResult Create([FromBody] Note note) =>
            ControllerUtils.CommonControllerCreate(
                validator: new NoteEntityValidator(),
                validatee: note,
                repository: this.NoteRepository, 
                modelState: ModelState);

        [Route("/UpdateNote")]
        [HttpPost]
        public Response Update([FromBody] Note note) =>
            ControllerUtils.CommonControllerUpdate(
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
