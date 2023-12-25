import { useEffect, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'

import { Form, Submit, FieldError } from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import HeaderWithRulers from 'src/components/HeaderWithRulers/HeaderWithRulers'
import ShowHidePassword from 'src/components/ShowHidePassword/ShowHidePassword'

const ResetPasswordPage = ({ resetToken }: { resetToken: string }) => {
  const { isAuthenticated, reauthenticate, validateResetToken, resetPassword } =
    useAuth()
  const [enabled, setEnabled] = useState(true)

  const formMethods = useForm()
  const password = useRef()
  password.current = formMethods.watch('password', '')

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.dashboard())
    }
  }, [isAuthenticated])

  useEffect(() => {
    const validateToken = async () => {
      const response = await validateResetToken(resetToken)
      if (response.error) {
        setEnabled(false)
        toast.error(response.error)
      } else {
        setEnabled(true)
      }
    }
    validateToken()
  }, [resetToken, validateResetToken])

  const passwordRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    passwordRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await resetPassword({
      resetToken,
      password: data.password,
    })

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Password changed!')
      await reauthenticate()
      navigate(routes.login())
    }
  }

  return (
    <>
      <Metadata title="Reset Password" />

      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />

      <HeaderWithRulers className="mb-6 text-white" heading="RESET PASSWORD" />
      <Form
        onSubmit={onSubmit}
        className="auth-form"
        noValidate
        formMethods={formMethods}
      >
        <div className="field">
          <ShowHidePassword
            label="New Password"
            name="password"
            autoComplete="new-password"
            errorClassName="error"
            disabled={!enabled}
            ref={passwordRef}
            validation={{
              required: {
                value: true,
                message: 'New Password is required',
              },
            }}
          />

          <FieldError name="password" className="error-message" />
        </div>

        <div className="field">
          <ShowHidePassword
            label="Confirm Password"
            name="confirm-password"
            autoComplete="confirm-password"
            errorClassName="error"
            disabled={!enabled}
            ref={passwordRef}
            validation={{
              required: {
                value: true,
                message: 'Confirm Password is required',
              },
              validate: (value: string) =>
                password.current === value || 'The passwords do not match',
            }}
          />

          <FieldError name="confirm-password" className="error-message" />
        </div>

        <Submit disabled={!enabled}>Submit</Submit>
      </Form>
      <div className="auth-links">
        <Link to={routes.signup()}>Need an account?</Link>
      </div>
    </>
  )
}

export default ResetPasswordPage
