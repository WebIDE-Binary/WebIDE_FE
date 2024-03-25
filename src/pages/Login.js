import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService';
import './Login.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function LoginForm({ onSignUpClick }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await login(email, password);
            setSnackbarMessage(`로그인 성공: ${data.data.nickName}`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSignUpClick = () => {
        navigate('/signup'); // 회원가입 페이지로 이동합니다.
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="mb-20">
                <div className="form-group">
                    <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" />
                </div>
                <div className="form-group">
                    <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">로그인</button>
            </form>
            <div className="text-center">
                <button onClick={handleSignUpClick} className="btn btn-secondary">회원가입</button>
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default LoginForm;
