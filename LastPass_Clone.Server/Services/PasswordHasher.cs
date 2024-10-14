﻿using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using PasswordManager.Server.Data.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace PasswordManager.Server.Services
{
    public interface IPasswordHasher
    {
        string GenerateHash(string password);
        bool VerifyPasswordHash(string password, string savedPasswordHash);
    }

    // Wouldn't you use the same hash function to check incoming password against stored password?
    public class PasswordHasher: IPasswordHasher
    {
        public string GenerateHash(string password)
        {
            byte[] salt;
            RandomNumberGenerator rng = RandomNumberGenerator.Create();
            rng.GetBytes(salt = new byte[16]);
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100);
            byte[] hash = pbkdf2.GetBytes(20);
            byte[] hashBytes = new byte[36];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20);
            return Convert.ToBase64String(hashBytes);
        }

        public bool VerifyPasswordHash(string password, string savedPasswordHash)
        {
            byte[] hashBytes = Convert.FromBase64String(savedPasswordHash);
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100);
            byte[] hash = pbkdf2.GetBytes(20);
            for (int i = 0; i < 20; i++)
                if (hashBytes[i + 16] != hash[i])
                    return false;

            return true;
        }
    }
}