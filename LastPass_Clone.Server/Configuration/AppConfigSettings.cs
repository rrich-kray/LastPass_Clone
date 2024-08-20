using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasswordManager.Server.Configuration
{
    public class AppConfigSettings
    {
        public ConnectionStringSettingsCollection ConnectionStrings => System.Configuration.ConfigurationManager.ConnectionStrings;
        public string DatabaseConnectionString => System.Configuration.ConfigurationManager.ConnectionStrings["PasswordsDatabase"].ConnectionString;
    }
}
