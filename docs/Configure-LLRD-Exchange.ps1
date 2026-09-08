# Run interactively as the Microsoft administrator. No client secret is needed.
# First verify Enterprise applications > LLRD Website Contact > Overview.
# Also review effective Entra application grants: RBAC tests exclude those grants.
$ErrorActionPreference = 'Stop'
$llrdAppId = 'ad67dcf8-be35-4e06-8b9e-8115a333e0e1'
$llrdTenantId = '23f14690-978b-44f2-8172-0e1bddcb0a07'
$llrdMailbox = 'contactus@llrd.ai'
$llrdScopeName = 'LLRD Contact Mailbox'
$llrdRoleName = 'LLRD Contact Send'
$llrdSpId = [guid]'68d05179-63fd-4d87-abb4-8579d91b9149'
if ($llrdSpId -eq [guid]'3d59f435-29b1-46d0-a4a3-e3492788e349') {
    throw 'STOP: supplied value is the App Registration Object ID.'
}
if (-not (Get-Module -ListAvailable ExchangeOnlineManagement)) {
    Install-Module ExchangeOnlineManagement -Repository PSGallery -Scope CurrentUser
}
Import-Module ExchangeOnlineManagement
Connect-ExchangeOnline
$llrdConnections = @(Get-ConnectionInformation | Where-Object {
    [string]$_.TenantID -eq $llrdTenantId -and $_.State -eq 'Connected'
})
if ($llrdConnections.Count -ne 1) { throw 'STOP: verify you connected to the approved tenant only.' }
Get-EXOMailbox -Identity $llrdMailbox | Format-Table DisplayName,PrimarySmtpAddress
$llrdCandidates = @(Get-EXOMailbox -ResultSize Unlimited | Where-Object {
    [string]$_.PrimarySmtpAddress -ne $llrdMailbox
} | Sort-Object PrimarySmtpAddress)
if ($llrdCandidates.Count -eq 0) {
    throw 'STOP: no other existing tenant mailbox is available for the denial test. No mailbox was created; denial remains unverified. Do not enter an external Gmail address or create a paid mailbox for this test.'
}
Write-Host 'Choose a mailbox from this tenant list. No email will be sent to it.'
for ($llrdIndex = 0; $llrdIndex -lt $llrdCandidates.Count; $llrdIndex++) {
    Write-Host ('{0}: {1}' -f ($llrdIndex + 1), $llrdCandidates[$llrdIndex].PrimarySmtpAddress)
}
$llrdChoice = 0
$llrdSelection = Read-Host 'Enter the mailbox number for the no-send denial test'
if (-not [int]::TryParse($llrdSelection, [ref]$llrdChoice) -or $llrdChoice -lt 1 -or $llrdChoice -gt $llrdCandidates.Count) {
    throw 'STOP: select a valid number from the displayed tenant mailbox list.'
}
$llrdOther = [string]$llrdCandidates[$llrdChoice - 1].PrimarySmtpAddress
$llrdSp = @(Get-ServicePrincipal | Where-Object { [string]$_.AppId -eq $llrdAppId })
if ($llrdSp.Count -gt 1) { throw 'STOP: multiple Exchange service principal references.' }
if ($llrdSp.Count -eq 0) {
    New-ServicePrincipal -AppId $llrdAppId -ObjectId $llrdSpId -DisplayName 'LLRD Website Contact'
} elseif ([string]$llrdSp[0].ObjectId -ne [string]$llrdSpId) {
    throw 'STOP: existing Exchange reference differs from the verified Enterprise Application Object ID.'
}
$llrdScope = Get-ManagementScope | Where-Object Name -eq $llrdScopeName
if (-not $llrdScope) {
    New-ManagementScope -Name $llrdScopeName -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'contactus@llrd.ai'"
}
$llrdScope = Get-ManagementScope -Identity $llrdScopeName
# Reject a broader expression even if it currently happens to match one mailbox.
if (($llrdScope.RecipientFilter -replace '[()\s]','') -ine "PrimarySmtpAddress-eq'contactus@llrd.ai'") {
    throw 'STOP: existing scope filter differs; review it without overwriting automatically.'
}
$llrdMembers = @(Get-Recipient -Filter $llrdScope.RecipientFilter)
$llrdMembers | Format-Table PrimarySmtpAddress
if ($llrdMembers.Count -ne 1 -or [string]$llrdMembers[0].PrimarySmtpAddress -ne $llrdMailbox) {
    throw 'STOP: scope must resolve to exactly contactus@llrd.ai.'
}
$llrdExistingRole = @(Get-ManagementRoleAssignment | Where-Object Name -eq $llrdRoleName)
if ($llrdExistingRole.Count -eq 0) {
    New-ManagementRoleAssignment -Name $llrdRoleName -Role 'Application Mail.Send' -App $llrdSpId -CustomResourceScope $llrdScopeName
} else {
    $llrdExistingRole | Format-List Name,Role,RoleAssigneeName,CustomResourceScope
    Write-Host 'Existing assignment retained; inspect the assignment and all authorization rows below.'
}
$llrdAllowed = @(Test-ServicePrincipalAuthorization -Identity $llrdSpId -Resource $llrdMailbox)
$llrdDenied = @(Test-ServicePrincipalAuthorization -Identity $llrdSpId -Resource $llrdOther)
Write-Host 'Approved mailbox authorization:'
$llrdAllowed | Format-Table
Write-Host 'Unrelated mailbox authorization (NO message is sent):'
$llrdDenied | Format-Table
if (-not ($llrdAllowed | Where-Object { $_.RoleName -eq 'Application Mail.Send' -and $_.InScope -eq $true })) {
    throw 'STOP: approved mailbox Mail.Send is not in scope.'
}
if (-not ($llrdDenied | Where-Object { $_.RoleName -eq 'Application Mail.Send' -and $_.InScope -eq $false })) {
    throw 'STOP: unrelated mailbox Mail.Send denial was not demonstrated.'
}
if ($llrdDenied | Where-Object { $_.InScope -eq $true }) {
    throw 'STOP: unrelated mailbox has an in-scope role. Review all broader assignments.'
}
Write-Host 'RBAC simulation passed. This does NOT test separate Entra grants, Graph delivery, DNS or privacy approval.'
Write-Host 'Keep public contact disabled. No client secret is requested or displayed, and no email is sent by this procedure.'


