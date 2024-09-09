using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Types;
using PasswordManager.Server.Utilities;
using System.Net;

namespace PasswordManager.Server.Controllers
{
    public class PaymentCardController : Controller
    {
        private PaymentCardRepository PaymentCardRepository { get; set; }

        public PaymentCardController(PaymentCardRepository passwordManagerRepository)
        {
            this.PaymentCardRepository = passwordManagerRepository;
        }

        [Route("/GetPaymentCards")]
        [HttpGet]
        public IEnumerable<PaymentCard> GetPaymentCards() => this.PaymentCardRepository.PaymentCards;

        [Route("/CreatePaymentCard")]
        [HttpPost]
        public Response Create([FromBody] PaymentCard paymentCard) =>
            ControllerUtils.CommonControllerCreate(
                validator: new PaymentCardEntityValidator(),
                validatee: paymentCard,
                repository: this.PaymentCardRepository,
                modelState: ModelState);

        [Route("/UpdatePaymentCard")]
        [HttpPut]
        public Response UpdateAddress([FromBody] PaymentCard paymentCard) =>
            ControllerUtils.CommonControllerCreate(
                validator: new PaymentCardEntityValidator(),
                validatee: paymentCard,
                repository: this.PaymentCardRepository,
                modelState: ModelState);

        [Route("/DeletePaymentCard")]
        [HttpDelete]
        public Response DeleteAddress(int paymentCardId) =>
            ControllerUtils.CommonControllerDelete<PaymentCard>(
                this.PaymentCardRepository,
                paymentCardId,
                "Payment card deletion successful.");
    }
}
