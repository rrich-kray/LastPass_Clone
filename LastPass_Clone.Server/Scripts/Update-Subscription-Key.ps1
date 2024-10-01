# Connect account
Import-Module Az.Accounts
Connect-AzAccount -TenantId 95461e2c-19c1-478b-8c41-78219ca0e363

Import-Module Az.ApiManagement
Import-Module Az

$apimContext = New-AzApiManagementContext -ResourceGroupName "PasswordManagerServer20240929121139ResourceGroup" -ServiceName "PasswordManagerServerapi"
$api = Get-AzApiManagementApi -Context $apimContext -Name "PasswordManagerServerapi"

# set subscriptionRequired to false
$api.SubscriptionRequired=$false

# Configure persistent storage
az webapp config appsettings set --resource-group "PasswordManagerServer20240929121139ResourceGroup" --name "PasswordManagerServer" --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=true

Set-AzWebApp -ResourceGroupName "PasswordManagerServer20240929121139ResourceGroup" -Name "PasswordManagerServer" -AppSettings @{"WEBSITES_ENABLE_APP_SERVICE_STORAGE"=true}