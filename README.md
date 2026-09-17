# CMFB Digital Bank

Build a robust, production-quality demo banking web application called Confidential Micro Finance Bank (CMFB) using Next.js + TypeScript.

The application should feel like a modern, premium U.S.-style digital banking platform, with a polished banking dashboard, intuitive navigation, responsive layouts, transaction history, account management, transfers, cards, beneficiaries, notifications, profile/security settings, and other realistic banking functionality.

IMPORTANT:

Do NOT copy Chase's exact branding, logo, copyrighted assets, exact text, or pixel-for-pixel UI.

Use Chase and other leading banking applications only as general UX inspiration.

Create an original visual identity for Confidential Micro Finance Bank.

This is a DEMO/PROTOTYPE banking application. Do not connect to real banking networks or process real financial transactions.

Clearly structure the application so a real backend/payment provider could be integrated later.

1. TECHNOLOGY STACK

Use:

Next.js with App Router

TypeScript throughout the entire project

Tailwind CSS

shadcn/ui or another high-quality accessible component system

Lucide icons

React Hook Form + Zod for forms and validation

PostgreSQL-ready data architecture

Prisma ORM architecture where persistence is required

Server Actions/API routes where appropriate

Secure authentication architecture

Responsive design for desktop, tablet and mobile

Clean component-based architecture

Strong TypeScript typing

Loading, empty, error and success states throughout the application

Do not use JavaScript when TypeScript can be used.

2. BRAND

Bank name:

Confidential Micro Finance Bank

Short name:

CMFB

Create an original professional banking identity.

Design direction:

Premium

Trustworthy

Modern

Clean

Financial

Professional

Minimal

Accessible

Enterprise-quality

Use a restrained banking color system with a primary brand color, neutral backgrounds and clear success/error/warning states.

Create:

CMFB logo concept

favicon

app icon

consistent typography

buttons

cards

badges

alerts

tables

forms

modals

navigation

responsive mobile navigation

Do not imitate Chase's logo, exact color system or proprietary visual identity.

3. APPLICATION STRUCTURE

Create these major sections:

PUBLIC:

/
/ login
/ register
/ forgot-password
/ verify-email
/ help
/ terms
/ privacy

AUTHENTICATED:

/dashboard
/accounts
/accounts/[id]
/transactions
/transfers
/beneficiaries
/cards
/bills
/deposits
/withdraw
/bank-links
/profile
/security
/notifications
/settings
/support

ADMIN DEMO:

/admin
/admin/users
/admin/accounts
/admin/transactions
/admin/restrictions
/admin/audit-logs

4. LOGIN EXPERIENCE

Create a polished banking login page.

Fields:

Email/username

Password

Features:

Show/hide password

Remember device

Forgot password

Login

Demo credentials option

Loading state

Invalid credentials error

Account restricted state

Session timeout handling

Do not store plaintext passwords.

Use a secure authentication architecture.

5. DASHBOARD

The dashboard should be the centerpiece of the application.

Display:

Welcome section

"Good morning, [First Name]"

Include current date.

Total balance

Display:

"Total balance"

Example:

$24,850.45

Include:

Show/hide balance

Account number masking

Last updated indicator

Accounts

Cards for:

Checking

Savings

Money Market

Credit Card

Each should show:

Account name

Masked account number

Available balance

Current balance

Account status

Example:

Checking
•••• 4821
$8,420.50

Quick actions

Buttons:

Transfer

Pay Bills

Deposit

Withdraw

Link Bank

View Transactions

Recent transactions

Display:

Merchant/name

Date

Category

Amount

Debit/credit indicator

Status

Use realistic demo transactions.

Spending summary

Create visual summaries for:

Food

Transportation

Utilities

Shopping

Entertainment

Other

Notifications

Show important account notifications.

6. ACCOUNTS PAGE

Create an accounts overview.

Users should be able to view:

Checking

Savings

Money Market

Credit Card

Loan

Each account should have:

Balance

Available balance

Account number

Routing number placeholder/demo

Account status

Recent transactions

Create an account details page.

7. TRANSACTION HISTORY

Build a professional transaction-management interface.

Features:

Search

Filter

Date range

Account filter

Transaction type

Category

Amount range

Debit/credit

Pending/completed/failed

Transaction detail modal/page should display:

Transaction ID

Date

Description

Amount

Type

Account

Status

Reference

Category

Allow demo export to CSV/PDF if practical.

8. TRANSFERS

Build a complete transfer interface.

Transfer form:

From account
To beneficiary
Amount
Transfer date
Memo

Validation:

Required fields

Valid amount

Positive amount

Sufficient demo balance

Beneficiary validation

However, IMPORTANT:

THE DEMO APPLICATION MUST NOT ACTUALLY MOVE MONEY.

When the user attempts to submit a transfer, the application must check the account restriction state.

If the account is restricted, DO NOT create a successful transfer.

Instead display a polished error state:

