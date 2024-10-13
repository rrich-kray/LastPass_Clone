using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Services.JwtAuth;
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

        [Route("/GetBankAccountsByUserId/{Id}")]
        [HttpGet]
        public IEnumerable<BankAccount> GetBankAccountsByUserId(string Id) =>
            this.BankAccountRepository.BankAccounts.Where(BankAccount => BankAccount.UserId.ToString().Equals(Id));

        [Route("/CreateBankAccount")]
        [HttpPost]
        public ControllerResponse<BankAccount> Create([FromBody] BankAccount bankAccount) =>
            ControllerUtils.CommonControllerCreate(
                validator: new BankAccountEntityValidator(),
                validatee: bankAccount,
                repository: this.BankAccountRepository,
                modelState: ModelState);

        [Route("/UpdateBankAccount")]
        [HttpPut]
        public ControllerResponse<BankAccount> UpdateBankAccount([FromBody] BankAccount bankAccount) =>
            ControllerUtils.CommonControllerUpdate(
                validator: new BankAccountEntityValidator(),
                validatee: bankAccount,
                repository: this.BankAccountRepository,
                modelState: ModelState);

        [Route("/DeleteBankAccount/{bankAccountId}")]
        [HttpDelete]
        public ControllerResponse<BankAccount> DeleteBankAccount(int bankAccountId) =>
            ControllerUtils.CommonControllerDelete<BankAccount>(
                this.BankAccountRepository,
                bankAccountId,
                "Address Deletion Successful.");
    }
}
