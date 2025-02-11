import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

// Mock the HTML structure
const dom = new JSDOM(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test</title>
</head>
<body>
    <input type="text" id="username">
    <input type="password" id="password">
    <button id="newAccount-projRep-form-submit" disabled>Submit</button>
    <div id="newAccount-projRep-errorInUsername"></div>
    <div id="newAccount-projRep-errorInPassword"></div>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window as any;

// Import the functions to test
import { checkUsername, checkPassword } from './authentication';

describe('Authentication Tests', () => {
    let usernameInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;
    let submitButton: HTMLButtonElement;
    let usernameError: HTMLElement;
    let passwordError: HTMLElement;

    beforeEach(() => {
        usernameInput = document.getElementById('username') as HTMLInputElement;
        passwordInput = document.getElementById('password') as HTMLInputElement;
        submitButton = document.getElementById('newAccount-projRep-form-submit') as HTMLButtonElement;
        usernameError = document.getElementById('newAccount-projRep-errorInUsername') as HTMLElement;
        passwordError = document.getElementById('newAccount-projRep-errorInPassword') as HTMLElement;

        // Reset values
        usernameInput.value = '';
        passwordInput.value = '';
        submitButton.disabled = true;
        usernameError.innerHTML = '';
        passwordError.innerHTML = '';

        // Initialize event listeners
        checkUsername();
        checkPassword();
    });

    it('should validate username correctly', () => {
        usernameInput.value = 'validuser';
        usernameInput.dispatchEvent(new window.Event('keyup'));
        expect(usernameError.innerHTML).to.equal('✅ The username is valid.');
        expect(submitButton.disabled).to.be.true;
    });

    it('should invalidate username with special characters', () => {
        usernameInput.value = 'invalid$user';
        usernameInput.dispatchEvent(new window.Event('keyup'));
        expect(usernameError.innerHTML).to.include('Invalid character present');
        expect(submitButton.disabled).to.be.true;
    });

    it('should invalidate short username', () => {
        usernameInput.value = 'abc';
        usernameInput.dispatchEvent(new window.Event('keyup'));
        expect(usernameError.innerHTML).to.include('The username must be at least 4 characters long.');
        expect(submitButton.disabled).to.be.true;
    });

    it('should validate password correctly', () => {
        passwordInput.value = 'validpassword';
        passwordInput.dispatchEvent(new window.Event('keyup'));
        expect(passwordError.innerHTML).to.equal('✅ The password is valid.');
        expect(submitButton.disabled).to.be.true;
    });

    it('should invalidate password with spaces', () => {
        passwordInput.value = 'invalid password';
        passwordInput.dispatchEvent(new window.Event('keyup'));
        expect(passwordError.innerHTML).to.include('The password cannot contain spaces.');
        expect(submitButton.disabled).to.be.true;
    });

    it('should invalidate short password', () => {
        passwordInput.value = 'short';
        passwordInput.dispatchEvent(new window.Event('keyup'));
        expect(passwordError.innerHTML).to.include('The password should be at least 8 characters long.');
        expect(submitButton.disabled).to.be.true;
    });

    it('should invalidate long password', () => {
        passwordInput.value = 'a'.repeat(65);
        passwordInput.dispatchEvent(new window.Event('keyup'));
        expect(passwordError.innerHTML).to.include('The password should be less than 64 characters long.');
        expect(submitButton.disabled).to.be.true;
    });

    it('should enable submit button when both username and password are valid', () => {
        usernameInput.value = 'validuser';
        usernameInput.dispatchEvent(new window.Event('keyup'));
        passwordInput.value = 'validpassword';
        passwordInput.dispatchEvent(new window.Event('keyup'));
        expect(submitButton.disabled).to.be.false;
    });
});
