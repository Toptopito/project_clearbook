# Authentication Screens

## Login Screen

```
┌─────────────────────────────────────────────┐
│                                             │
│               CLEARBOOK                     │
│         Personal Health Records             │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Email                              │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Password                    👁️     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [ ] Remember me                            │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            LOG IN                   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Forgot password?                           │
│                                             │
│  Don't have an account? Sign up             │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Clean, minimal design with focus on form fields
- Logo/branding at the top
- Eye icon for password visibility toggle
- "Remember me" option for convenience
- Clear call-to-action (CTA) button for login
- Links to forgot password and registration

### Interactions
1. User enters email and password
2. Form validates input on submit
3. Error messages appear below corresponding fields if validation fails
4. On successful validation, user is redirected to dashboard
5. "Forgot password" link takes user to password reset flow
6. "Sign up" link takes user to registration screen

## Registration Screen

```
┌─────────────────────────────────────────────┐
│                                             │
│               CLEARBOOK                     │
│         Personal Health Records             │
│                                             │
│  Create your account                        │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Email                              │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Password                    👁️     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Confirm Password            👁️     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Password requirements:                     │
│  • At least 8 characters                    │
│  • Include numbers and symbols              │
│  • Mix of upper and lowercase letters       │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            SIGN UP                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  By signing up, you agree to our            │
│  Terms of Service and Privacy Policy        │
│                                             │
│  Already have an account? Log in            │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Similar design language to login screen for consistency
- Additional field for password confirmation
- Clear password requirements to guide users
- Links to Terms of Service and Privacy Policy
- Link back to login screen

### Interactions
1. User enters email, password, and password confirmation
2. Real-time validation for password strength
3. Form validates input on submit
4. On successful registration, user is redirected to profile setup
5. "Log in" link takes user back to login screen

## Password Reset Screen

```
┌─────────────────────────────────────────────┐
│                                             │
│               CLEARBOOK                     │
│         Personal Health Records             │
│                                             │
│  Reset your password                        │
│                                             │
│  Enter your email address and we'll         │
│  send you a link to reset your password.    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Email                              │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            SEND LINK                │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Remember your password? Log in             │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Clear explanation of the process
- Minimal form with just email field
- Clear CTA button
- Link back to login screen

### Interactions
1. User enters email address
2. Form validates email format
3. On submit, success message confirms that reset link has been sent
4. "Log in" link takes user back to login screen

## New Password Screen (After Clicking Reset Link)

```
┌─────────────────────────────────────────────┐
│                                             │
│               CLEARBOOK                     │
│         Personal Health Records             │
│                                             │
│  Create new password                        │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  New Password                 👁️    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Confirm New Password         👁️    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Password requirements:                     │
│  • At least 8 characters                    │
│  • Include numbers and symbols              │
│  • Mix of upper and lowercase letters       │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            RESET PASSWORD           │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Similar to registration password fields
- Clear password requirements
- Focus on security

### Interactions
1. User enters new password and confirmation
2. Real-time validation for password strength
3. Form validates input on submit
4. On success, user is redirected to login screen with success message

## Confirmation Screens

### Password Reset Email Sent
```
┌─────────────────────────────────────────────┐
│                                             │
│               CLEARBOOK                     │
│         Personal Health Records             │
│                                             │
│  ✓                                          │
│                                             │
│  Check your email                           │
│                                             │
│  We've sent a password reset link to:       │
│  user@example.com                           │
│                                             │
│  The link will expire in 24 hours.          │
│                                             │
│  Didn't receive the email?                  │
│  Check your spam folder or try again        │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            BACK TO LOGIN            │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Password Reset Successful
```
┌─────────────────────────────────────────────┐
│                                             │
│               CLEARBOOK                     │
│         Personal Health Records             │
│                                             │
│  ✓                                          │
│                                             │
│  Password reset successfully                │
│                                             │
│  Your password has been updated.            │
│  You can now log in with your new password. │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            LOG IN                   │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

## Navigation Header with Logout (Present on all authenticated screens)

```
┌─────────────────────────────────────────────┐
│  CLEARBOOK    Dashboard  |  ☰  👤 ⋮        │
└─────────────────────────────────────────────┘
```

### Logout Confirmation
```
┌─────────────────────────────────────────┐
│                                         │
│  Confirm Logout                         │
│                                         │
│  Are you sure you want to log out?      │
│                                         │
│   ┌─────────┐      ┌─────────────┐      │
│   │ CANCEL  │      │    LOGOUT   │      │
│   └─────────┘      └─────────────┘      │
│                                         │
└─────────────────────────────────────────┘
```

### Design Notes
- Modal dialog appears when user selects logout
- Clear options with emphasis on logout action
- Cancel option allows user to dismiss dialog
