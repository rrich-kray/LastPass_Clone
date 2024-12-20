﻿using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Services.JwtAuth;
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

        [Route("/GetPaymentCardsByUserId/{Id}")]
        [HttpGet]
        public IEnumerable<PaymentCard> GetPaymentCardsByUserId(string Id) =>
            this.PaymentCardRepository.PaymentCards.Where(PaymentCards => PaymentCards.UserId.ToString().Equals(Id));

        [Route("/CreatePaymentCard")]
        [HttpPost]
        public ControllerResponse<PaymentCard> Create([FromBody] PaymentCard paymentCard) =>
            ControllerUtils.CommonControllerCreate(
                validator: new PaymentCardEntityValidator(),
                validatee: paymentCard,
                repository: this.PaymentCardRepository,
                modelState: ModelState);

        [Route("/UpdatePaymentCard")]
        [HttpPut]
        public ControllerResponse<PaymentCard> UpdateAddress([FromBody] PaymentCard paymentCard) =>
            ControllerUtils.CommonControllerUpdate(
                validator: new PaymentCardEntityValidator(),
                validatee: paymentCard,
                repository: this.PaymentCardRepository,
                modelState: ModelState);

        [Route("/DeletePaymentCard/{PaymentCardId}")]
        [HttpDelete]
        public ControllerResponse<PaymentCard> DeleteAddress(int paymentCardId) =>
            ControllerUtils.CommonControllerDelete<PaymentCard>(
                this.PaymentCardRepository,
                paymentCardId,
                "Payment card deletion successful.");
    }
}
