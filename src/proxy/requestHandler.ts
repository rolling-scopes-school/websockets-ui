import {ResponseTypes} from "./types";
import {userImpl} from "../users/users";


export class RequestHandler {
    user: any
    constructor(user) {
        this.user = user
    }
    typeRecognition(response) {


        console.log('JSON.stringify(response)', JSON.parse(JSON.stringify(JSON.parse(response))))
        const parsedRes = JSON.parse(response)
        const parsedResData = JSON.parse(parsedRes.data)
        console.log('!parsedRes', {parsedRes, parsedResData})
        const {type} = parsedRes

        switch (type) {
            case ResponseTypes.reg:
                return this.regHandler(parsedResData)
                break;
            case ResponseTypes.create_room:
                break;
            case ResponseTypes.add_ship:
                break;
            case ResponseTypes.update_room:
                console.log('ResponseTypes.update_room')
                break;
            case ResponseTypes.add_user_to_room:
                break;
            case ResponseTypes.attack:
                break;
            case ResponseTypes.start_game:
                break;
            case ResponseTypes.turn:
                break;
            case ResponseTypes.randomAttack:
                break;
            case ResponseTypes.finish:
                break;
            case ResponseTypes.single_play:
                break;
        }
    }

    regHandler(response) {
        console.log('regHandler_response', response)
        const {name, password} = response
        console.log('regHandler', {name, password})
        const currentUser = this.user.findUserByNameAndPass(name, password)

        if (currentUser) {
            return {
                type: ResponseTypes.reg,
                data: JSON.stringify({
                    name: currentUser.name,
                    index: currentUser.userId,
                    error: false,
                    message: ''
                }),
                id: 0
            }
        } else {
            const newUser = this.user.createUser(name, password)
            return {
                type: ResponseTypes.reg,
                data: {
                    name: newUser.name,
                    index: newUser.userId,
                    error: false,
                    message: ''
                },
                id: 0
            }
        }
    }
}

export const requestHandlerImpl = new RequestHandler(userImpl)