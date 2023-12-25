import { useRef } from 'react'
import { useEffect } from 'react'

import { Form, Label, TextField, FieldError, Submit } from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import HeaderWithRulers from 'src/components/HeaderWithRulers/HeaderWithRulers'
import ShowHidePassword from 'src/components/ShowHidePassword/ShowHidePassword'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.dashboard())
    }
  }, [isAuthenticated])

  // focus on email box on page load
  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await signUp({
      username: data.email,
      password: data.password,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('Welcome!')
    }
  }

  return (
    <>
      <Metadata title="Signup" />

      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <HeaderWithRulers className="mb-6 text-white" heading="SIGNUP" />
      <Form onSubmit={onSubmit} className="auth-form">
        <div className="field">
          <Label name="name" errorClassName="error">
            Name
          </Label>
          <TextField
            name="name"
            errorClassName="error"
            placeholder=""
            validation={{
              required: {
                value: true,
                message: 'Name is required',
              },
            }}
          />
          <FieldError name="name" className="error-message" />
        </div>
        <div className="field">
          <Label name="email" errorClassName="error">
            Email
          </Label>
          <TextField
            name="email"
            errorClassName="error"
            ref={emailRef}
            placeholder=""
            validation={{
              required: {
                value: true,
                message: 'Email is required',
              },
            }}
          />
          <FieldError name="email" className="error-message" />
        </div>

        <div className="field">
          <ShowHidePassword
            label="Password"
            name="password"
            errorClassName="error"
            autoComplete="current-password"
            validation={{
              required: {
                value: true,
                message: 'Password is required',
              },
            }}
          />
          <FieldError name="password" className="error-message" />
        </div>
        <Submit>Sign Up</Submit>
      </Form>
      <div className="auth-links">
        <Link to={routes.login()}>Ready to login?</Link>
      </div>
    </>
  )
}

export default SignupPage
