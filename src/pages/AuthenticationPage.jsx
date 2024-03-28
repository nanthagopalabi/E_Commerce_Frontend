import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LightPurpleButton } from '../utils/buttonStyles';
import { authUser } from '../redux/userHandle';
import styled from 'styled-components';
import Popup from '../components/Popup';

const AuthenticationPage = ({ mode, role }) => {
    const bgpic = "https://static.vecteezy.com/system/resources/previews/018/841/567/original/local-post-office-2d-isolated-illustration-female-consumer-picking-up-parcel-from-employee-flat-characters-on-cartoon-background-colorful-editable-scene-for-mobile-website-presentation-vector.jpg"

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, response } = useSelector(state => state?.user);

    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [formErrors, setFormErrors] = useState({
        email: false,
        password: false,
        userName: false,
        shopName: false
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        const email = event?.target?.email?.value;
        const password = event?.target?.password?.value;

        if (!email || !password) {
            setFormErrors(prevState => ({
                ...prevState,
                email: !email,
                password: !password
            }));
            return;
        }

        if (mode === "Register") {
            const name = event?.target?.userName?.value;

            if (!name) {
                setFormErrors(prevState => ({
                    ...prevState,
                    userName: !name
                }));
                return;
            }

            if (role === "Seller") {
                const shopName = event?.target?.shopName?.value;

                if (!shopName) {
                    setFormErrors(prevState => ({
                        ...prevState,
                        shopName: !shopName
                    }));
                    return;
                }

                const sellerFields = { name, email, password, role, shopName }
                dispatch(authUser(sellerFields, role, mode))
            }
            else {
                const customerFields = { name, email, password, role }
                dispatch(authUser(customerFields, role, mode))
            }
        }
        else if (mode === "Login") {
            const fields = { email, password }
            dispatch(authUser(fields, role, mode))
        }
        setLoader(true)
    };

    const handleDemo = async (event) => {
        event.preventDefault();
        const email = "welcum2nantha@gmail.com";
        const password = "12345678";
        const fields = { email, password };

        try {
            setLoader(true);
            await dispatch(authUser({ email, password }, role, mode));
        } catch (error) {
            setMessage("Demo login failed. Please try again.");
            setShowPopup(true);
        } finally {
            setLoader(false);
        }
    };

    const handleInputChange = (event) => {
        const { name } = event?.target;
        setFormErrors(prevState => ({
            ...prevState,
            [name]: false
        }));
    };

    useEffect(() => {
        if (status === 'success') {
            navigate('/');
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, response]);

    return (
        <>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                           t?.palette?.mode === 'light' ? t?.palette?.grey[50] : t?.palette?.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <StyledTypography>
                            {role} {mode}
                        </StyledTypography>

                        {role === "Seller" && mode === "Register" &&
                            <Typography variant="body1">
                                Create your own shop by registering as a seller.
                                <br />
                                You will be able to add products and sell them.
                            </Typography>
                        }

                        {role === "Customer" && mode === "Register" &&
                            <Typography variant="body1">
                                Register now <br />
                                to explore and buy products.
                            </Typography>
                        }

                        {mode === "Login" &&
                            <Typography variant="body1">
                                Welcome back!<br />
                                Please enter your details
                            </Typography>
                        }

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {mode === "Register" &&
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="userName"
                                        label="Enter your name"
                                        name="userName"
                                        autoComplete="name"
                                        autoFocus
                                        variant="standard"
                                        error={formErrors.userName}
                                        helperText={formErrors.userName && 'Name is required'}
                                        onChange={handleInputChange}
                                    />
                                    {role === "Seller" &&
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="shopName"
                                            label="Create your shop name"
                                            name="shopName"
                                            autoComplete="off"
                                            variant="standard"
                                            error={formErrors.shopName}
                                            helperText={formErrors.shopName && 'Shop name is required'}
                                            onChange={handleInputChange}
                                        />
                                    }
                                </>
                            }
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Enter your email"
                                name="email"
                                autoComplete="email"
                                variant="standard"
                                error={formErrors.email}
                                helperText={formErrors.email && 'Email is required'}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                autoComplete="current-password"
                                variant="standard"
                                error={formErrors.password}
                                helperText={formErrors.password && 'Password is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loader ? <CircularProgress size={24} color="primary" /> : mode}
                            </LightPurpleButton>
                            <LightPurpleButton
                                type="click"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleDemo}
                            >
                                {loader ? <CircularProgress size={24} color="primary" /> : "Demo"}
                            </LightPurpleButton>
                            <Grid container>
                                <Grid>
                                    {mode === "Register" ?
                                        "Already have an account?"
                                        :
                                        "Don't have an account?"
                                    }
                                </Grid>
                                <Grid item sx={{ ml: 2 }}>
                                    <StyledLink to={mode === "Register" ? `/${role}login` : `/${role}register`}>
                                        {mode === "Register" ? "Log in" : "Sign up"}
                                    </StyledLink>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
}

export default AuthenticationPage;

const StyledLink = styled(Link)`
    margin-top: 9px;
    text-decoration: none;
    color: #7f56da;
`;

const StyledTypography = styled.h4`
    margin: 0;
    font-weight: 400;
    font-size: 2.125rem;
    line-height: 1.235;
    letter-spacing: 0.00735em;
    color: #2c2143;
    margin-bottom: 16px;
`;