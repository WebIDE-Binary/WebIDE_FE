export async function login(email, password) {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const loginUrl = `${baseUrl}/api/users/login`;
    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "로그인 실패");
        }
        return data;
    } catch (error) {
        console.error("로그인 과정에서 오류가 발생했습니다:", error);
        throw error;
    }
}



export async function signUpUser(userData) {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const signupUrl = `${baseUrl}/api/users/signup`;
    try {
        const response = await fetch(signupUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || "회원가입 실패");
        }
    } catch (error) {
        console.error('Error during the signup process:', error);
        throw error;
    }
}


export async function checkEmailAvailability(email) {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const checkEmailUrl = `${baseUrl}/api/users/signup/{email}`;
    try {
        const response = await fetch(checkEmailUrl, {
            method: 'POST'
        });

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || "이메일 중복 검사 중 오류가 발생했습니다.");
        }
    } catch (error) {
        console.error('Error during the email availability check:', error);
        throw error;
    }
}
