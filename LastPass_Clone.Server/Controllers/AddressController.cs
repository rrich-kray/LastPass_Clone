using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Types;
using PasswordManager.Server.Utilities;
using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
        public Response Create([FromBody] Address address)
        {
            return ControllerUtils.CommonControllerCreate(
                validator: new AddressEntityValidator(),
                validatee: address,
                repository: this.AddressRepository,
                modelState: ModelState);
        }

        [Route("/UpdateAddress")]
        [HttpPut]
        public Response UpdateAddress([FromBody] Address address) =>
            ControllerUtils.CommonControllerUpdate(
                validator: new AddressEntityValidator(),
                validatee: address,
                repository: this.AddressRepository,
                modelState: ModelState);

        [Route("/DeleteAddress/{addressId}")]
        [HttpDelete]
        public Response DeleteAddress(int addressId) =>
            ControllerUtils.CommonControllerDelete<Address>(
                this.AddressRepository, 
                addressId, 
                "Address Creation Successful.");

    }
}
