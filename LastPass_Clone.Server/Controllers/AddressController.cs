using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Types;
using PasswordManager.Server.Utilities;
using System.Net;

namespace PasswordManager.Server.Controllers
{
    [Route("/Address")]
    public class AddressController : Controller
    {
        private AddressRepository AddressRepository { get; set; }

        public AddressController(AddressRepository passwordManagerRepository)
        {
            this.AddressRepository = passwordManagerRepository;
        }

        [Route("/GetAllAddresses")]
        [HttpGet]
        public IEnumerable<Address> GetAddresses() => this.AddressRepository.Addresses;

        [Route("/CreateAddress")]
        [HttpPost]
        public Response Create(Address address) =>
            ControllerUtils.CommonControllerCreate(
                validator: new AddressEntityValidator(),
                validatee: address,
                repository: this.AddressRepository);

        [Route("/UpdateAddress")]
        [HttpPut]
        public Response UpdateAddress(Address address) =>
            ControllerUtils.CommonControllerCreate(
                validator: new AddressEntityValidator(),
                validatee: address,
                repository: this.AddressRepository);

        [Route("/DeleteAddress")]
        [HttpDelete]
        public Response DeleteAddress(int addressId) =>
            ControllerUtils.CommonControllerDelete<Address>(
                this.AddressRepository, 
                addressId, 
                "Address Creation Successful.");

    }
}
