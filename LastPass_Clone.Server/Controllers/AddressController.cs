using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Services.JwtAuth;
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

        public AddressController(AddressRepository addressRepository)
        {
            this.AddressRepository = addressRepository;
        }

        [Route("/GetAllAddresses")]
        [HttpGet]
        public IEnumerable<Address> GetAllAddresses() => this.AddressRepository.Addresses;

        [Route("/GetAddressesByUserId")]
        [HttpGet]
        public IEnumerable<Address> GetAddressesByUserId()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var decodedToken = new AuthService().Decode(token);
            return this.AddressRepository.Addresses.Where(address => address.UserId.ToString().Equals(decodedToken.Id));
        }

        [Route("/CreateAddress")]
        [HttpPost]
        public ControllerResponse<Address> Create([FromBody] Address address)
        {
            return ControllerUtils.CommonControllerCreate(
                validator: new AddressEntityValidator(),
                validatee: address,
                repository: this.AddressRepository,
                modelState: ModelState);
        }

        [Route("/UpdateAddress")]
        [HttpPut]
        public ControllerResponse<Address> UpdateAddress([FromBody] Address address) =>
            ControllerUtils.CommonControllerUpdate(
                validator: new AddressEntityValidator(),
                validatee: address,
                repository: this.AddressRepository,
                modelState: ModelState);

        [Route("/DeleteAddress/{addressId}")]
        [HttpDelete]
        public ControllerResponse<Address> DeleteAddress(int addressId) =>
            ControllerUtils.CommonControllerDelete<Address>(
                this.AddressRepository, 
                addressId, 
                "Address deleteion successful.");

    }
}
