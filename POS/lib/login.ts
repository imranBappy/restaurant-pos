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
        // const url = process.env.NEXT_PUBLIC_URI;
        const url = "http://localhost:8000/graphql/";

        if (!url) {
            throw new Error('Login faild!');
        }

        const data = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                query: mutation,
                variables: {
                    email: credentials?.email,
                    password: credentials?.password,
                },
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json());
        console.log(data);
        
        if (!data?.data?.loginUser?.success)
            throw new Error('Invalid credentials');

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
