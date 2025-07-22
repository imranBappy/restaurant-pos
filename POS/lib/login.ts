const mutation = `
     mutation MyMutation($email: String!, $password: String!) {
         loginUser(email: $email, password: $password) {
             message
             success
             token
             user {
                 role {
                     name
                     id
                 }
                 email
                 id
                 name
                 phone
                 photo
             }
         }
     }
 `;

interface VARIABLES {
    email: string;
    password: string;
}

export const loginUserFormServer = async (credentials: VARIABLES) => {
    try {
        const url = process.env.NEXT_PUBLIC_URI || "http://demo3.localhost:8000/graphql/"

        console.log({ url });

        if (!url) {
            throw new Error('Login faild!');
        }

        // const data = await fetch(url, {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         query: mutation,
        //         variables: {
        //             email: credentials?.email,
        //             password: credentials?.password,
        //         },
        //     }),
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // }).then((res) => res.json())
        // console.log({ data });

        // if (!data?.data?.loginUser?.success)
        //     throw new Error('Invalid credentials');
        const data = {
            "data": {
                "loginUser": {
                    "message": "Login successful.",
                    "success": true,
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1NDExNzIzLCJvcmlnSWF0IjoxNzUyODE5NzIzLjMwNTI3NiwibmFtZSI6bnVsbCwiZW1haWwiOiJkZW1vM0BnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJwaG90byI6bnVsbH0.KiT_UayMkxoIpvxZh9_3OpLEEVEH_k2ISUO9r5wyyf8",
                    "user": {
                        "role": {
                            "name": "ADMIN",
                            "id": "1"
                        },
                        "email": "demo3@gmail.com",
                        "id": "1",
                        "name": null,
                        "phone": null,
                        "photo": null
                    }
                }
            }
        }
        const user = data?.data?.loginUser.user;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user?.role?.name,
            photo: user.photo,
            token: data?.data?.loginUser.token,
        };
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
};