"Transfer unavailable"

"Your account is currently restricted. Transfers are temporarily unavailable. Please contact Confidential Micro Finance Bank support for assistance."

Show:

Error icon

Account status: Restricted

Contact Support button

Return to Dashboard button

The restriction should be enforced at the server/business-logic layer as well as the UI layer.

9. WITHDRAWAL

Create a withdrawal page.

Fields:

From account

Amount

Withdrawal method

Destination

Description

Again, this is a demo.

Do not perform real withdrawals.

If the account is restricted, display:

"Withdrawal unavailable"

"Your account is currently restricted. Withdrawals are temporarily unavailable. Please contact Confidential Micro Finance Bank support."

Do not create a completed withdrawal transaction.

10. LINK EXTERNAL BANK

Create a realistic demo bank-linking workflow.

Steps:

Select bank

Enter demo credentials

Verify

Review permissions

Link account

Include a searchable list of fictional/demo banks.

IMPORTANT:

Do NOT connect to real financial institutions or request real banking credentials.

This must be a simulated/demo linking flow.

When the user attempts to complete the link and the CMFB account is restricted, display:

"Bank linking unavailable"

"Your account is currently restricted. Linking an external bank account is temporarily unavailable."

Do not actually link an external account.

11. BENEFICIARIES

Create beneficiary management.

Users can:

View beneficiaries

Add beneficiary

Edit beneficiary

Remove beneficiary

Search beneficiaries

Fields:

Name

Account number

Bank

Nickname

Because this is a demo, use fictional data.

When appropriate, require confirmation before deleting a beneficiary.

12. CARDS

Create a Cards section.

Display:

Virtual debit card

Physical debit card

Credit card

Features:

Card number masked

Expiration

CVV hidden

Freeze/unfreeze demo card

Replace card

View card transactions

Spending limit

Card status

These should be simulated.

Never expose actual payment-card data.

13. BILL PAY

Create a bill-payment experience.

Categories:

Electricity

Internet

Phone

Water

Insurance

Streaming

Users can:

Add biller

View billers

Schedule demo payment

View payment history

If the account is restricted, prevent submission and show the restriction state.

14. DEPOSIT

Create a simulated deposit interface.

Methods:

Mobile check deposit

Cash deposit

External transfer

Since this is a demo application:

Do not actually process money.

Show appropriate informational/demo states.

15. NOTIFICATIONS

Create a notification center.

Types:

Security alerts

Transaction alerts

Account alerts

System notifications

Allow:

Mark as read

Mark all as read

Delete

Filter

16. PROFILE

Profile page:

First name

Last name

Email

Phone

Address

Date of birth

Profile photo

Allow profile editing with validation.

17. SECURITY

Create a professional security center.

Features:

Change password

Two-factor authentication UI

Login history

Trusted devices

Session management

Security questions

Sign out all devices

For the demo, simulate these workflows safely.

18. ACCOUNT RESTRICTION SYSTEM

This is VERY IMPORTANT.

Create a centralized account-status system.

Possible statuses:

ACTIVE
RESTRICTED
SUSPENDED
CLOSED

For the demo user, set:

status = RESTRICTED

The restriction should be checked by a centralized business-logic function/middleware/service.

Example conceptual logic:

if account.status === "RESTRICTED":
rejectTransfer()

if account.status === "RESTRICTED":
rejectWithdrawal()

if account.status === "RESTRICTED":
rejectBankLink()

Do not duplicate random restriction logic throughout the application.

Create something like:

/lib/account-status.ts

or an equivalent clean architecture.

Create reusable functions such as:

isAccountRestricted()
assertAccountCanTransfer()
assertAccountCanWithdraw()
assertAccountCanLinkBank()

The server/business logic must be the final authority.

19. RESTRICTION UI

Create a reusable:

component.

Use it consistently.

Message:

"Account restricted"

"Some account features are temporarily unavailable because this account is restricted."

Actions:

"Contact Support"
"View Account Details"

For transfer:

"Transfers are unavailable while your account is restricted."

For withdrawal:

"Withdrawals are unavailable while your account is restricted."

For bank linking:

"External bank linking is unavailable while your account is restricted."

Make the error professional rather than alarming.

Do not imply that real funds have been frozen unless this is explicitly a simulated/demo state.

20. ADMIN DASHBOARD

Create a realistic demo administration portal.

Admin dashboard should display:

Total users

Active accounts

Restricted accounts

Suspended accounts

Total demo balances

Recent demo transactions

System alerts

Admin users can:

Search users

View user profile

View accounts

View transactions

Change demo account status

View audit logs

Account status controls:

ACTIVE
RESTRICTED
SUSPENDED
CLOSED

When admin changes status to RESTRICTED, all protected actions should immediately use the restricted-state business logic.

21. AUDIT LOG

Create an audit-log system for important actions.

Track:

User

Action

Timestamp

IP placeholder

Device placeholder

Result

Metadata

