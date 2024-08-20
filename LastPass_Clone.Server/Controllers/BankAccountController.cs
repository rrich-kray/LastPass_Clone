using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Types;
using PasswordManager.Server.Utilities;
using System.Net;


namespace PasswordManager.Server.Controllers
{
    public class BankAccountController : Controller
    {
        private BankAccountRepository BankAccountRepository { get; set; }

        public BankAccountController(BankAccountRepository passwordManagerRepository)
        {
            this.BankAccountRepository = passwordManagerRepository;
        }

        [Route("/GetBankAccounts")]
        [HttpGet]
        public IEnumerable<BankAccount> GetBankAccounts() => this.BankAccountRepository.BankAccounts;

        [Route("/CreateBankAccount")]
        [HttpPost]
        public Response Create(BankAccount bankAccount) =>
            ControllerUtils.CommonControllerCreate(
                validator: new BankAccountEntityValidator(),
                validatee: bankAccount,
                repository: this.BankAccountRepository);

        [Route("/UpdateBankAccount")]
        [HttpPut]
        public Response UpdateAddress(BankAccount bankAccount) =>
            ControllerUtils.CommonControllerCreate(
                validator: new BankAccountEntityValidator(),
                validatee: bankAccount,
                repository: this.BankAccountRepository);

        [Route("/DeleteBankAccount")]
        [HttpDelete]
        public Response DeleteAddress(int bankAccountId) =>
            ControllerUtils.CommonControllerDelete<BankAccount>(
                this.BankAccountRepository,
                bankAccountId,
                "Address Creation Successful.");
    }
}
