import React, { useState, useEffect } from "react";
import Form, { FormInput } from "../Form";
import Button from "../Button";
import NotFound from "../NotFound";

function ForgotPassword() {
  let [email, setEmail] = useState("");
  let [resend, setResend] = useState(false);
  let [resendTime, setResendTime] = useState(0);
  let [submitForm, setSubmitForm] = useState(false);
  let [fetchStatus, setFetchStatus] = useState({
    type: "warning",
    message: "",
    error: "",
    success: "",
  });

  const handelChange = (e) => {
    let value = e.target.value;
    setEmail(value);
    resend && setResend(false);
    fetchStatus.message &&
      setFetchStatus((prev) => ({
        ...prev,
        type: "warning",
        message: "",
        error: "",
        success: "",
      }));
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    setSubmitForm(true);
  };
  const handelTryAgain = (e) => {
    setEmail("");
    setResend(false);
    setResendTime(0);
    setSubmitForm(false);
    setFetchStatus({
      type: "warning",
      message: "",
      error: "",
      success: "",
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let cancel = false;
    let timerId = null;
    (async () => {
      if (submitForm) {
        let res = await fetch("/users/forgot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
          signal,
        });

        if (!cancel) {
          if (res.status === 200) {
            let result = await res.json();
            setEmail(result.email);
            setSubmitForm(false);
            setResend(true);
            setResendTime(60);
            setFetchStatus((prev) => ({
              ...prev,
              type: "success",
              message: result.message,
              success: "",
              error: "",
            }));
          }

          if (res.status === 400) {
            let result = await res.json();
            setSubmitForm(false);
            setResend(false);
            setResendTime(0);
            setFetchStatus((prev) => ({
              ...prev,
              type: "warning",
              message: result.error.message,
              error: "",
              success: "",
            }));
          }

          if (res.status === 429) {
            let result = await res.json();
            setSubmitForm(false);
            
            if (result.error.name === "ResendError") {
              setResend(true);
              setResendTime(result.error.time);
              setFetchStatus((prev) => ({
                ...prev,
                type: "warning",
                message: result.error.message,
                error: "ResendError",
                success: "",
              }));
            }
            if (result.error.name === "ResetAttemptEnd") {
              setResend(false);
              setResendTime(0);
              setFetchStatus((prev) => ({
                ...prev,
                type: "warning",
                message: result.error.message,
                error: "ResetAttemptEnd",
                success: "",
              }));
            }
          }

          if (res.status === 500) {
            setSubmitForm(false);
            setResend(false);
            setResendTime(0);
            setFetchStatus((prev) => ({
              ...prev,
              type: "warning",
              message: "",
              error: "ServerError",
              success: "",
            }));
          }
        }
      }
    })();

    if (resendTime) {
      timerId = setTimeout(() => {
        resendTime === 1 &&
          setFetchStatus((prev) => ({
            ...prev,
            type: "warning",
            message: "",
            error: "",
            success: "",
          }));
        setResendTime((resendTime) => resendTime - 1);
      }, 1000);
    }

    return () => {
      controller.abort();
      cancel = true;
      clearTimeout(timerId);
    };
  }, [submitForm, resendTime]);

  return (
    <div className="forgot-home">
      {fetchStatus.error === "ServerError" ? (
        <NotFound
          code="5xx"
          message="Something goes wrong, Try after some time"
          redirectLink="/"
          redirectLinkName="Home"
          redirectTime={8}
        />
      ) : (
        <div className="authe-form">
          <div
            className={fetchStatus.type}
            style={{ visibility: fetchStatus.message ? "visible" : "hidden" }}
          >
            {fetchStatus.message || "Enter your registered Email"}
          </div>
          {fetchStatus.error === "ResetAttemptEnd" ? (
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <Button className="secondary-btn" onClick={handelTryAgain}>
                Try For Different Account
              </Button>
            </div>
          ) : (
            <Form onSubmit={handelSubmit}>
              <FormInput
                type="email"
                name="email"
                value={email}
                placeholder="Enter Your Registered Email"
                onChange={handelChange}
                required={true}
                disabled={resendTime}
              />
              <Button
                type="submit"
                className="secondary-btn submit-btn"
                loader={submitForm}
                disabled={resendTime}
              >
                {resend
                  ? resendTime
                    ? `Resend in ${resendTime}`
                    : "Resend"
                  : "Continue"}
              </Button>
            </Form>
          )}
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
