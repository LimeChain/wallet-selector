import type { FormEventHandler } from "react";
import React from "react";

interface SignDelegateActionFormProps {
  onSubmit: FormEventHandler;
}

const SignDelegateActionForm: React.FC<SignDelegateActionFormProps> = ({
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>Sign Delegate Action</p>
        <p className="highlight">
          <label htmlFor="message">Message:</label>
          <input autoComplete="off" autoFocus id="message" required />
        </p>
        <button type="submit">Sign Delegate Action</button>
      </fieldset>
    </form>
  );
};

export default SignDelegateActionForm;
