import React, { useState } from "react"
import { useDispatch } from "react-redux"
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core"
// import { useHistory } from "react-router-dom"
import { GoogleLogin } from "react-google-login"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { useRouter } from "next/router"

// import Icon from "./icon"
import { signin, signup, social } from "../redux/actions/auth"
import useStyles from "../styles"
import Input from "../components/Input"
import { SOCIAL } from "../redux/constants/actionTypes"

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
}

const SignUp = () => {
  const [form, setForm] = useState(initialState)
  const [isSignup, setIsSignup] = useState(false)
  const dispatch = useDispatch()
  const classes = useStyles()
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword)

  const switchMode = () => {
    setForm(initialState)
    setIsSignup((prevIsSignup) => !prevIsSignup)
    setShowPassword(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(form)

    if (isSignup) {
      dispatch(signup(form, router))
    } else {
      dispatch(signin(form, router))
    }
  }

  const googleSuccess = async (res) => {
    const result = res?.profileObj
    const token = res?.tokenId

    // console.log(result, token)
    const formData = { result, token }
    try {
      dispatch(social(formData))

      router.push("/")
    } catch (error) {
      console.log(error)
    }
  }

  const googleError = () =>
    alert("Google Sign In was unsuccessful. Try again later")

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignup ? "Sign up" : "Sign in"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
          <GoogleLogin
            clientId="130210432692-s3478sh4iit1c0jk5um30834vcgl96ll.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color="primary"
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                // startIcon={<Icon />}
                variant="contained"
              >
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default SignUp
