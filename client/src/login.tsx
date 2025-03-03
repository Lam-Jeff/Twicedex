import React, { useContext, useRef } from "react";
import { AuthContext } from "./authProvider";
export const Login = () => {
    const { signIn, signUp, forgotPassword } = useContext(AuthContext);
    const buttonRef = useRef<string | null>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    /**
     * Get name of the clicked button.
     * 
     * @param {React.MouseEvent<HTMLElement>} event - click event
     */
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        buttonRef.current = event.currentTarget.id;
    }

    /**
     * Submit form.
     * 
     * @param {React.MouseEvent<HTMLElement>} event - click event
     */
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.currentTarget;
        let email = target.email.value;
        let password = target.password.value;
        let id = buttonRef.current;
        if (id === "login-button") signIn(email, password);
        else if (id === "signup-button") signUp(email, password);
        target.reset();
    };

    const handleForgotPassword = () => {
        if (emailRef.current)
            forgotPassword(emailRef.current.value);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleFormSubmit} className="login-container__form">
                <div className="login-container__form-control">
                    <label className="login-container__form-control__label">
                        <span className="login-container__form-control__label__email-span">Email</span>
                    </label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        className="login-container__form-control__input-email"
                        aria-label="Enter email"
                        ref={emailRef}
                    />
                </div>
                <div className="login-container__form-control">
                    <label className="login-container__form-control__label">
                        <span className="login-container__form-control__label__password-span">Password</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="login-container__form-control__input-password"
                        aria-label="Enter password"
                    />
                </div>
                <button className="login-container__form-control__forgot-password-button" onClick={handleForgotPassword}>Forgot your password?</button>
                <div className="login-container__form-control__buttons">
                    <button id="login-button"
                        className="login-container__form-control__buttons-login"
                        aria-label="Click to login"
                        onClick={e => handleClick(e)}>Login</button>
                    <button id="signup-button" className="login-container__form-control__buttons-signup" aria-label="Click to create account" onClick={e => handleClick(e)}>Sign Up</button>
                </div>
            </form>
        </div>
    )
}