"use client";

export default function ContactForm({ className, successMessage, children }) {
  function handleSubmit(event) {
    event.preventDefault();
    const status = event.currentTarget.querySelector("#form-status");
    if (status) status.textContent = successMessage;
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
