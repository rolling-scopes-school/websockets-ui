interface IUser {
    name: string
    password: string,
    userId: string
    ships?: []
    room?: string
}

export class Users {
    userList: IUser[] = []

    setUser(user) {
        this.userList.push(user)
    }

    getUser(userId) {
        return this.userList.find((user) => user.userId === userId)
    }

    createUser(name: string, password: string) {
        console.log('createUser', {name, password})
        const newUser = {
            name: name,
            password: password,
            userId: (Date.now() + Math.random()).toString()
        }
        this.userList.push(newUser)
        return newUser
    }

    findUserByNameAndPass(name, password) {
        return this.userList.find((user) => (user.name === name && user.password === password))
    }

    checkIsUser(userId) {
        return !!this.userList.find((user) => user.userId === userId)
    }
}

export const userImpl = new Users()