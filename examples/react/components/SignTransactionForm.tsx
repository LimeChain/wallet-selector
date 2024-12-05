import React from "react";
import type { Account } from "../interfaces";
import type { FormEventHandler } from "react";

interface Props {
  account: Account;
  onSubmit: FormEventHandler;
  handleSignTx: (message: string) => Promise<void>;
}

const SignTransactionForm: React.FC<Props> = ({
  account,
  onSubmit,
  handleSignTx,
}) => {
  const [message, setMessage] = React.useState("");

  return (
    <form onSubmit={onSubmit} className="sign-transaction-form">
      <fieldset id="fieldset">
        <p>Sign & Send Transaction separately, {account.account_id}!</p>
        <p className="highlight">
          <label htmlFor="message">Message:</label>
          <input
            autoComplete="off"
            autoFocus
            id="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </p>
        <button
          type="button"
          onClick={() => {
            handleSignTx(message);
          }}
        >
          Sign Transaction
        </button>
        <button type="submit">Send Signed Transaction</button>
      </fieldset>
    </form>
  );
};

export default SignTransactionForm;