Example:

TRANSFER_ATTEMPT
WITHDRAWAL_ATTEMPT
BANK_LINK_ATTEMPT
LOGIN
PASSWORD_CHANGE
ACCOUNT_STATUS_CHANGED

A rejected transfer should create an audit entry such as:

TRANSFER_ATTEMPT — BLOCKED — ACCOUNT_RESTRICTED

22. DATABASE ARCHITECTURE

Design a clean Prisma/PostgreSQL-ready schema.

Entities should include approximately:

User
Account
Transaction
Beneficiary
Card
Bill
Notification
ExternalBank
BankLink
AuditLog
Session
SupportTicket

Account should contain fields similar to:

id
userId
accountNumber
accountType
balance
availableBalance
currency
status
createdAt
updatedAt

Transaction:

id
accountId
type
amount
description
status
reference
createdAt

Use enums for:

AccountStatus
TransactionType
TransactionStatus
AccountType

Use Decimal for monetary values rather than JavaScript floating-point numbers.

23. API/BACKEND ARCHITECTURE

Create clean service boundaries.

For example:

/lib
/auth
/accounts
/transactions
/transfers
/withdrawals
/bank-links
/notifications
/security
/audit

Use server-side validation.

Never trust client-side account status.

Before a protected operation:

Authenticate user.

Load account.

Verify account ownership.

Check account status.

Validate request.

Perform demo operation only if allowed.

Create audit log.

Return structured result.

24. ERROR HANDLING

Create consistent errors.

Use structured responses such as:

{
success: false,
code: "ACCOUNT_RESTRICTED",
message: "Your account is currently restricted."
}

Other error codes:

ACCOUNT_NOT_FOUND
UNAUTHORIZED
INSUFFICIENT_FUNDS
INVALID_AMOUNT
ACCOUNT_RESTRICTED
ACCOUNT_SUSPENDED
BANK_LINK_UNAVAILABLE
TRANSFER_FAILED
VALIDATION_ERROR

Create reusable error handling.

25. UX DETAILS

The application should feel extremely polished.

Include:

Skeleton loaders

Toast notifications

Confirmation dialogs

Empty states

Error states

Success states

Responsive tables

Responsive cards

Smooth transitions

Accessible keyboard navigation

Proper focus states

Mobile-friendly navigation

Breadcrumbs where useful

Consistent spacing

Professional typography

Avoid excessive animations.

26. MOBILE RESPONSIVENESS

The application must work beautifully on:

Desktop

Laptop

Tablet

Mobile

On mobile:

Bottom navigation or compact navigation

Stacked cards

Horizontally scrollable transaction tables where appropriate

Large touch targets

Responsive forms

27. DEMO DATA

Seed the application with realistic fictional demo data.

Create:

Demo user:
John Doe

Demo accounts:

Checking:
•••• 4821
$8,420.50

Savings:
•••• 1937
$16,429.95

Set the primary demo account status to:

RESTRICTED

Create realistic transaction history but clearly treat all balances and transactions as simulated data.

28. IMPORTANT SECURITY REQUIREMENTS

Even though this is a demo:

Never store plaintext passwords.

Never expose secrets in client-side code.

Never expose database credentials.

Never collect real bank credentials.

Never process real money.

Never connect to real bank APIs.

Never use real customer financial information.

Validate authorization server-side.

Protect admin routes.

Use environment variables for secrets.

Validate all input.

Prevent SQL injection.

Use parameterized database queries/Prisma.

Do not trust client-provided account status.

29. CODE QUALITY

Write production-quality TypeScript.

Requirements:

Strong types

No unnecessary any

Reusable components

Reusable services

Clear folder structure

Good naming

Small focused functions

Server/client boundaries used correctly

Proper error handling

No duplicated business logic

No hard-coded restriction checks scattered around components

No fake success responses for restricted actions

30. FINAL USER EXPERIENCE

The application should feel like a complete modern digital banking platform.

The dashboard should immediately communicate:

"Your money at a glance."

But when the user tries a restricted operation, clearly communicate:

"Account restricted"

without pretending that an actual bank transaction occurred.

The user should always have a clear next action:

"Contact Support"

or

"Return to Dashboard."

Build the application incrementally but completely. Start with the application shell, authentication, dashboard, account model and restriction system, then build the remaining modules on top of that architecture.

Before finishing, verify that:

Restricted accounts cannot transfer.

Restricted accounts cannot withdraw.

Restricted accounts cannot link external banks.

These restrictions are enforced server-side.

Blocked attempts are audited.

Admin can change the demo account status.

Changing the status to ACTIVE enables the relevant demo workflows.

The UI responds correctly to every loading/error/success state.

The entire application is responsive.

TypeScript has no avoidable type errors.

No real banking credentials or real money movement are involved.

The design is original to Confidential Micro Finance Bank rather than a Chase clone.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9393a5bc-7fbd-4577-99d5-6e41b368bb35).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
